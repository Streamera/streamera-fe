import 'react-toastify/dist/ReactToastify.css';
import { Route, Routes, useNavigate } from 'react-router';
import { EVMConnector, ChainConfigs, EVMSwitcher } from './Components/EVM';
import './App.scss';
import './keyframes.scss';
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify';
import { Home, Payment, Landing, Profile, Integration, Overlay, Studio, History } from './Pages';
//import { Button } from 'react-bootstrap';
import { ellipsizeThis } from './common/utils';
import { createContext, useCallback, useEffect, useRef, useState } from 'react';
import { useCurrentPath } from './Hooks/UseCurrentPath';
import { Squid, TokenData } from '@0xsquid/sdk';
import { Link } from 'react-router-dom';
import { SquidContextData, SupportedChain } from './types';
import { useCookies } from 'react-cookie';
import _ from 'lodash';

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
    chainId: 0,
    chainName: "",
});

export const SquidContext = createContext<SquidContextData>({
    squid: null,
    supportedChains: [],
    supportedTokens: {},
});

// for useCurrentPath
const routes = [
    { path: '/' },
    { path: '/profile' },
    { path: '/integration' },
    { path: '/overlay' },
    { path: '/landing' },
    { path: '/pay/:streamerAddress' },
    { path: '/studio/:streamerAddress' },
    { path: '/history' },
];

function App() {
    const [cookies, /* setCookie, removeCookie */] = useCookies([ 'signatures' ]);

    const [address, setAddress] = useState('');
    const [isVerified, setIsVerified] = useState(false);
    const [supportedChains, setSupportedChains] = useState<SupportedChain[]>([]);
    const [supportedTokens, setSupportedTokens] = useState<{ [chain: string]: TokenData[] }>({});

    const [chain, setChain] = useState('');
    const [chainId, setChainId] = useState(0);
    const [chainName, setChainName] = useState('');
    // const [isMobile, setIsMobile] = useState(false);
    const [shouldRenderLogo, setShouldRenderLogo] = useState(true);
    const [shouldRenderHeader, setShouldRenderHeader] = useState(true);
    const [shouldRenderFooter, setShouldRenderFooter] = useState(true);
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
    const handleNewAccount = useCallback(async (address: string) => {
        setIsLoading(false);
        setAddress(address);

        // no need to verify payment page
        if(currentPath === '/pay/:streamerAddress') {
            return;
        }

        if(currentPath === '/studio/:streamerAddress') {
            return;
        }

        if(!cookies) {
            navigate("/");
            return;
        }

        if(!address) {
            navigate("/");
            return;
        }

        let signatures = cookies['signatures'];
        let signature = signatures?.[address];

        // doesn't have signature, surely not verified, show button
        if(!signature) {
            navigate("/");
            return;
        }

        // we will check signature in backend
        setIsVerified(true);
    }, [ currentPath, cookies, navigate ]);

    const handleChainChange = useCallback(async (chain: string) => {
        currentChain.current = chain;
        setChain(chain);

        let chainConfig = allowedChains.filter(x => x.id === chain)[0];
        let chainName = chainConfig?.shortName ?? '';
        let chainId = chainConfig?.numericId ?? 0;
        setChainName(chainName.toLowerCase());
        setChainId(typeof(chainId) === 'number'? chainId : 0);

        setShouldShowSwitcher(
            currentPath === '/pay/:streamerAddress'
            && !allowedChains.map(x => x.id).includes(chain)
            && !!address // must be logged in
        );
    }, [currentPath, address]);

    const handleUserRejection = useCallback(() => {
        toast.error('You sure?');
    }, []);

    const handleUnknownError = useCallback(() => {
        toast.error('Portal fluids gone bad');
    }, []);

    const onFinishLoading = useCallback(() => {
		setIsLoading(false);
    }, []);

    // effects
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

    useEffect(() => {
        if(!squid) {
            return;
        }

        let supportedChains: SupportedChain[] = [];
        let supportedTokens: { [chainId: string]: TokenData[] } = {};

        let uniqueIds: string[] = [];
        squid.tokens.forEach(token => {
            let chainConfig = _.find(ChainConfigs, { numericId: token.chainId });
            let chainName = chainConfig?.name ?? token.chainId.toString();

            if(!supportedTokens[token.chainId.toString()]) {
                supportedTokens[token.chainId.toString()] = [];
            }

            supportedTokens[token.chainId.toString()].push(token);

            // only one chain per option
            if(uniqueIds.includes(token.chainId.toString())) {
                return;
            }

            uniqueIds.push(token.chainId.toString());

            supportedChains.push({
                name: chainName,
                chainId: token.chainId,
                chainLogo: token.logoURI
            });
        });

        setSupportedChains(supportedChains);
        setSupportedTokens(supportedTokens);
    }, [squid]);

    useEffect(() => {
        if(!currentPath) {
            // no random pages
            console.log('going back to /')
            navigate('/');
            return;
        } else if (currentPath === '/studio/:streamerAddress') {
            setShouldRenderHeader(false);
            setShouldRenderFooter(false);
            setShouldRenderLogo(true);

        } else if (currentPath === '/pay/:streamerAddress'){
            setShouldRenderHeader(true);
            setShouldRenderLogo(false);
            setShouldRenderFooter(false);
        } else {
            setShouldRenderHeader(true);
            setShouldRenderFooter(true);
            setShouldRenderLogo(true);
        }
    }, [currentPath, navigate, isVerified]);

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
                {
                    shouldRenderLogo &&
                    <Link to="/"><img src="/Media/Icons/logo.png" alt="logo" className='logo'/></Link>
                }

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
                    squid,
                    supportedChains,
                    supportedTokens,
                }}
            >
                <AddressContext.Provider
                    value={{
                        address,
                        chainId,
                        chain,
                        chainName,
                    }}
                >
                    {
                        isLoading &&
                        <div className="d-flex align-items-center justify-content-center" style={{ height: '100vh', width: '100vw' }}>
                        </div>
                    }
                    {
                        !isLoading &&
                        <Routes>
                            <Route path="/" element={address? <Home /> : <Landing />}></Route>
                            <Route path="/landing" element={<Landing />}></Route>
                            <Route path="/profile" element={<Profile />}></Route>
                            <Route path="/integration" element={<Integration />}></Route>
                            <Route path="/overlay" element={<Overlay />}></Route>
                            <Route path="/pay/:streamerAddress" element={<Payment shouldHide={shouldShowSwitcher}/>}></Route>
                            <Route path="/studio/:streamerAddress" element={<Studio />}></Route>
                            <Route path="/history" element={<History />}></Route>
                        </Routes>
                    }
                </AddressContext.Provider>
            </SquidContext.Provider>

			<footer className={!shouldRenderFooter ? 'd-none' : 'd-flex'}>
                <span>
				    Made with ❤️ by the Streamera Team.
                </span>
                <div className='button-with-tooltip'>
                    <ul className="wrapper">
                        <li className="icon github">
                            <span className="tooltip">Github</span>
                            <a href='https://github.com/Streamera' target='_blank' rel="noopener noreferrer"><i className="fab fa-github"></i></a>
                        </li>
                    </ul>
                </div>
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