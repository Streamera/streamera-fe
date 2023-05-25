import { ethers, Contract } from 'ethers';
import * as ChainConfigs from '../ChainConfigs';
import Streamera from '../../../ABI/Streamera.json';
import ERC20 from '../../../ABI/ERC20.json';
import _ from 'lodash';
import { ChainConfig } from '../ChainConfigs/types';
import { BridgeCallParam, LocalCallParam } from './types';

const chains = ChainConfigs;
export default class ContractCall {
    provider: ethers.providers.JsonRpcProvider;
    chainConfig: ChainConfig;
    signer: ethers.providers.JsonRpcSigner;
    nativeTokenAddress: string;

    constructor(chainId: string) {
        // get chain nft contract address
        const chain: any = _.find(chains, { id: chainId });
        this.chainConfig = chain;
        this.provider = new ethers.providers.Web3Provider(window.ethereum as any);
        this.signer = this.provider.getSigner();

        // default address set to 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE
        this.nativeTokenAddress = chain.nativeTokenAddress ?? '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';
    }

    _approveOrGetApproval = async (callParam: LocalCallParam | BridgeCallParam, isBridgeSwap: boolean = false) => {
        let {
            sender,
            fromTokenAddress,
            fromTokenAmount,
            toTokenAddress,
        } = callParam;

        let decimals = this.chainConfig.nativeCurrency.decimals;
        let adjustedAmount = Number(fromTokenAmount) * Math.pow(10, decimals ?? 18);
        const isFromNative = fromTokenAddress.toLowerCase() === this.nativeTokenAddress.toLowerCase();
        const isToNative = toTokenAddress.toLowerCase() === this.nativeTokenAddress.toLowerCase();

        if(!isFromNative && !this.chainConfig.wrappedNativeTokenAddress) {
            throw Error("Unable to get wrapped token address!");
        }

        // change to wrapped version
        fromTokenAddress = isFromNative && !isBridgeSwap? this.chainConfig.wrappedNativeTokenAddress! : fromTokenAddress;
        toTokenAddress = !isToNative || isBridgeSwap /* if is bridge swap then we are using the 0xeee address */? toTokenAddress : this.chainConfig.wrappedNativeTokenAddress!;
        let fromToken = new ethers.Contract(fromTokenAddress, ERC20.abi, this.signer);

        // if not from native then we need to get approvals and check token balance
        if(!isFromNative) {
            decimals = await fromToken.decimals();
            adjustedAmount = Number(fromTokenAmount) * Math.pow(10, decimals ?? 18);

            // check token balance
            const userTokenAmount = await fromToken.balanceOf(sender);
            if (Number(userTokenAmount) < adjustedAmount) {
                throw Error("Insufficient balance!");
            }
        }

        else {
            // check token balance
            const userTokenAmount = await this.provider.getBalance(sender);
            if (Number(userTokenAmount) < adjustedAmount) {
                throw Error("Insufficient balance!");
            }
        }

        if (!isFromNative) {
            const allowed = await fromToken.allowance(sender, this.chainConfig.streameraAddress);

            // do not reapprove if got enough allowance
            if (Number(allowed) < adjustedAmount) {
                let approveTx = await fromToken.approve(this.chainConfig.streameraAddress, ethers.constants.MaxUint256);
                await approveTx.wait(1);
            }
        }

        return {
            adjustedAmount,
            adjustedFromTokenAddress: fromTokenAddress,
            adjustedToTokenAddress: toTokenAddress,
            isFromNative,
            isToNative
        };
    }

    localSwap = async(callParam: LocalCallParam) => {
        if(!this.chainConfig.dexAddress) {
            throw Error("No DEXs available!");
        }

        if(!this.chainConfig.streameraAddress) {
            throw Error("Unsupported Streamera Chain!");
        }

        let {
            recipient,
        } = callParam;

        const {
            adjustedAmount,
            adjustedFromTokenAddress,
            adjustedToTokenAddress,
            isFromNative,
            isToNative,
        } = await this._approveOrGetApproval(callParam);

        let streamera = new ethers.Contract(this.chainConfig.streameraAddress, Streamera.abi, this.signer);
        const swap = await streamera.localSwap(
                                                this.chainConfig.dexAddress,
                                                adjustedFromTokenAddress,
                                                adjustedToTokenAddress,
                                                adjustedAmount.toString(),
                                                recipient,
                                                isToNative,
                                            {
                                                value: isFromNative? ethers.BigNumber.from(adjustedAmount.toString()) : ethers.BigNumber.from('0'),
                                            }
                                        );

        const tx = await swap.wait(1);
        console.log(`local swap done`);
        return tx;
    }

