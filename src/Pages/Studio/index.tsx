import { useParams } from 'react-router';
import './styles.scss'
import { Button, InputNumber, Select } from 'antd';
import { useCallback, useContext, useEffect, useState} from 'react';
import { ellipsizeThis, getWsUrl, sleep } from '../../common/utils';
import { toast } from 'react-toastify';
import { io, Socket } from 'socket.io-client';
import { StartStudioParams } from './types';

//dont auto connect cause react will connect it immediately upon loading
// const socket = io(getWsUrl(), { autoConnect: false});
const socket = io(getWsUrl());

const Page = () => {
    const { streamerAddress } = useParams();

    // const startStudio = async({ address }: StartStudioParams) => {
    //     while(socket.disconnected) {
    //         console.log(`socket.disconnected: ${socket.disconnected}`);
    //         // wait for socket to connect
    //         await sleep(100);
    //     }

    //     if(address) {
    //         socket.emit('start_studio', {address});
    //     }
    // };

    useEffect(() => {
        socket.emit('start_studio', {address: streamerAddress});

        // upon connection
        socket.on("connect", () => {
            console.log("connected");
        });

        // upon disconnection
        socket.on("disconnect", (reason) => {
            console.log(`disconnected due to ${reason}`);
        });

        socket.on('init', (data) => {
            console.log(data);
        });

        socket.on(`test`, (data) => {
            console.log(data);
        });

    }, [streamerAddress]);

    const Announcement = () => {
        let component: JSX.Element = (
            <div className="announcement">
                <div className="content">announcement</div>
            </div>
        );

        return component;
    }

    const QR = () => {
        let component: JSX.Element = (
            <div className="qr">
                <div className='content'>qr code</div>
            </div>
        );

        return component;
    }

    const Poll = () => {
        let component: JSX.Element = (
            <div className="poll">
                <div className='content'>poll</div>
            </div>
        );

        return component;
    }

    const Milestone = () => {
        let component: JSX.Element = (
            <div className="milestone">
                <div className='content'>milestone</div>
            </div>
        );

        return component;
    }

    const Leaderboard = () => {
        let component: JSX.Element = (
            <div className="leaderboard">
                <div className='content'>leaderboard</div>
            </div>
        );

        return component;
    }

    const Trigger = () => {
        let component: JSX.Element = (
            <div className="trigger">
                <div className='content'>trigger</div>
            </div>
        );

        return component;
    }

    return (
        <div className='green-screen'>
            <Announcement></Announcement>
            <Poll></Poll>
            <QR></QR>
            <Milestone></Milestone>
            <Leaderboard></Leaderboard>
            <Trigger></Trigger>
        </div>
    );
}

export default Page;