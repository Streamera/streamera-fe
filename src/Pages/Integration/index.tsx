import { useState } from 'react';
import './styles.scss'
import { IntegrationButtonType } from './types';

const Page = () => {
    const [ activeTab, setActiveTab ] = useState<IntegrationButtonType>("discord");
    return (
        <div className='integration-page'>
            <div className="nav-container">
                <button className={activeTab === 'discord'? 'active' : ''} onClick={() => setActiveTab('discord')}>Discord</button>
                <button className={activeTab === 'custom'? 'active' : ''} onClick={() => setActiveTab('custom')}>Custom</button>
            </div>
            
            <div className="main-content">
                {
                    activeTab === 'discord' &&
                    <>
                        <h2>Discord</h2>
                        <span>Never miss another donation notification, integrate Streamera into your Discord Server now!</span>
                        <span>To integrate, follow these steps:</span>
                        <ul>
                            <li>Right Click your Discord Server</li>
                            <li>Select Server Settings {'>'} Integrations</li>
                            <li>Create Webhook</li>
                            <li>Copy Webhook URL and paste it here</li>
                            <li>Save!</li>
                        </ul>
                        <strong className='mt-3'>Webhook URL</strong>
                        <input className='form-control' type="text" placeholder='https://discord.com/api/webhooks/...'/>
                        <strong className='mt-3'>Notification Template</strong>
                        <input className='form-control' type="text" placeholder='Received {{amount}} from {{donator}}'/>
                        <span style={{fontSize: 10}}>{'{{amount}} and {{donator}} will be replaced with actual amount and donator'}</span>
                        <div className="button-container">
                            <button className='save'>Save</button>
                            <button className='test'>Test Notification</button>
                        </div>
                    </>
                }
                {
                    activeTab === 'custom' &&
                    <>
                        <h2>Custom Website</h2>
                        <span>Never miss another donation notification, integrate Streamera into your Server now!</span>
                        <span>Save your webhook url here!</span>
                        <strong className='mt-3'>Webhook URL</strong>
                        <input className='form-control' type="text" placeholder='https://yourcustomwebhook/...'/>
                        <strong className='mt-3'>Notification Template</strong>
                        <input className='form-control' type="text" placeholder='Received {{amount}} from {{donator}}'/>
                        <span style={{fontSize: 10}}>{'{{amount}} and {{donator}} will be replaced with actual amount and donator'}</span>
                        <div className="button-container">
                            <button className='save'>Save</button>
                            <button className='test'>Test Notification</button>
                        </div>
                    </>
                }
            </div>
        </div>
    );
}

export default Page;