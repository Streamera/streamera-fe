import { useParams } from 'react-router';
import './styles.scss'
import { Button, InputNumber, Select } from 'antd';
import { useContext, useEffect, useState } from 'react';
import { AddressContext, SquidContext } from '../../App';
import { SupportedChain } from './types';
import { ChainConfigs } from '../../Components/EVM';
import _ from 'lodash';
import { ChainConfig } from '../../Components/EVM/ChainConfigs/types';
import { TokenData } from '@0xsquid/sdk';

const Page = () => {
    let { streamerId } = useParams();
    let { squid } = useContext(SquidContext);
    let { chain } = useContext(AddressContext);
    const [supportedChains, setSupportedChains] = useState<SupportedChain[]>([]);
    const [supportedTokens, setSupportedTokens] = useState<{ [chain: string]: TokenData[] }>({});

    useEffect(() => {
        if(!squid) {
            return;
        }

        let supportedChains: SupportedChain[] = [];
        let supportedTokens: { [chain: string]: TokenData[] } = {};

        let uniqueIds: string[] = [];
        squid.tokens.forEach(token => {
            let chainConfig = _.find(ChainConfigs, { numericId: token.chainId });
            let chainName = chainConfig?.name ?? token.chainId.toString();

            if(!supportedTokens[chainName]) {
                supportedTokens[chainName] = [];
            }

            supportedTokens[chainName].push(token);

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

    return (
        <div className='payment-page'>
            <div className='player-image'>
                this is player image
            </div>

            <strong className='mb-2'>Chain</strong>
            <Select
                className='chain-select'
                options={supportedChains.map((chain) => ({ label: chain.name, value: chain.chainId }))}
            >
            </Select>

            <strong className='mt-3 mb-2'>Tip</strong>

            <div className="input-container mb-3">
                <InputNumber defaultValue={0.01}></InputNumber>
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
                >
                </Select>
            </div>
            <Button type="primary" className='tip-button'>Tip {streamerId} Now</Button>
        </div>
    );
}

export default Page;