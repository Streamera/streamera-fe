import { useParams } from 'react-router';
import './styles.scss'
import { Button, InputNumber, Select } from 'antd';
import { useCallback, useContext, useState} from 'react';
import { ellipsizeThis } from '../../common/utils';
import { toast } from 'react-toastify';

const Page = () => {
    const { streamerAddress } = useParams();

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