import { useParams } from 'react-router';
import './styles.scss'
import { Button, Input, InputNumber, Select, Tooltip } from 'antd';
import { useCallback, useContext, useState, useEffect, useRef } from 'react';
import { AddressContext, SquidContext } from '../../App';
import { ellipsizeThis } from '../../common/utils';
import ContractCall from '../../Components/EVM/ContractCall';
import { toast } from 'react-toastify';
import { UserDetails } from '../Profile/types';
import axios from '../../Services/axios';
import { User } from '../../types';
import dayjs from 'dayjs';
import { PaymentData, PaymentReturn, PaymentStatusData } from './types';
import { TokenData } from '@0xsquid/sdk';
import { ethers } from 'ethers';

const availableChainLogo = [5, 97, 1287, 4002, 43113, 80001];
const loadText: string[] = [
    'Getting quote...',
    'Preparing tips...'
]

const Page = ({ shouldHide } : { shouldHide: boolean }) => {
    const { streamerAddress } = useParams();
    const [ loaderText, setLoaderText ] = useState<string | JSX.Element>(loadText[0]);
    const [ showLoader, setShowLoader ] = useState<boolean>(false);
    const [ fromAmount, setFromAmount ] = useState<number>(0.01);
    const [ fromTokenWorth, setFromTokenWorth ] = useState<string>(`≈ $0.00`);
    const [ fromTokenAddress, setFromTokenAddress ] = useState<string>("0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE");
    const [ fromTokenData, setFromTokenData ] = useState<TokenData | null>(null);
    const [ fromChainLogo, setFromChainLogo ] = useState<string>("");
    const [ hasError, setHasError ] = useState(false);

    const [userDetails, setUserDetails] = useState<UserDetails>({
        id: 0,
        name: "",
        display_name: "",
        to_chain: "",
        to_token_address: "",
        profile_picture: "",
        facebook: "",
        instagram: "",
        twitter: "",
        twitch: "",
        tiktok: "",
        youtube: "",
        quick_amount: [],
        chain_logo: ""
    });
    const [pfp, setPfp] = useState<string>("");

    const { supportedChains, supportedTokens, squid } = useContext(SquidContext);
    const { chain, chainId, address } = useContext(AddressContext);


    const getUsdWorthFromSquid = useCallback(async(cid: number, tadd: string) => {
        try {
            let res = await axios.get(`https://testnet.api.0xsquid.com/v1/token-price?chainId=${cid}&tokenAddress=${tadd}`);
    
            if(!res.data?.price) {
                return;
            }
            return res.data.price;
        }

        catch {
            toast.error('Unable to get price!');
            return 0;
        }
    }, []);

    const updateUsdToFromAmount = useCallback(async(selectedUsd: number) => {
        // call squid
        const price = await getUsdWorthFromSquid(chainId, fromTokenAddress);

        if (selectedUsd > 0) {
            const tokenAmount = Math.round(selectedUsd / price * 10000) / 10000;
            setFromAmount(tokenAmount);
            setFromTokenWorth(`≈ $${(tokenAmount * price).toFixed(2)}`);
        }
    }, [chainId, fromTokenAddress, getUsdWorthFromSquid]);

    const SuccessBridgeToast = (tx: string) => (
        <div className='link-toast'>
            Tx Hash
            <a target="_blank" rel="noopener noreferrer" href={`/history`}>{ellipsizeThis(tx, 4, 4)}</a>
        </div>
    );

    const InsertPayment = useCallback(async(data: PaymentData) => {
        return await axios.post<PaymentReturn>('/payment', data);
    }, []);

    const UpdatePayment = useCallback(async(id: number, data: PaymentStatusData) => {
        await axios.post<PaymentReturn[]>(`/payment/update/${id}`, data);
    }, []);

    const onPayClick = useCallback(async() => {
        if(!streamerAddress) {
            setShowLoader(false);
            return;
        }

        setLoaderText(loadText[0]);
        setShowLoader(true);

        let contractCall = new ContractCall(chain);
        let toChain = Number(userDetails.to_chain);

        // same chain
        if(toChain === chainId) {
            try {
                setLoaderText(loadText[1]);
                // fromTokenAddress format = chainName|tokenAddress
                const tx: any = await contractCall.localSwap({
                    sender: address,
                    recipient: streamerAddress,
                    fromTokenAddress: fromTokenAddress,
                    fromTokenAmount: fromAmount.toString(),
                    toTokenAddress: userDetails.to_token_address,
                });

                console.log(tx);

                const payment = await InsertPayment({
                    from_user: null,
                    from_wallet: address.toLowerCase(),
                    from_chain: chainId,
                    from_token_symbol: fromTokenData?.symbol!,
                    from_token_address: fromTokenAddress,
                    from_amount: (ethers.utils.parseUnits(fromAmount.toString(), fromTokenData?.decimals)).toString(),
                    to_user: userDetails.id,
                    to_wallet: streamerAddress.toLowerCase(),
                    to_chain: toChain,
                    to_token_symbol: userDetails.to_token_symbol!,
                    to_token_address: userDetails.to_token_address,
                    // to_amount: string,
                    tx_hash: tx.transactionHash,
                    usd_worth: fromTokenWorth.replace('≈ $', '')
                });

                setShowLoader(false);
                if (tx.status !== 1) {
                    await UpdatePayment(Number(payment.data.data.id), { status: 'failed' });
                    toast.error(SuccessBridgeToast(tx.transactionHash));
                } else {
                    toast.success(SuccessBridgeToast(tx.transactionHash), { autoClose: 15000, pauseOnHover: true, closeOnClick: false });                }
            }

            catch (e: any) {
                setShowLoader(false);
                toast.error(e.message as string);
            }
            return;
        }

        if(!squid) {
            setShowLoader(false);
            throw Error("Squid Router not initialized!");
        }

        let squidChains = supportedChains.filter(x => x.chainId === chainId);
        if(squidChains.length === 0){
            setShowLoader(false);
            throw Error("Network not supported!");
        }

        try {
            setLoaderText(loadText[1]);
            // fromTokenAddress format = chainName|tokenAddress
            const tx: any = await contractCall.bridgeSwap({
                squid,
                sender: address,
                recipient: streamerAddress,
                fromChain: chainId,
                fromTokenAddress: fromTokenAddress,
                fromTokenAmount: fromAmount.toString(),
                toChain,
                toTokenAddress: userDetails.to_token_address,
            });

            console.log(tx);

            const payment = await InsertPayment({
                from_user: null,
                from_wallet: address.toLowerCase(),
                from_chain: chainId,
                from_token_symbol: fromTokenData?.symbol!,
                from_token_address: fromTokenAddress,
                from_amount: (ethers.utils.parseUnits(fromAmount.toString(), fromTokenData?.decimals)).toString(),
                to_user: userDetails.id,
                to_wallet: streamerAddress.toLowerCase(),
                to_chain: Number(userDetails.to_chain),
                to_token_symbol: userDetails.to_token_symbol!,
                to_token_address: userDetails.to_token_address,
                // to_amount: string,
                tx_hash: tx.transactionHash,
                usd_worth: fromTokenWorth.replace('≈ $', '')
            });

            setShowLoader(false);
            if (tx.status !== 1) {
                await UpdatePayment(Number(payment.data.data.id), { status: 'failed' });
                toast.error(SuccessBridgeToast(tx.transactionHash));
            } else {
                toast.success(SuccessBridgeToast(tx.transactionHash), { autoClose: 15000, pauseOnHover: true, closeOnClick: false });
            }
        }

        catch (e: any) {
            setShowLoader(false);
            console.log(e)
            toast.error(e.message as string);
        }
    }, [InsertPayment, UpdatePayment, fromTokenData, fromTokenWorth, chain, address, streamerAddress, fromTokenAddress, fromAmount, chainId, squid, supportedChains, userDetails]);

    const onFromTokenAddressChange = useCallback(async(value: string) => {
        const token = supportedTokens[chainId]?.find((x) => x.address === value)!;

        setFromTokenData(token);
        setFromTokenAddress(value);

        // call squid
        const price = await getUsdWorthFromSquid(chainId, value);
        setFromTokenWorth(`≈ $${(fromAmount * price).toFixed(2)}`);
    }, [chainId, fromAmount, getUsdWorthFromSquid, supportedTokens]);

    const onFromAmountChange = useCallback(async(value: number | null) => {
        value = value ?? 0;
        setFromAmount(value);

        // call squid
        const price = await getUsdWorthFromSquid(chainId, fromTokenAddress);
        setFromTokenWorth(`≈ $${(value * price).toFixed(2)}`);
    }, [chainId, fromTokenAddress, getUsdWorthFromSquid]);

    // for from chain logo display (sender)
    const updateFromChain = useCallback(() => {
        // set from chain logo (sender)
        const fromChainName = availableChainLogo.includes(Number(chainId)) ? chainId : 'other';
        setFromChainLogo(`/Chains/${fromChainName}.png`);

        const fromTokenAddress = supportedTokens[chainId]?.[0].address ?? "";
        setFromTokenAddress(fromTokenAddress)

    }, [chainId, supportedTokens]);

    // overlay loader
    const OverlayLoader = () => {
        const webpIndex = Math.floor(Math.random() * 6);
        return (
            <div className={`loader-overlay ${showLoader ? 'active' : ''}`} style={{ display: showLoader ? 'flex' : 'none' }}>
                {/* <div className="popup"> */}
                    <div className="body">
                        <div className="phone">
                            <div className="menu">
                                <div className="time">{dayjs().format(`hh:mm`)}</div>
                                <div className="icons">
                                    <div className="network"></div>
                                    <div className="battery"></div>
                                </div>
                            </div>
                            <div>
                                {loaderText}
                            </div>
                            <div className="content">
                                <div className="circle">
                                    <img className='loader' style={{width: 'auto', height: '150px'}} alt="loading" src={`/Loader/loading${webpIndex}.webp`} />
                                    <div className="crescent">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                {/* </div> */}
            </div>
        )
    };

    // when streamer address changes
    useEffect(() => {
        const getUser = async() => {
            let res = await axios.post<User[]>('/user/find', { wallet: streamerAddress!.toLowerCase() });
            if(!res.data[0]) {
                setShowLoader(true);
                const jsxElement = <div>Wallet does not exist<br /><a href="/home">Back to home</a></div>;
                setLoaderText(jsxElement);
                return;
            }

            let user = res.data[0];
            let userDetails: UserDetails = { ...user, ...user.social };

            if(!supportedChains.map(x => x.chainId.toString()).includes(user.to_chain) && supportedChains.length > 0) {
                userDetails.to_chain = supportedChains[0].chainId.toString();
                userDetails.to_token_address = supportedTokens[supportedChains[0].chainId][0].address ?? "";
            }

            // set default value for socials
            userDetails.facebook = userDetails.facebook ?? "";
            userDetails.twitch = userDetails.twitch ?? "";
            userDetails.twitter = userDetails.twitter ?? "";
            userDetails.tiktok = userDetails.tiktok ?? "";
            userDetails.youtube = userDetails.youtube ?? "";
            userDetails.instagram = userDetails.instagram ?? "";

            // set chain logo (receiver)
            const toChainName = availableChainLogo.includes(Number(userDetails.to_chain)) ? userDetails.to_chain : 'other';
            userDetails.chain_logo = `/Chains/${toChainName}.png`;

            setUserDetails(userDetails);

            if(userDetails.profile_picture) {
                setPfp(userDetails.profile_picture);
            }
        }
        getUser();
    }, [ streamerAddress, supportedChains, supportedTokens ]);

    useEffect(() => {
        // empty chain
        if(!chainId) {
            return;
        }

        // not loaded yet
        if(!supportedTokens) {
            return;
        }

        if(!supportedTokens[chainId]) {
            toast.error('Chain not supported');
            setHasError(true);
            return;
        }

        const setUsdWorth = async() => {
            if(!fromTokenAddress) {
                // missing token
                return;
            }
            const price = await getUsdWorthFromSquid(chainId, fromTokenAddress);
            setFromTokenWorth(`≈ $${(fromAmount * price).toFixed(2)}`);
        }

        updateFromChain();
        setUsdWorth();


        let token = supportedTokens[chainId]?.find((x) => x.address === fromTokenAddress);
        if(!token) {
            token = supportedTokens[chainId]?.[0];
        }
        setFromTokenData(token);
        setHasError(false);

    }, [ chainId, fromAmount, fromTokenAddress, getUsdWorthFromSquid, streamerAddress, supportedChains, supportedTokens, updateFromChain, fromTokenData]);

    useEffect(() => {

    }, [ chainId ]);

    return (
        <div className={`payment-page ${shouldHide? 'd-none' : ''}`}>
            <OverlayLoader></OverlayLoader>

            <div className="card">
                <div className='card-box'>
                    <div className="card-img">
                        {
                            pfp?
                            <img src={pfp} alt="pfp" /> :
                            <i className='fa fa-user'></i>
                        }
                        <div className="card-details">
                        {ellipsizeThis(streamerAddress!, 2, 4)}&nbsp;<img height={'15px'} width={'15px'} src={userDetails.chain_logo} alt="suffix"/>
                        </div>
                    </div>
                </div>

                <div className="card-info">
                    <div className="text-body">
                        {/* <strong className='mb-2'>Chain</strong>
                        <Select
                            className='chain-select'
                            options={supportedChains.map((chain) => ({ label: chain.name, value: chain.chainId }))}
                            onChange={value => { onToChainChange(value); }}
                        >
                        </Select>
                        <br /> */}
                        <br />
                        <br />
                        <strong className='mt-3'>Quick Amount</strong>
                        <div className="input-container mb-0">
                            <Button disabled={!address || hasError} onClick={() => updateUsdToFromAmount(userDetails.quick_amount?.[0])} size={'middle'}>${userDetails.quick_amount?.[0]?.toFixed(2)}</Button>
                            <Button disabled={!address ||hasError} onClick={() => updateUsdToFromAmount(userDetails.quick_amount?.[1])} size={'middle'}>${userDetails.quick_amount?.[1]?.toFixed(2)}</Button>
                            <Button disabled={!address ||hasError} onClick={() => updateUsdToFromAmount(userDetails.quick_amount?.[2])} size={'middle'}>${userDetails.quick_amount?.[2]?.toFixed(2)}</Button>
                            <Button disabled={!address ||hasError} onClick={() => updateUsdToFromAmount(userDetails.quick_amount?.[3])} size={'middle'}>${userDetails.quick_amount?.[3]?.toFixed(2)}</Button>
                        </div>
                        <strong className='mt-0 mb-1'>Tip</strong>
                        <div className="input-container mb-2">
                            <Select
                                    disabled={!address ||hasError}
                                    suffixIcon={<img height={'15px'} width={'15px'} src={fromChainLogo} alt="suffix"/>}
                                    className='token-select'
                                    defaultValue={"0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"}
                                    defaultActiveFirstOption={true}
                                    options={supportedTokens[chainId]?.map((x) => {
                                        return { value: x.address, label: x.symbol }
                                    })}
                                    showArrow={true}
                                    onChange={value => { onFromTokenAddressChange(value); }}
                                >
                            </Select>
                            <InputNumber
                                disabled={!address ||hasError}
                                style={{ width: 250 }}
                                // prefix={<PayCircleOutlined className="site-form-item-icon" />}
                                addonAfter={fromTokenWorth}
                                value={Number(fromAmount)}
                                min={0.0000001}
                                controls={true}
                                onChange={(value) => { onFromAmountChange(value!)}}>
                            </InputNumber>
                        </div>
                    </div>
                    <div className="text-title">
                        <Button type="primary" size={'large'} className='tip-button' onClick={onPayClick} disabled={!address || hasError}>
                            <i className="fas fa-gift"></i>&nbsp;{address? 'Tip Now' : 'Not Connected'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Page;