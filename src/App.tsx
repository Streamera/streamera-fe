import 'react-toastify/dist/ReactToastify.css';
import { Route, Routes, useNavigate } from 'react-router';
import { EVMConnector, ChainConfigs, EVMSwitcher } from './Components/EVM';
import './App.scss';
import './keyframes.scss';
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify';
import { Home, QRCode, Landing } from './Pages';
//import { Button } from 'react-bootstrap';
import { ellipsizeThis } from './common/utils';
import { createContext, useCallback, useEffect, useRef, useState } from 'react';
import { useCurrentPath } from './Hooks/UseCurrentPath';
import { Squid } from '@0xsquid/sdk';

const { BSC_TEST, POLYGON_TEST, BSC, POLYGON } = ChainConfigs;
const isTestnet = process.env.REACT_APP_CHAIN_ENV === "testnet";

// assign chain info based on env
const BscChain = isTestnet ? BSC_TEST : BSC;
const PolygonChain = isTestnet ? POLYGON_TEST : POLYGON;

const allowedChains = isTestnet ? [
    BSC_TEST,
    POLYGON_TEST
] : [
    BSC,
    POLYGON
];


export const AddressContext = createContext({
    address: "",
    chain: "",
    chainName: "",
});

export const SquidContext = createContext<{ squid: Squid | null }>({
    squid: null,
});

// for useCurrentPath
const routes = [
    { path: '/' },
    { path: '/pay/:streamerId' },
];

function App() {
    const [address, setAddress] = useState('');

    const [chain, setChain] = useState('');
    const [chainName, setChainName] = useState('');
    // const [isMobile, setIsMobile] = useState(false);
    const [shouldRenderHeader, setShouldRenderHeader] = useState(true);
    const [isLoading, setIsLoading] = useState(true);

    //header will be hidden too
    const [shouldShowSwitcher, setShouldShowSwitcher] = useState(false);

    //squid router
    const [squid, setSquid] = useState<Squid | null>(null);
    let isSquidInit = useRef(false);

    const navigate = useNavigate();
    const currentPath = useCurrentPath(routes);

    //mutable chain id cause dont wanna set into infinite loop
    let currentChain = useRef("");

	// chain event handlers
    const handleNewAccount = useCallback((address: string) => {
        setIsLoading(false);
        setAddress(address);

        if(address === "") {
        }
    }, []);

    const handleChainChange = useCallback(async (chain: string) => {
        if(currentChain.current !== chain) {
            currentChain.current = chain;
            setChain(chain);
            let chainName = allowedChains.filter(x => x.id === chain)[0]?.shortName ?? '';
            setChainName(chainName.toLowerCase());
            setShouldShowSwitcher(
                currentPath !== '/'
                && !allowedChains.map(x => x.id).includes(chain)
                && !!address // must be logged in
            );
        }
    }, [currentPath, address]);

    const handleUserRejection = useCallback(() => {
        toast.error('You sure?');
    }, []);

    const handleUnknownError = useCallback(() => {
        toast.error('Portal fluids gone bad');
    }, []);

    const onFinishLoading = () => {
		setIsLoading(false);
    }

    // initial loading
    useEffect(() => {
        const initSquid = async () => {
            if(isSquidInit.current) {
                return;
            }

            // only init once
            isSquidInit.current = true;

            // instantiate the SDK
            const squid = new Squid({
                baseUrl: "https://testnet.api.0xsquid.com" // for mainnet use "https://api.0xsquid.com"
            });

            // init the SDK
            await squid.init();
            setSquid(squid);
        };

        initSquid();
    }, []);

    /* if (!window.ethereum) {
        return (
            <div className="metamask-404">
                <img src="/assets/metamask404.png" alt="404"/>
                <Button onClick={() => {
                    window.location.href = `https://metamask.io/download/`
                }}>Get Metamask</Button>
            </div>
        )
    } */

	return (
		<div className="App">
			<header className={`pc ${!shouldRenderHeader || shouldShowSwitcher? 'd-none' : 'd-flex'} w-100`}>
				<img src="/Media/Icons/logo.png" alt="logo" className='logo'/>

				{/** Connectors */}
				<div className={`connector-container`}>
					<EVMConnector
						handleNewAccount={handleNewAccount}
						handleChainChange={handleChainChange}
						onFinishLoading={onFinishLoading}
						className={`${isLoading? 'loading' : ''} metamask-connector`}
					>
						<div className={`metamask-btn ${address? 'disabled' : ''}`}>
							<img src="/metamask-logo.png" alt="metamask-logo"></img>
							<div className='metamask-text'>
								<span>{
									!window.ethereum? 'Get Metamask' :
									(address? ellipsizeThis(address, 6, 0) : 'Connect')
								}</span>
							</div>
						</div>
					</EVMConnector>

					{/* <span className={`logo-text ${address? 'd-block' : 'd-none'}`}>{ellipsizeThis(address, 5, 5)}</span> */}
				</div>
			</header>

            {
                shouldShowSwitcher &&
                address &&
                <div className='chain-chooser-container'>
                    <h1>Currently only supports these chains</h1>
                    <EVMSwitcher
                        targetChain={BscChain}
                        handleChainChange={handleChainChange}
                        handleUserRejection={handleUserRejection}
                        handleUnknownError={handleUnknownError}
                        className={'navigate-button ' + (chain === BscChain.id? 'active' : '')}
                        currentChainId={chain}
                    >
                        <span>BSC</span>
                    </EVMSwitcher>
                    <EVMSwitcher
                        targetChain={PolygonChain}
                        handleChainChange={handleChainChange}
                        handleUserRejection={handleUserRejection}
                        handleUnknownError={handleUnknownError}
                        className={'navigate-button ' + (chain === PolygonChain.id? 'active' : '')}
                        currentChainId={chain}
                    >
                        <span>Polygon</span>
                    </EVMSwitcher>
                </div>
            }

			{/** Please update routes constant if there's a new page */}
            <SquidContext.Provider
                value={{
                    squid
                }}
            >
                <AddressContext.Provider 
                    value={{
                        address,
                        chain,
                        chainName
                    }}
                >
                    <Routes>
                        <Route path="/" element={address? <Home /> : <Landing />}></Route>
                        <Route path="/landing" element={<Landing />}></Route>
                        <Route path="/pay/:streamerId" element={<QRCode />}></Route>
                    </Routes>
                </AddressContext.Provider>
            </SquidContext.Provider>

			<footer>
                <span>
				    Made with ❤️ by the Streamera Team.
                </span>
                <span>
                    Twitter and stuff
                </span>
			</footer>

			<ToastContainer
                position="bottom-left"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover={false}
                theme={'colored'}
            />
		</div>
	);
}

export default App;