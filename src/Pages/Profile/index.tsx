import { ChangeEvent, useCallback, useContext, useEffect, useRef, useState } from 'react';
import './styles.scss';
import { cloneObj, ellipsizeThis } from '../../common/utils';
import { AddressContext, SquidContext } from '../../App';
import axios from '../../Services/axios';
import { User, UserDetails, UserDetailsKeys } from './types';
import _ from 'lodash';
import { useCookies } from 'react-cookie';
import { toast } from 'react-toastify';
import { Select } from 'antd';

const Page = () => {
    const [pfp, setPfp] = useState<string>("");
    const [cookies] = useCookies(['signatures']);
    
    //inputs
    const [userDetails, setUserDetails] = useState<UserDetails>({
        id: 0,
        name: "",
        display_name: "",
        to_chain: "",
        to_token_address: "",
        facebook: "",
        instagram: "",
        twitter: "",
        twitch: "",
        tiktok: "",
        youtube: "",
    });

    // for display purposes only
    const [toTokenSymbol, setToTokenSymbol] = useState("");
    const [toChainName, setToChainName] = useState("");

    const { address } = useContext(AddressContext);
    const { supportedChains, supportedTokens } = useContext(SquidContext);

    let inputRef = useRef<any>(null);

    const onSetPfpClick = useCallback(() => {
        if(!inputRef || !inputRef.current) {
            return;
        }

        inputRef.current.click();
    }, []);

    const onPfpValueChanged = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setPfp(URL.createObjectURL(event.target.files[0]));
        }
    }, []);

    const onUserDetailsChanged = useCallback((value: string, param: UserDetailsKeys) => {
        let cloned = cloneObj(userDetails);
        if(!cloned) {
            // not cloned
            return;
        }

        if(param === "id") {
            // cant change id
            return;
        }

        cloned[param] = value;

        if(param === "to_chain") {
            let supportedToken = supportedTokens[value][0]?.address ?? "";
            cloned["to_token_address"] = supportedToken;
        }
        setUserDetails(cloned);
    }, [ userDetails, supportedTokens ]);

    useEffect(() => {
        const getUser = async() => {
            let res = await axios.post<User[]>('/user/find', { wallet: address });
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

            setUserDetails(userDetails);
        }

        getUser();
    }, [address, supportedChains, supportedTokens]);

    // change to token symbol
    useEffect(() => {
        if(!supportedTokens[userDetails.to_chain]) {
            setToTokenSymbol("");
            return;
        }

        let symbol = supportedTokens[userDetails.to_chain].filter(x => x.address === userDetails.to_token_address)[0]?.symbol ?? "";
        setToTokenSymbol(symbol);
        
        let chainName = supportedChains.filter(x => x.chainId.toString() === userDetails.to_chain)[0]?.name ?? "";
        setToChainName(chainName);
    }, [userDetails.to_token_address, userDetails.to_chain, supportedTokens, supportedChains]);

    // save button
    const onSaveClick = useCallback(async() => {
        if(!address) {
            toast.error('Not logged in');
            return;
        }

        if(!userDetails) {
            toast.error('Empty user details');
            return;
        }

        let signature = cookies['signatures']?.[address];
        if(!signature) {
            toast.error('Missing signature');
            return;
        }

        if(!toTokenSymbol) {
            toast.error('Missing token');
            return;
        }
        
        let omitted = _(userDetails).omitBy(_.isEmpty).omit("id").value();
        let updateUserDetails = {
            ...omitted, // omit id and all empty inputs
            to_token_symbol: toTokenSymbol,
            address,
            signature
        };

        let res = await axios.post(`/user/update/${userDetails.id}`, updateUserDetails);
        if(!res.data.success) {
            toast.error("Error saving data");
            return;
        }

        toast.success("Updated");
        return;
    }, [address, userDetails, cookies, toTokenSymbol]);

    return (
        <div className='profile-page'>
            <input ref={inputRef} type="file" className='d-none' name="profile" onChange={onPfpValueChanged} accept='image/jpeg, image/png'></input>
            <div className="pfp-container">
                <button onClick={onSetPfpClick}>
                    {

                        pfp?
                        <img src={pfp} alt="pfp" /> :
                        <i className='fa fa-user'></i>
                    }
                </button>

                <input type="text" className="form-control mt-3" placeholder='Display Name' value={userDetails.display_name} onChange={(e) => onUserDetailsChanged(e.target.value, "display_name")}/>
            </div>
            <div className="row mt-5 justify-content-between">
                <div className="col-sm-12 col-md-5">
                    <strong>Social Media</strong>
                    <div className="input-group">
                        <div className="input-group-prepend">
                            <div className="input-group-text">Facebook</div>
                        </div>
                        <input type="text" className="form-control" placeholder="Facebook" value={userDetails.facebook} onChange={(e) => onUserDetailsChanged(e.target.value, "facebook")}/>
                    </div>
                    <div className="input-group">
                        <div className="input-group-prepend">
                            <div className="input-group-text">Twitter</div>
                        </div>
                        <input type="text" className="form-control" placeholder="Twitter" value={userDetails.twitter} onChange={(e) => onUserDetailsChanged(e.target.value, "twitter")}/>
                    </div>
                    <div className="input-group">
                        <div className="input-group-prepend">
                            <div className="input-group-text">Twitch</div>
                        </div>
                        <input type="text" className="form-control" placeholder="Twitch" value={userDetails.twitch} onChange={(e) => onUserDetailsChanged(e.target.value, "twitch")}/>
                    </div>
                    <div className="input-group">
                        <div className="input-group-prepend">
                            <div className="input-group-text">Instagram</div>
                        </div>
                        <input type="text" className="form-control" placeholder="Instagram" value={userDetails.instagram} onChange={(e) => onUserDetailsChanged(e.target.value, "instagram")}/>
                    </div>
                    <div className="input-group">
                        <div className="input-group-prepend">
                            <div className="input-group-text">TikTok</div>
                        </div>
                        <input type="text" className="form-control" placeholder="TikTok" value={userDetails.tiktok} onChange={(e) => onUserDetailsChanged(e.target.value, "tiktok")}/>
                    </div>
                    <div className="input-group">
                        <div className="input-group-prepend">
                            <div className="input-group-text">Youtube</div>
                        </div>
                        <input type="text" className="form-control" placeholder="Youtube" value={userDetails.youtube} onChange={(e) => onUserDetailsChanged(e.target.value, "youtube")}/>
                    </div>
                </div>
                <div className="col-sm-12 col-md-5">
                    <strong>Donation Settings</strong>
                    <div className="input-group">
                        <div className="input-group-prepend">
                            <div className="input-group-text">streamera.com/donate/</div>
                        </div>
                        <input type="text" className="form-control" placeholder="Username" value={userDetails.name} onChange={(e) => onUserDetailsChanged(e.target.value, "name")}/>
                    </div>
                    <div className="input-group">
                        <div className="input-group-prepend">
                            <div className="input-group-text">Wallet</div>
                        </div>
                        <input type="text" className="form-control" value={ellipsizeThis(address, 6, 6)} disabled/>
                    </div>
                    <div className="input-group">
                        <div className="input-group-prepend">
                            <div className="input-group-text">Chain</div>
                        </div>
                        <Select
                            style={{ flex: 1, textAlign: 'left' }}
                            options={supportedChains.map(x => {
                                return {
                                    label: x.name,
                                    value: x.chainId.toString(),
                                }
                            })}
                            onChange={value => { onUserDetailsChanged(value, 'to_chain'); }}
                            value={toChainName}
                        >
                        </Select>
                    </div>
                    <div className="input-group">
                        <div className="input-group-prepend">
                            <div className="input-group-text">Token</div>
                        </div>
                        <Select
                            style={{ flex: 1, textAlign: 'left' }}
                            options={supportedTokens[userDetails.to_chain]?.map(x => {
                                return {
                                    label: x.symbol,
                                    value: x.address,
                                }
                            })}
                            onChange={value => { onUserDetailsChanged(value, 'to_token_address'); }}
                            value={toTokenSymbol}
                        >
                        </Select>
                    </div>
                    <div className="button-container">
                        <button 
                            className='save' 
                            onClick={onSaveClick} 
                            disabled={!address} 
                            style={{cursor: address? 'pointer' : 'no-drop'}}
                        >
                            {address? 'Save' : 'Connect to Continue'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Page;