import { useParams } from 'react-router';
import './styles.scss'
import { Button, InputNumber, Select } from 'antd';
import { useCallback, useContext, useEffect, useRef, useState} from 'react';
import { ellipsizeThis, getWsUrl, sleep } from '../../common/utils';
import { toast } from 'react-toastify';
import { StartStudioParams } from './types';
import { io, Socket } from 'socket.io-client';

const Page = () => {
    const socketRef = useRef<Socket>();
    const { streamerAddress } = useParams();

    useEffect(() => {
        // Create the socket connection if it doesn't exist
        if (!socketRef.current) {
            socketRef.current = io(getWsUrl());

            // upon connection
            socketRef.current.on("connect", () => {
                console.log("connected");
            });

            // upon disconnection
            socketRef.current.on("disconnect", (reason) => {
                console.log(`disconnected due to ${reason}`);
            });

            // upon update
            socketRef.current.on("update", (data) => {
                console.log(`data`);
                console.log(data);
            });

            socketRef.current.emit('start_studio', {address: streamerAddress});
        }


        return () => {
            // cannot off after useRef, else wont get data
            // socketRef.current!.off(`connect`);
            // socketRef.current!.off(`disconnect`);
            // socketRef.current!.off(`update`);
        }

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