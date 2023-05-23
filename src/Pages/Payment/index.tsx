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
import { InfoCircleOutlined, PayCircleOutlined } from '@ant-design/icons';
const availableChainLogo = [5, 97, 1287, 4002, 43113, 80001];

const Page = ({ shouldHide } : { shouldHide: boolean }) => {
    let { streamerAddress } = useParams();
    let [ fromAmount, setFromAmount ] = useState<number>(0.01);
    let [ fromTokenWorth, setFromTokenWorth ] = useState<string>(`≈ $0.00`);
    let [ fromTokenAddress, setFromTokenAddress ] = useState<string>("0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE");
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

    const onPayClick = useCallback(async() => {
        if(!streamerAddress) {
            return;
        }

        let contractCall = new ContractCall(chain);

        // same chain
        if(toChain === chainId) {
            try {
                // fromTokenAddress format = chainName|tokenAddress
                await contractCall.localSwap({
                    sender: address,
                    recipient: streamerAddress,
                    fromTokenAddress: fromTokenAddress,
                    //fromTokenAddress: '0x337610d27c682E347C9cD60BD4b3b107C9d34dDd',
                    fromTokenAmount: fromAmount.toString(),

                    // get from backend
                    toTokenAddress: userDetails.to_token_address,
                    //toTokenAddress: '0x337610d27c682E347C9cD60BD4b3b107C9d34dDd',
                });
            }

            catch (e: any) {
                toast.error(e.message as string);
            }

            return;
        }

        if(!squid) {
            throw Error("Squid Router not initialized!");
        }

        let squidChains = supportedChains.filter(x => x.chainId === chainId);
        if(squidChains.length === 0){
            throw Error("Network not supported!");
        }

        try {
            // fromTokenAddress format = chainName|tokenAddress
            await contractCall.bridgeSwap({
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
        }

        catch (e: any) {
            console.log(e)
            toast.error(e.message as string);
        }
    }, [chain, address, streamerAddress, fromTokenAddress, fromAmount, toChain, chainId, squid, supportedChains]);

    // const onToChainChange = useCallback((value: number) => {
    //     setToChain(value);
    // }, []);

    const onFromTokenAddressChange = useCallback(async(value: string) => {
        // update selected token (for coingecko id)
        setFromTokenAddress(value);

        // call squid
        const price = await getUsdWorthFromSquid(chainId, value);
        console.log(price);
        console.log(fromAmount);
        setFromTokenWorth(`≈ $${(fromAmount * price).toFixed(2)}`);
    }, [chainId, fromAmount, fromTokenAddress]);

    const onFromAmountChange = useCallback(async(value: number | null) => {
        value = value ?? 0;
        setFromAmount(value);
        console.log(`onFromAmountChange`);

        // call squid
        const price = await getUsdWorthFromSquid(chainId, fromTokenAddress);
        setFromTokenWorth(`≈ $${(value * price).toFixed(2)}`);
    }, [chainId, fromAmount, fromTokenAddress]);

    // fromChainLogo does not refresh (Need Fix!)
    // for from chain logo display (sender)
    const updateToChain = useCallback(() => {
        // set from chain logo (sender)
        const fromChainName = availableChainLogo.includes(Number(chainId)) ? chainId : 'other';
        setFromChainLogo(`/Chains/${fromChainName}.png`);
    }, [chainId]);


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
            console.log(`tokenAmount: ${tokenAmount}`);
            console.log(`fromAmount: ${fromAmount}`);
            console.log(`updateUsdToFromAmount`);
            setFromTokenWorth(`≈ $${(tokenAmount * price).toFixed(2)}`);
        }
    }, [chainId, fromTokenAddress, fromAmount]);

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

        // const getUsdWorth = async() => {
        //     await updateUsdToFromAmount();
        // }

        getUser();
        updateToChain();
        // getUsdWorth();

        // console.log();
    }, []);

    return (
        <div className={`payment-page ${shouldHide? 'd-none' : ''}`}>
            <div className="card">
                <div className='card-box'>
                    <div className="card-img">
                        {
                            pfp?
                            <img src={pfp} alt="pfp" /> :
                            <i className='fa fa-user'></i>
                        }
                        <div className="card-details">
                        {ellipsizeThis(streamerAddress!, 2, 4)}&nbsp;<img height={'15px'} width={'15px'} src={userDetails.chain_logo} />
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
                                    suffixIcon={<img height={'15px'} width={'15px'} src={fromChainLogo} />}
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