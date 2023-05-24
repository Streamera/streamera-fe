import { useParams } from 'react-router';
import './styles.scss'
import { Button, Input, InputNumber, Select, Tooltip } from 'antd';
import { useCallback, useContext, useState, useEffect } from 'react';
import { AddressContext, SquidContext } from '../../App';
import { ellipsizeThis } from '../../common/utils';
import ContractCall from '../../Components/EVM/ContractCall';
import { toast } from 'react-toastify';
import { UserDetails } from '../Profile/types';
import axios from '../../Services/axios';
import { User } from '../../types';
import dayjs from 'dayjs';
import { PaymentData, PaymentReturn } from './types';
import { TokenData } from '@0xsquid/sdk';
import { ethers } from 'ethers';

const availableChainLogo = [5, 97, 1287, 4002, 43113, 80001];
const loadText: string[] = [
    'Getting quote...',
    'Preparing tips...'
]

const Page = ({ shouldHide } : { shouldHide: boolean }) => {
    let { streamerAddress } = useParams();
    let [ loaderText, setLoaderText ] = useState<string>(loadText[0]);
    let [ showLoader, setShowLoader ] = useState<boolean>(false);
    let [ fromAmount, setFromAmount ] = useState<number>(0.01);
    let [ fromTokenWorth, setFromTokenWorth ] = useState<string>(`≈ $0.00`);
    let [ fromTokenAddress, setFromTokenAddress ] = useState<string>("0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE");
    let [ fromTokenData, setFromTokenData ] = useState<TokenData | null>(null);
    let [ fromChainLogo, setFromChainLogo ] = useState<string>("");
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

    // need to set after getting data from backend
    // using select value for now
    let [ toChain, setToChain ] = useState<number>(-1);

    let { supportedChains, supportedTokens, squid } = useContext(SquidContext);
    let { chain, chainId, address } = useContext(AddressContext);


    const getUsdWorthFromSquid = useCallback(async(cid: number, tadd: string) => {
        let res = await axios.get(`https://testnet.api.0xsquid.com/v1/token-price?chainId=${cid}&tokenAddress=${tadd}`);

        if(!res.data?.price) {
            return;
        }
        return res.data.price;
    }, []);

    const updateUsdToFromAmount = useCallback(async(selectedUsd: number) => {
        // call squid
        const price = await getUsdWorthFromSquid(chainId, fromTokenAddress);

        if (selectedUsd > 0) {
            const tokenAmount = Math.round(selectedUsd / price * 10000) / 10000;
            setFromAmount(tokenAmount);
            // console.log(`tokenAmount: ${tokenAmount}`);
            // console.log(`fromAmount: ${fromAmount}`);
            // console.log(`updateUsdToFromAmount`);
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
        await axios.post<PaymentReturn[]>('/payment', data);
    }, []);

    const onPayClick = useCallback(async() => {
        if(!streamerAddress) {
            setShowLoader(false);
            return;
        }

        setLoaderText(loadText[0]);
        setShowLoader(true);

        let contractCall = new ContractCall(chain);

        // same chain
        if(toChain === chainId) {
            try {
                setLoaderText(loadText[1]);
                // fromTokenAddress format = chainName|tokenAddress
                const tx: any = await contractCall.localSwap({
                    sender: address,
                    recipient: streamerAddress,
                    fromTokenAddress: fromTokenAddress,
                    //fromTokenAddress: '0x337610d27c682E347C9cD60BD4b3b107C9d34dDd',
                    fromTokenAmount: fromAmount.toString(),

                    // get from backend
                    toTokenAddress: userDetails.to_token_address,
                    //toTokenAddress: '0x337610d27c682E347C9cD60BD4b3b107C9d34dDd',
                });

                console.log(tx);

                await InsertPayment({
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
                toast.success(SuccessBridgeToast(tx.transactionHash));
                setShowLoader(false);
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
                //fromTokenAddress: '0x337610d27c682E347C9cD60BD4b3b107C9d34dDd',
                fromTokenAmount: fromAmount.toString(),

                // get from backend
                toChain: 43113, //avax
                toTokenAddress: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',

                // get from backend
                // aUSDC in avax fuji
                //toTokenAddress: '0x57f1c63497aee0be305b8852b354cec793da43bb',
            });

            console.log(tx);

            await InsertPayment({
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
            toast.success(SuccessBridgeToast(tx.transactionHash));
            setShowLoader(false);
        }

        catch (e: any) {
            setShowLoader(false);
            console.log(e)
            toast.error(e.message as string);
        }
    }, [InsertPayment, fromTokenData, fromTokenWorth, chain, address, streamerAddress, fromTokenAddress, fromAmount, toChain, chainId, squid, supportedChains, userDetails]);

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

    // fromChainLogo does not refresh (Need Fix!)
    // for from chain logo display (sender)
    const updateToChain = useCallback(() => {
        // set from chain logo (sender)
        const fromChainName = availableChainLogo.includes(Number(chainId)) ? chainId : 'other';
        setFromChainLogo(`/Chains/${fromChainName}.png`);
    }, [chainId]);

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

    useEffect(() => {
        // console.log(supportedTokens);
        // console.log(supportedChains);
        const getUser = async() => {
            let res = await axios.post<User[]>('/user/find', { wallet: streamerAddress!.toLowerCase() });
            if(!res.data[0]) {
                return;
            }

            let user = res.data[0];
            let userDetails: UserDetails = { ...user, ...user.social };

            if(!supportedChains.map(x => x.chainId.toString()).includes(user.to_chain)) {
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

        const setUsdWorth = async() => {
            const price = await getUsdWorthFromSquid(chainId, fromTokenAddress);
            setFromTokenWorth(`≈ $${(fromAmount * price).toFixed(2)}`);
        }

        getUser();
        updateToChain();
        setUsdWorth();

        const token = supportedTokens[chainId]?.find((x) => x.address === '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE')!;
        setFromTokenData(token);

    }, [ chainId, fromAmount, fromTokenAddress, getUsdWorthFromSquid, streamerAddress, supportedChains, supportedTokens, updateToChain, fromTokenData]);

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
                            <Button onClick={() => updateUsdToFromAmount(userDetails.quick_amount?.[0])} size={'middle'}>${userDetails.quick_amount?.[0]?.toFixed(2)}</Button>
                            <Button onClick={() => updateUsdToFromAmount(userDetails.quick_amount?.[1])} size={'middle'}>${userDetails.quick_amount?.[1]?.toFixed(2)}</Button>
                            <Button onClick={() => updateUsdToFromAmount(userDetails.quick_amount?.[2])} size={'middle'}>${userDetails.quick_amount?.[2]?.toFixed(2)}</Button>
                            <Button onClick={() => updateUsdToFromAmount(userDetails.quick_amount?.[3])} size={'middle'}>${userDetails.quick_amount?.[3]?.toFixed(2)}</Button>
                        </div>
                        <strong className='mt-0 mb-1'>Tip</strong>
                        <div className="input-container mb-2">
                            <Select
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
                        <Button type="primary" size={'large'} className='tip-button' onClick={onPayClick}>
                            <i className="fas fa-gift"></i>&nbsp; Tips Now
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Page;