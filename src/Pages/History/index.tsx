import { AddressContext } from '../../App';
import './styles.scss'
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { Card } from 'react-bootstrap';
import { Empty } from 'antd';

import { useCallback, useContext, useEffect, useState } from 'react';
import axios from '../../Services/axios';
import { HistoryDataRaw, HistoryData, PaymentData } from './types';
import { ellipsizeThis, getBaseUrl } from '../../common/utils';
import _ from 'lodash';
import { ChainConfigs } from '../../Components/EVM';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration.js';
dayjs.extend(duration);

const chains = ChainConfigs;

const Page = () => {
    let { chain, chainId, address } = useContext(AddressContext);
    let [ history, setHistory ] = useState<HistoryData>({ send: [], receive: [] });

    const getTxs = useCallback(async() => {
        let res = await axios.get<HistoryDataRaw>(`/payment/history/${address.toLowerCase()}`);

        if (_.has(res.data, 'data')) {
            setHistory(res.data.data!);
        }
    }, [address])

    useEffect(() => {
        getTxs();
    }, [address, getTxs]);

    const HistoryLog = useCallback((data: PaymentData[]) => {
        let component: JSX.Element[] = [];
        let index = 0;
        for (let d of data) {
            // destination this
            const destChain = _.find(chains, { numericId: d.to_chain });
            const currChain = _.find(chains, { numericId: d.from_chain });

            const axelarScan = d.to_chain === d.from_chain ? `${destChain?.blockExplorerUrl}/tx/` : `https://testnet.axelarscan.io/gmp/`;

            const cardFooterEnd = ( d.updated_at &&
                <div className="card-footer-start">
                    <i className="mdi mdi-check-all"></i>{' '}{dayjs(d.updated_at).format('YYYY-MM-DD HH:mm:ss')}
                </div>
            )
            component.push(
                <div key={`bridge-ticket-index-${index++}`} className="w-100 h-100">
                    <Card className="bridge-ticket" border="light">
                        <Card.Header className={destChain!.evmChain}>
                            <div className="ticket-header">
                                <span className="ticket-header-title">
                                    {dayjs.duration(dayjs().diff(d.created_at)).asMinutes() < 10 && _.isNil(d.updated_at) ? <i className='mdi mdi-new-box mdi-red'></i> : !_.isNil(d.updated_at) ? <i className='mdi mdi-check-all'></i> : ''}
                                    {' '}
                                    {/* can put string here */}
                                </span>
                                <span className="ticket-header-info">
                                    {/* can put string here */}
                                    &nbsp;<a target="_blank" rel="noopener noreferrer" href={`${axelarScan}${d.tx_hash}`}>
                                        <i className="fas fa-receipt"></i>&nbsp;
                                        {ellipsizeThis(d.tx_hash, 8, 8)}
                                    </a>
                                </span>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <Card.Title>
                                <div className="ticket-bridging-location">
                                    <div className="col-5">
                                        <a className='ticket-bridging-url' target="_blank" rel="noopener noreferrer" href={`${axelarScan}${d.tx_hash}`}>
                                            <img className="ticket-bridging-chain" src={`/Chains/${d.from_chain}.png`} alt="bridging"/> {currChain?.shortName}
                                            <div className='sender'>
                                                <i className="fas fa-user"></i> &nbsp;{ellipsizeThis(d.from_wallet, 4, 4)}
                                            </div>
                                        </a>
                                    </div>
                                    <div className="col-2 d-flex align-items-center">
                                        <i className="mdi mdi-airplane-takeoff"></i>
                                    </div>
                                    <div className="col-5">
                                        <a className='ticket-bridging-url' target="_blank" rel="noopener noreferrer" href={`${axelarScan}${d.tx_hash}`}>
                                            <img className="ticket-bridging-chain" src={`/Chains/${d.to_chain}.png`} alt="bridging"/> {destChain?.shortName}
                                            <div className='sender'>
                                                <i className="fas fa-user"></i> &nbsp;{ellipsizeThis(d.to_wallet, 4, 4)}
                                            </div>
                                        </a>
                                    </div>
                                </div>
                            </Card.Title>
                            <Card.Body className="card-text">
                                <div className="ticket-body">
                                    <div className="row p-0 m-0 ticket-body-table">
                                        <div className="col-6">
                                            <strong>Token</strong>
                                        </div>
                                        <div className="col-6">
                                            <strong>Worth</strong>
                                        </div>
                                        <div className="col-6">
                                            <div className="ticket-body-token">
                                                <b>{d.from_token_symbol}</b>
                                                &nbsp;<i className="fas fa-random"></i>&nbsp;
                                                <b>{d.to_token_symbol}</b>
                                            </div>
                                        </div>
                                        <div className="col-6">
                                            <b className='ticket-token-worth'>{`$${d.usd_worth}`}</b>
                                        </div>
                                    </div>
                                </div>

                                <div className={`card-footer ${destChain!.evmChain}`}>
                                    <div className="card-footer-start">
                                        <i className="mdi mdi-alarm"></i>{' '}{dayjs(d.created_at).format('YYYY-MM-DD HH:mm:ss')}
                                    </div>
                                    {cardFooterEnd}
                                </div>
                            </Card.Body>
                        </Card.Body>
                    </Card>

                </div>
            );
        }

        return <>{component}</>
    }, []);

    return (
        <div className={'history-page'}>
            <div className='history-container'>
                <Tabs
                    defaultActiveKey="send"
                    id="history-tab"
                    className="history-tab mb-3"
                    fill
                >
                    <Tab eventKey="send" title={<span><i className='fas fa-paper-plane'></i> Send</span>}>
                        {/* sent tx */}
                        <div className={`history-log ${history.send.length === 0? 'empty' : ''}`}>
                            { 
                                history.send.length > 0 &&
                                HistoryLog(history.send)
                            }
                            { 
                                history.send.length === 0 &&
                                <Empty />
                            }
                        </div>
                    </Tab>

                    <Tab eventKey="receive" title={<span><i className="fas fa-wallet"></i> Receive</span>}>
                        {/* received tx */}
                        <div className={`history-log ${history.receive.length === 0? 'empty' : ''}`}>
                            { 
                                history.receive.length > 0 &&
                                HistoryLog(history.receive)
                            }
                            { 
                                history.receive.length === 0 &&
                                <Empty />
                            }
                        </div>
                    </Tab>

                </Tabs>
            </div>
        </div>
    );
};

export default Page;