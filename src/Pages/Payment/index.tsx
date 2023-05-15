import { useParams } from 'react-router';
import './styles.scss'
import { Button, InputNumber, Select } from 'antd';
import { useContext} from 'react';
import { SquidContext } from '../../App';

const Page = () => {
    let { streamerId } = useParams();
    let { supportedChains, supportedTokens } = useContext(SquidContext);

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