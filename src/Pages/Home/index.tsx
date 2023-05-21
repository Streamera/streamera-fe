import { useCallback, useContext, useEffect, useState } from 'react';
import './styles.scss'
import { Link } from 'react-router-dom';
import { AddressContext } from '../../App';
import _ from 'lodash';
import axios from '../../Services/axios';
import { Buffer } from 'buffer';
import { getSignaturePassword } from '../../common/utils';
import { useCookies } from 'react-cookie';
import { toast } from 'react-toastify';

const Page = () => {
    const { address } = useContext(AddressContext);
    const [cookies, setCookie, removeCookie] = useCookies([ 'signatures' ]);
    const [isVerified, setIsVerified] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    /* useEffect(() => {
        removeCookie('signatures');
    }, [ removeCookie ]); */

    useEffect(() => {
        // we will check signature in backend
        setIsVerified(!!cookies?.signatures?.[address]);
    }, [ address, cookies ]);

    // callbacks
    const registerAddress = useCallback(async(signature: string) => {
        let signatures = cookies['signatures'];
        let formData = new FormData();
        formData.append('wallet', address);
        formData.append('signature', signature);
        formData.append('name', address);
        try {
            let res = await axios.post('/user', {
                wallet: address,
                signature,
                name: address
            });

            if(!res.data.success) {
                toast.error('Unable to sign in.');
                setIsLoading(false);
                return;
            }

            console.log('created new address');
            setIsVerified(true);

            // path = / for all paths
            setCookie("signatures", { ...signatures, [address]: signature }, { path: '/' });
            setIsLoading(false);
            return;
        }

        catch(e) {
            setIsVerified(false);
            toast.error('Unable to sign in.');
            setIsLoading(false);
            return;
        }

    }, [ cookies, setCookie, address ]);

    const verifyAddress = useCallback(async (signature: string) => {
        setIsLoading(true);

        let signatures = cookies['signatures'];
        // if has streamer, verify if signature matches
        try {
            let verifyRes = await axios.post('/user/find', {
                wallet: address,
                signature
            });
    
            let isVerified = verifyRes.data && verifyRes.data.length > 0;
            if(!isVerified) {
                toast.error('Verification failed!');
                setIsLoading(false);
                return;
            }

            // path = / for all paths
            setCookie("signatures", { ...signatures, [address]: signature }, { path: '/' });

            setIsVerified(true);
            setIsLoading(false);
            return;
        }

        catch(e) {
            toast.error('Verification failed!');
            setIsVerified(false);
            setIsLoading(false);
            return;
        }

    }, [ cookies, address, setCookie ]);

    const onVerifyClick = useCallback(async () => {
        // ask for signature
        const signMessage = `This message is to prove that you're the owner of this address!`;
        let signature: any = "";
        try {
            // For historical reasons, you must submit the message to sign in hex-encoded UTF-8.
            // This uses a Node.js-style buffer shim in the browser.
            const msg = `0x${Buffer.from(signMessage, 'utf8').toString('hex')}`;
            const pw = getSignaturePassword();
            signature = await window.ethereum!.request({
                method: 'personal_sign',
                params: [msg, address, pw],
            });

        } catch (err) {
            console.log(err);
            setIsVerified(false);
            return;
        }

        let streamerRes = await axios.post("/user/find", {
            wallet: address,
        });

        if(streamerRes.data.length === 0) {
            await registerAddress(signature);
            return;
        }

        await verifyAddress(signature);
        return;
        
    }, [ address, registerAddress, verifyAddress ]);

    return (
        <div className='home-page'>
            {
                isLoading &&
                <div className="d-flex align-items-center justify-content-center" style={{ height: '100vh', width: '100vw' }}>           
                    <i className="fa fa-spinner fa-spin fa-4x"></i>
                </div>
            }
            {
                !isLoading &&
                !isVerified &&
                <div className="d-flex align-items-center justify-content-center" style={{ height: '100vh', width: '100vw' }}>           
                    <button onClick={onVerifyClick}>Verify to Continue</button>
                </div>

            }
            {
                !isLoading &&
                isVerified &&
                <div className="link-button-container">
                    <Link to="/overlay" className='link-button'>Overlay</Link>
                    <Link to="/history" className='link-button'>History</Link>
                    <Link to="/integration" className='link-button'>Integration</Link>
                    <Link to="/profile" className='link-button'>Profile</Link>
                </div>
            }
        </div>
    );
}

export default Page;