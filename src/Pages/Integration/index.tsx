import { ChangeEvent, useCallback, useContext, useEffect, useState } from 'react';
import './styles.scss'
import { IntegrationButtonType, Webhook } from './types';
import axios from '../../Services/axios';
import { AddressContext } from '../../App';
import { toast } from 'react-toastify';
import { User } from '../../types';
import { cloneObj } from '../../common/utils';
import { useCookies } from 'react-cookie';

const Page = () => {
    const [ cookies ] = useCookies(['signatures']);
    const [ activeTab, setActiveTab ] = useState<IntegrationButtonType>("discord");
    const [ webhook, setWebhook ] = useState<Webhook>();

    const { address } = useContext(AddressContext);

    const getWebhookData = useCallback(async(user: User) => {
        let res = await axios.post<Webhook[]>('/webhooks/find', { user_id: user.id, type: activeTab });

        if(res.data.length === 0) {
            toast.error('Unable to get data');
            return;
        }

        setWebhook(res.data[0]);
    }, [ activeTab ]);

    const onSave = useCallback(async() => {
        if(!webhook?.value) {
            toast.error("Please provide a webhook url.")
            return;
        }

        if(!webhook.template) {
            toast.error("Please provide a template");
            return;
        }

        let res = await axios.post(`/webhooks/update/${webhook.id}`, {
            value: webhook.value,
            template: webhook.template,
            signature: cookies['signatures'][address],
        });

        if(!res.data.success) {
            toast.error("Error saving data");
            return;
        }

        toast.success("Edited");
    }, [ webhook, cookies, address ]);

    const onTest = useCallback(async() => {
        try {
            if(!webhook?.id) {
                toast.error("Missing webhook!");
                return;
            }
            await axios.post(`/webhooks/test/${webhook.id}`);
            toast.success("Command sent!");
        }

        catch {
            toast.error("Error reaching webhook");
        }
    }, [ webhook ]);

    const onValueChanged = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        let cloned = cloneObj(webhook);
        if(!cloned) {
            return;
        }
        cloned.value = e.target.value;
        setWebhook(cloned);
    }, [webhook]);

    const onTemplateChanged = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        let cloned = cloneObj(webhook);
        if(!cloned) {
            return;
        }
        cloned.template = e.target.value;
        setWebhook(cloned);
    }, [webhook]);

    useEffect(() => {
        const getUserData = async() => {
            let res = await axios.post<User[]>('/user/find', { wallet: address });
            if(!res.data[0]) {
                return;
            }

            let user = res.data[0];
            getWebhookData(user);
        }

        getUserData();
    }, [ address, activeTab, getWebhookData ]);

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
                        <input className='form-control' type="text" placeholder='https://discord.com/api/webhooks/...' onChange={onValueChanged} value={webhook?.value ?? ""}/>
                        <strong className='mt-3'>Notification Template</strong>
                        <input className='form-control' type="text" placeholder='Received {{amount}} from {{donator}}' onChange={onTemplateChanged} value={webhook?.template ?? ""}/>
                        <span style={{fontSize: 10}}>{'{{amount}} and {{donator}} will be replaced with actual amount and donator'}</span>
                        <div className="button-container">
                            <button className='save' onClick={onSave}>Save</button>
                            <button className='test' onClick={onTest}>Test Notification</button>
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
                        <input className='form-control' type="text" placeholder='https://yourcustomwebhook/...' onChange={onValueChanged} value={webhook?.value ?? ""}/>
                        <strong className='mt-3'>Notification Template</strong>
                        <input className='form-control' type="text" placeholder='Received {{amount}} from {{donator}}' onChange={onTemplateChanged} value={webhook?.template ?? ""}/>
                        <span style={{fontSize: 10}}>{'{{amount}} and {{donator}} will be replaced with actual amount and donator'}</span>
                        <div className="button-container">
                            <button className='save' onClick={onSave}>Save</button>
                            <button className='test' onClick={onTest}>Test Notification</button>
                        </div>
                    </>
                }
            </div>
        </div>
    );
}

export default Page;