    bridgeSwap = async(callParam: BridgeCallParam) => {
        if(!this.chainConfig.streameraAddress) {
            throw Error("Unsupported Streamera Chain!");
        }


        let {
            squid,
            recipient,
            fromChain,
            fromTokenAddress,
            toChain,
        } = callParam;

        const {
            adjustedAmount,
            adjustedFromTokenAddress,
            adjustedToTokenAddress,
            isFromNative,
        } = await this._approveOrGetApproval(callParam, true);

        /* console.log('quote')
        console.log({
            fromChain,
            fromToken: fromTokenAddress,
            fromAmount: (BigInt(adjustedAmount) * BigInt(95) / BigInt(100)).toString(), // 95 cause 5% tax
            toChain, // Avalanche Fuji Testnet (hardcode)
            toToken: toTokenAddress,
            toAddress: recipient, // hardcode for now, need to get from backend
            slippage: 1.00, // 1.00 = 1% max slippage across the entire route
            enableForecall: true, // instant execution service, defaults to true
            quoteOnly: false // optional, defaults to false
        }); */

        const params = {
            fromChain,
            fromToken: adjustedFromTokenAddress, // use native token address for from token address
            fromAmount: (BigInt(adjustedAmount) * BigInt(95) / BigInt(100)).toString(), // 95 cause 5% tax
            toChain, // Avalanche Fuji Testnet (hardcode)
            toToken: adjustedToTokenAddress,
            toAddress: recipient, // hardcode for now, need to get from backend
            slippage: 1.00, // 1.00 = 1% max slippage across the entire route
            enableForecall: true, // instant execution service, defaults to true
            quoteOnly: false // optional, defaults to false
        };

        // get squid route info quote
        const { route } = await squid.getRoute(params);

        if(!route || !route.transactionRequest || !route.transactionRequest.data) {
            throw Error("Route not found!");
        }
        // get squid router & calldata from quote
        const sqCallData = route.transactionRequest.data;
        const sqRouter = route.transactionRequest.targetAddress

        // calculate gas cost & gas limit
        let sendNativeAmount = route.estimate.gasCosts.reduce((accumulator, currentValue) => {
            return accumulator.add(ethers.utils.parseUnits(currentValue.amount, 'wei'));
        }, ethers.utils.parseUnits('0', 'wei'));

        const sqGasLimit = route.estimate.gasCosts.reduce((accumulator, currentValue) => {
            return accumulator.add(ethers.utils.parseUnits(currentValue.limit, 'wei'));
        }, ethers.utils.parseUnits('0', 'wei'));

        // need to add native amount to gas if want to send native token
        if(isFromNative) sendNativeAmount = sendNativeAmount.add(adjustedAmount.toString());

        /* console.log('send')
        console.log({
            router: sqRouter,
            fromToken: !isFromNative? fromTokenAddress : this.nativeTokenAddress,
            sqCallData,
            fromAmount: adjustedAmount.toString(),
            gas: {
                gasLimit: sqGasLimit,
                value: sendNativeAmount
            }
        }) */
        //execute tx
        let streamera = new ethers.Contract(this.chainConfig.streameraAddress, Streamera.abi, this.signer);
        const swap = await streamera.squidSwap(
                                    sqRouter,
                                    !isFromNative? fromTokenAddress : this.nativeTokenAddress, // we use 0xeee if it's from native
                                    sqCallData,
                                    adjustedAmount.toString(),
                                    {
                                        gasLimit: sqGasLimit,
                                        value: sendNativeAmount
                                    }
                                );
        const tx = await swap.wait(1);

        console.log(`squid swap done`);

        return tx;
    }
}
