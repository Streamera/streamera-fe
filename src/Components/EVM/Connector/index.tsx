import MetaMaskOnboarding from '@metamask/onboarding';
import React, { useState, useEffect, useRef } from 'react';
import { ButtonProps } from './types';
import { toast } from 'react-toastify';

const OnboardingButton: React.FC<ButtonProps> = ({ handleNewAccount, handleChainChange, onFinishLoading, children, style, className, }: ButtonProps) => {
    const [isDisabled, setDisabled] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [chain, setChain] = useState('');
    const [accounts, setAccounts] = useState<string[]>([]);
    const onboarding = useRef<MetaMaskOnboarding>();
    const interval = useRef<NodeJS.Timer>();

    useEffect(() => {
        if (!onboarding.current) {
            onboarding.current = new MetaMaskOnboarding();
        }
    }, []);

    useEffect(() => {
        if(isLoading) {
            return;
        }
        
        onFinishLoading();
    }, [isLoading, onFinishLoading])

    useEffect(() => {
        if(isLoading) {
            return;
        }

        if (MetaMaskOnboarding.isMetaMaskInstalled()) {
            if (accounts.length > 0) {
                setDisabled(true);
                handleNewAccount(accounts[0]);

                setChain(window.ethereum!.chainId ?? '');

                if(onboarding.current) {
                    onboarding.current.stopOnboarding();
                }
            } 
            
            else {
                handleNewAccount('');
                setChain('');
                setDisabled(false);
            }
        }
    }, [accounts, isLoading, handleNewAccount]);

    useEffect(() => {
        handleChainChange(chain);
    }, [handleChainChange, chain]);

    useEffect(() => {
        if (MetaMaskOnboarding.isMetaMaskInstalled()) {
            setTimeout(() => {
                if(!window.ethereum || !window.ethereum.isConnected()) {
                    window.ethereum!
                        .request({ method: 'eth_requestAccounts' })
                        .then((newAccounts: any) => { 
                            setAccounts(newAccounts); 
                            setIsLoading(false); 
                        })
                        .catch(() => { setIsLoading(false); });
                    return;
                }
                
                // get connected address
                if(!window.ethereum.selectedAddress) {
                    setDisabled(false);
                    setIsLoading(false);
                    return;
                }

                setChain(window.ethereum.chainId ?? '');
                setAccounts([window.ethereum.selectedAddress]);
                setIsLoading(false);
            }, 500);

            /* const onAccountsChanged = (newAccounts: unknown) => {
                if(Array.isArray(newAccounts)) {
                    if(typeof(newAccounts[0] === 'string')) {
                        setAccounts(newAccounts);
                    }
                }

                else {
                    setAccounts([]);
                }
            } */

            // window.ethereum!.on('accountsChanged', onAccountsChanged);

            /* const onChainChanged = (hexId: unknown) => {
                setChain(hexId as string);
            }; */

            //window.ethereum!.on('chainChanged', onChainChanged);

            return () => {
                // window.ethereum!.removeListener('accountsChanged', onAccountsChanged);
                // window.ethereum!.removeListener('chainChanged', onChainChanged);
            };
        }

        else {
            setDisabled(false);
            setIsLoading(false);
        }
    }, []);

    // force requests
    useEffect(() => {
        if(interval.current) {
            clearInterval(interval.current);
            interval.current = undefined;
        }

        interval.current = setInterval(async() => {
            if(!window.ethereum) {
                return;
            }
    
            let obtainedChainId = await window.ethereum!.request({ method: 'eth_chainId' });
    
            // hex id
            if(chain !== obtainedChainId) {
                setChain(obtainedChainId as string);
            }

            let obtainedAccounts = await window.ethereum!.request({ method: 'eth_accounts' }) as string[];
            if(obtainedAccounts[0] !== accounts[0]) {
                setAccounts(obtainedAccounts);
            }
        }, 500);
    }, [ chain, accounts ]);

    const onClick = () => {
        if (MetaMaskOnboarding.isMetaMaskInstalled()) {
            window.ethereum!
                .request({ method: 'eth_requestAccounts' })
                .then((newAccounts: any) => setAccounts(newAccounts))
                .catch((e: any) => toast.error('User rejected connection!'));
        } else {
            if(onboarding.current) {
                onboarding.current.startOnboarding();
            }
        }
    };

    if(!window.ethereum) {
        return (
            <button 
                style={style}
                className={className}
                onClick={() => { window.location.href = `https://metamask.io/download/`; }}
            >
                {children}
            </button>
        )
    }

    return (
        <button 
            disabled={isDisabled} 
            onClick={onClick}
            style={style}
            className={className}
        >
            {children}
        </button>
    );
}

export default OnboardingButton;