import { useParams } from 'react-router';
import './styles.scss'
import { Button, InputNumber, Select } from 'antd';
import { useCallback, useContext, useEffect, useRef, useState} from 'react';
import { ellipsizeThis, getWsUrl, sleep } from '../../common/utils';
import { toast } from 'react-toastify';
import { StartStudioParams } from './types';
import { io, Socket } from 'socket.io-client';
import _ from 'lodash';

const Page = () => {
    const socketRef = useRef<Socket>();
    const { streamerAddress } = useParams();

    const [ themeState, setThemeState ] = useState({
        qr: '',
        announcement: '',
        leaderboard: '',
        poll: '',
        milestone: '',
        payment: '',
        trigger: ''
     });

     const [ styleState, setStyleState ] = useState({
        qr: {},
        announcement: {},
        leaderboard: {},
        poll: {},
        milestone: {},
        payment: {},
        trigger: {}
     });

    //  parent function for updateStyles
    const updateModule = useCallback((data: any) => {
        // white list module & properties
        const whitelistModules = [ 'qr', 'announcement', 'leaderboard', 'poll', 'milestone', 'payment' ];

        _.map(data, (moduleStyles, moduleName) => {
            // only process module in whitelist
            if (whitelistModules.includes(moduleName)) {
                updateStyles(moduleName, moduleStyles);
            }
        });
    }, []);

    // do not call this individually
    // child function for updateModule
    const updateStyles = useCallback((module: any, moduleStyles: any) => {
        // temporary omit 'bar_empty_color', 'bar_filled_color'
        const whitelistStyles = ['font_type', 'font_size', 'font_color', 'bg_color', 'bg_image', 'position'];

        const styleMapping: {[key: string]: string} = {
            'font_type': 'fontFamily',
            'font_size': 'fontSize',
            'font_color': 'color',
            'bg_color': 'backgroundColor',
            'bg_image': 'backgroundImage',
            'position': 'position'
        };

        const positionMapping: {[key: string]: {justifyContent: string, alignItems: string }} = {
            'top-left': {
                'justifyContent': 'flex-start',
                'alignItems': 'flex-start'
            },
            'top-center': {
                'justifyContent': 'center',
                'alignItems': 'flex-start'
            },
            'top-right': {
                'justifyContent': 'flex-end',
                'alignItems': 'flex-start'
            },
            'middle-left': {
                'justifyContent': 'flex-start',
                'alignItems': 'center'
            },
            'middle-center': {
                'justifyContent': 'center',
                'alignItems': 'center'
            },
            'middle-right': {
                'justifyContent': 'flex-end',
                'alignItems': 'center'
            },
            'bottom-left': {
                'justifyContent': 'flex-start',
                'alignItems': 'flex-end'
            },
            'bottom-center': {
                'justifyContent': 'center',
                'alignItems': 'flex-end'
            },
            'bottom-right': {
                'justifyContent': 'flex-end',
                'alignItems': 'flex-end'
            }
        };

        let newStyle: any = {};
        _.map(moduleStyles, (style: string | number, styleName: string) => {
            // only process module in whitelist
            if (whitelistStyles.includes(styleName) && styleName !== 'position' && style !== '') {
                newStyle[styleMapping[styleName]] = style;
            } else if (styleName == 'position' && style !== '') {
                newStyle = { ...newStyle, ...positionMapping[style] };
            }
        });

        setStyleState(prevState => {
            // creating copy of prev state variable
            let selected: any = Object.assign({}, prevState);
            // update the name property, assign a new value
            selected[module] = newStyle;
            // return new object
            return selected;
        });
    }, [])

    useEffect(() => {
        // Create the socket connection if it doesn't exist
        if (!socketRef.current) {
            socketRef.current = io(getWsUrl());

            // upon connection
            socketRef.current.on("connect", () => {
                console.log("connected");
                socketRef.current!.emit('start_studio', {address: streamerAddress});
            });

            // upon disconnection
            socketRef.current.on("disconnect", (reason) => {
                console.log(`disconnected due to ${reason}`);
            });

            // upon update
            socketRef.current.on("update", (data) => {
                updateModule(data);
            });
        }


        return () => {
            // cannot off after useRef, else wont get data
            // socketRef.current!.off(`connect`);
            // socketRef.current!.off(`disconnect`);
            // socketRef.current!.off(`update`);
        }

    }, [streamerAddress]);

    const Announcement = () => (
        <div className="announcement">
            <div className="content" style={styleState.announcement}>announcement</div>
        </div>
    );

    const QR = () => (
        <div className="qr">
            <div className='content' style={styleState.qr}>qr code</div>
        </div>
    );

    const Poll = () => (
        <div className="poll">
            <div className='content' style={styleState.poll}>poll</div>
        </div>
    );

    const Milestone = () => (
        <div className="milestone">
            <div className='content' style={styleState.milestone}>milestone</div>
        </div>
    );

    const Leaderboard = () => (
        <div className="leaderboard">
            <div className='content' style={styleState.leaderboard}>leaderboard</div>
        </div>
    );

    const Trigger = () => (
        <div className="trigger">
            <div className='content' style={styleState.trigger}>trigger</div>
        </div>
    );

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