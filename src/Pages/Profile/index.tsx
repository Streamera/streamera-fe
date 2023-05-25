import { ChangeEvent, useCallback, useContext, useEffect, useRef, useState } from 'react';
import './styles.scss';
import { cloneObj, ellipsizeThis } from '../../common/utils';
import { AddressContext, SquidContext } from '../../App';
import axios from '../../Services/axios';
import { UserDetails, UserDetailsKeys } from './types';
import _ from 'lodash';
import { useCookies } from 'react-cookie';
import { toast } from 'react-toastify';
import { Select } from 'antd';
import { User } from '../../types';
import { ChainConfig } from '../../Components/EVM/ChainConfigs/types';

const Page = ({ allowedChains }: { allowedChains: ChainConfig[] }) => {
    const [pfpFile, setPfpFile] = useState<File>();
    const [pfp, setPfp] = useState<string>("");
    const [cookies] = useCookies(['signatures']);

    //inputs
    const [userDetails, setUserDetails] = useState<UserDetails>({
        id: 0,
        name: "",
        display_name: "",
        to_chain: "",
        to_token_address: "",
        to_token_symbol: "",
        profile_picture: "",
        facebook: "",
        instagram: "",
        twitter: "",
        twitch: "",
        tiktok: "",
        youtube: "",
        quick_amount: []
    });

    // for display purposes only
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
            setPfpFile(event.target.files[0]);
        }
    }, []);

    const onUserDetailsChanged = useCallback((value: string, param: UserDetailsKeys, index: number | null = null) => {
        let cloned = cloneObj(userDetails);
        if(!cloned) {
            // not cloned
            return;
        }

        if(param === "id") {
            // cant change id
            return;
        }

        if (param === 'quick_amount' && index !== undefined) {
            cloned[param][index!] = Number(value);
        } else {
            cloned[param] = value as string & number[];
        }

        if (param === "to_chain") {
            let supportedToken = supportedTokens[value][0]?.address ?? "";
            cloned["to_token_address"] = supportedToken;
            cloned[param] = value.toString();
        }

        if(param === "to_token_address" || param === "to_chain") {
            let symbol = supportedTokens[cloned.to_chain.toString()].find(x => x.address === cloned.to_token_address)?.symbol ?? "";
            cloned["to_token_symbol"] = symbol;
        }

        setUserDetails(cloned);
    }, [ userDetails, supportedTokens ]);

    useEffect(() => {
        const getUser = async() => {
            let res = await axios.post<User[]>('/user/find', { wallet: address.toLowerCase() });
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

            if(userDetails.profile_picture) {
                setPfp(userDetails.profile_picture);
            }
        }

        getUser();
    }, [address, supportedChains, supportedTokens]);

    // change to token symbol
    useEffect(() => {

        let chainName = supportedChains.filter(x => x.chainId.toString() === userDetails.to_chain.toString())[0]?.name ?? "";
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

        if(!userDetails.to_token_symbol) {
            toast.error('Missing token');
            return;
        }

        let omitted = _(userDetails).omitBy(_.isEmpty).omit("id").value();

        let formData = new FormData();
        for(let [key, value] of Object.entries(omitted)) {

            if(key === "profile_picture") {
                continue;
            }

            // social is not needed
            if(key === "social") {
                continue;
            }

            if(key === "quick_amount") {
                value = JSON.stringify(value);
            }

            formData.append(key, value as string | Blob);
        }

        formData.append('address', address);
        formData.append('signature', signature);

        if(pfpFile) {
            formData.append('profile_picture', pfpFile);
        }

        // // Display the key/value pairs
        // new Response(formData).text().then(console.log)

        let res = await axios({
            url: `/user/update/${userDetails.id}`,
            method: 'POST',
            data: formData,
            headers: {
                "Content-Type": "multipart/form-data",
            }
        });

        if(!res.data.success) {
            toast.error("Error saving data");
            return;
        }

        toast.success("Updated");
        return;
    }, [address, userDetails, cookies, pfpFile]);

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
                            options={allowedChains.map(x => {
                                return {
                                    label: x.name,
                                    value: x.numericId,
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
                            options={supportedTokens[userDetails.to_chain.toString()]?.map(x => {
                                return {
                                    label: x.symbol,
                                    value: x.address,
                                }
                            })}
                            onChange={value => {
                                onUserDetailsChanged(value, 'to_token_address');
                            }}
                            value={userDetails.to_token_symbol}
                        >
                        </Select>
                    </div>

                    <strong>Quick Amount</strong>
                    <div className="input-group">
                        <input type="number" min={0.01} step={0.01} className="form-control" placeholder="3.00" value={userDetails.quick_amount?.[0] ?? 3} onChange={(e) => onUserDetailsChanged(e.target.value, "quick_amount", 0)}/>
                        <input type="number" min={0.01} step={0.01} className="form-control" placeholder="10.00" value={userDetails.quick_amount?.[1] ?? 10} onChange={(e) => onUserDetailsChanged(e.target.value, "quick_amount", 1)}/>
                        <input type="number" min={0.01} step={0.01} className="form-control" placeholder="25.00" value={userDetails.quick_amount?.[2] ?? 25} onChange={(e) => onUserDetailsChanged(e.target.value, "quick_amount", 2)}/>
                        <input type="number" min={0.01} step={0.01} className="form-control" placeholder="50.00" value={userDetails.quick_amount?.[3] ?? 50} onChange={(e) => onUserDetailsChanged(e.target.value, "quick_amount", 3)}/>
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