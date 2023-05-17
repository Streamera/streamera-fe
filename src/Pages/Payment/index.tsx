import { useParams } from 'react-router';
import './styles.scss'
import { Button, InputNumber, Select } from 'antd';
import { useCallback, useContext, useState} from 'react';
import { AddressContext, SquidContext } from '../../App';
import { ellipsizeThis } from '../../common/utils';
import ContractCall from '../../Components/EVM/ContractCall';
import { toast } from 'react-toastify';

const Page = ({ shouldHide } : { shouldHide: boolean }) => {
    let { streamerAddress } = useParams();
    let [ fromAmount, setFromAmount ] = useState<string>("0.01");
    let [ fromTokenAddress, setFromTokenAddress ] = useState<string>("");

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

        let split = fromTokenAddress.split("|")[1].trim();
        // same chain
        if(toChain === chainId) {
            try {
                // fromTokenAddress format = chainName|tokenAddress
                await contractCall.localSwap({
                    sender: address,
                    recipient: streamerAddress,
                    fromTokenAddress: split,
                    //fromTokenAddress: '0x337610d27c682E347C9cD60BD4b3b107C9d34dDd',
                    fromTokenAmount: fromAmount,

                    // get from backend
                    toTokenAddress: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
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
                fromTokenAddress: split,
                //fromTokenAddress: '0x337610d27c682E347C9cD60BD4b3b107C9d34dDd',
                fromTokenAmount: fromAmount,

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

    const onToChainChange = useCallback((value: number) => {
        setToChain(value);
    }, []);

    const onFromTokenAddressChange = useCallback((value: string) => {
        setFromTokenAddress(value);
    }, []);

    const onFromAmountChange = useCallback((value: number | null) => {
        value = value ?? 0;
        setFromAmount(value.toString());
    }, []);

    return (
        <div className={`payment-page ${shouldHide? 'd-none' : ''}`}>
            <div className='player-image'>
                this is player image
            </div>

            <strong className='mb-2'>Chain</strong>
            <Select
                className='chain-select'
                options={supportedChains.map((chain) => ({ label: chain.name, value: chain.chainId }))}
                onChange={value => { onToChainChange(value); }}
            >
            </Select>

            <strong className='mt-3 mb-2'>Tip</strong>

            <div className="input-container mb-3">
                <InputNumber defaultValue={0.01} onChange={(value) => { onFromAmountChange(value) }}></InputNumber>
                <Select
                    className='token-select'
                    options={Object.entries(supportedTokens).map(([chainName, tokens]) => {
                        let options = tokens.map(x => ({
                            label: x.name,
                            value: chainName + "|" + x.address,
                        }));

                        return ({
                            label: chainName,
                            options,
                        });
                    })}
                    onChange={value => { onFromTokenAddressChange(value); }}
                >
                </Select>
            </div>
            <Button type="primary" className='tip-button' onClick={onPayClick}>Tip {ellipsizeThis(streamerAddress ?? "", 6, 6)} Now</Button>
        </div>
    );
}

export default Page;