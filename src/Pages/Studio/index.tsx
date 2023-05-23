import { useParams } from 'react-router';
import './styles.scss'
import { Button, InputNumber, Select } from 'antd';
import { useCallback, useContext, useEffect, useRef, useState} from 'react';
import { ellipsizeThis, getWsUrl, sleep } from '../../common/utils';
import { toast } from 'react-toastify';
import { StartStudioParams } from './types';
import { io, Socket } from 'socket.io-client';
import _, { property } from 'lodash';
import Marquee from 'react-fast-marquee';
import { componentProperty } from '../Studio/types';
import { QRCode } from 'react-qrcode-logo';
import { Progress } from 'antd';
import dayjs from 'dayjs';

const Page = () => {
    const socketRef = useRef<Socket>();
    const { streamerAddress } = useParams();
    const previousAddress = useRef<string>(""); // is this necessary?

    // component theme (class)
    const [ themeState, setThemeState ] = useState({
        qr: '',
        announcement: '',
        leaderboard: '',
        poll: '',
        milestone: '',
        payment: '',
        trigger: ''
     });

    // component position
    const [ positionState, setPositionState ] = useState({
        qr: {},
        announcement: {},
        leaderboard: {},
        poll: {},
        milestone: {},
        payment: {},
        trigger: {}
     });

    // component property (text, speed, etc)
    const [ propertyState, setPropertyState ] = useState<componentProperty>({
        qr: {},
        announcement: {},
        leaderboard: {},
        poll: {},
        milestone: {},
        payment: {},
        trigger: {}
     });

    //  component style
     const [ styleState, setStyleState ] = useState({
        qr: {},
        announcement: {},
        leaderboard: {},
        poll: {},
        milestone: {},
        payment: {},
        trigger: {}
     });

     // update component property (text, speed, etc)
     const updateAttrib = useCallback((module: any, moduleProperty: any) => {
         const ignoreList = ['id', 'created_at', 'updated_at', 'font_type', 'font_size', 'font_color', 'bg_color', 'bg_image', 'position'];
 
         let newProperty: any = {};
         _.map(moduleProperty, (prop: string | number, propName: string) => {
             // only process module in whitelist
             if (!ignoreList.includes(propName) && propName !== '') {
                 newProperty[propName] = prop;
             }
         });
 
         // set property
         setPropertyState(prevState => {
             // creating copy of prev state variable
             let selected: any = Object.assign({}, prevState);
             // update the name property, assign a new value
             selected[module] = newProperty;
             // return new object
             return selected;
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
         let newPosition: any = {};
         _.map(moduleStyles, (style: string | number, styleName: string) => {
             // only process module in whitelist
             if (whitelistStyles.includes(styleName) && styleName !== 'position' && style !== '') {
                 newStyle[styleMapping[styleName]] = style;
             } else if (styleName === 'position' && style !== '') {
                 newPosition = { ...newPosition, ...positionMapping[style] };
             }
         });
 
         // set style
         setStyleState(prevState => {
             // creating copy of prev state variable
             let selected: any = Object.assign({}, prevState);
             // update the name property, assign a new value
             selected[module] = newStyle;
             // return new object
             return selected;
         });
 
         // set position
         setPositionState(prevState => {
             // creating copy of prev state variable
             let selected: any = Object.assign({}, prevState);
             // update the name property, assign a new value
             selected[module] = newPosition;
             // return new object
             return selected;
         });
     }, [])

    //  parent function for updateStyles
    const updateModule = useCallback((data: any) => {
        // white list module & properties
        const whitelistModules = [ 'qr', 'announcement', 'leaderboard', 'poll', 'milestone', 'payment', 'trigger' ];

        _.map(data, (moduleProperty, moduleName) => {
            // only process module in whitelist
            if (whitelistModules.includes(moduleName)) {
                console.log(`Updating ${moduleName}`);
                updateStyles(moduleName, moduleProperty);
                updateAttrib(moduleName, moduleProperty);
            }
        });
    }, [ updateAttrib, updateStyles ]);

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
            socketRef.current.on("disconnect", (reason: any) => {
                console.log(`disconnected due to ${reason}`);
            });

            // upon update
            socketRef.current.on("update", (data: any) => {
                updateModule(data);
            });
        }


        return () => {
            // cannot off after useRef, else wont get data
            // socketRef.current!.off(`connect`);
            // socketRef.current!.off(`disconnect`);
            // socketRef.current!.off(`update`);
        }

    }, [streamerAddress, updateModule]);

    const Announcement = () => {
        if(propertyState.announcement.status !== "active") {
            return null;
        }
        return (<div className="announcement" style={positionState.announcement}>
            <div className="content" style={styleState.announcement}>
                <Marquee
                    style={{
                        borderTopLeftRadius: 'inherit',
                        borderTopRightRadius: 'inherit',
                    }}
                    speed={propertyState.announcement?.speed}
                >
                    <div className="marquee-text">
                        {propertyState.announcement?.content}
                    </div>
                </Marquee>
            </div>
        </div>);
    };

    const QR = () => {
        if(propertyState.qr.status !== "active") {
            return null;
        }
        return (<div className="qr" style={positionState.qr}>
            <div className='content' style={styleState.qr}>
                <img
                    src={propertyState.qr.qr}
                    alt="QR Code"
                />
            </div>
        </div>);
    };

    const Poll = () => {
        if(propertyState.poll.status !== 'active') {
            return null;
        }

        return (<div className="poll" style={positionState.poll}>
            <div className='content' style={styleState.poll}>
                <strong>{propertyState.poll.title ?? ""}</strong>
                <div>
                    {
                        propertyState.poll.options &&
                        propertyState.poll.options.map((x, index) => (
                            <div className={'row'} key={`poll-option-${index}-${propertyState.poll.title}`}>
                                <div className="col-6 text-left">{x.option}</div>
                                <div className="col-6 text-right">${x.total.toFixed(2)}</div>
                            </div>
                        ))
                    }
                </div>
                <div className="row">
                    <div className="col-6 d-flex align-items-end justify-content-start" style={{ fontSize: 12 }}>{dayjs(propertyState.poll.end_at).format('YYYY-MM-DD HH:mm:ss')}</div>
                    <div className="col-6 text-right">Total: ${propertyState.poll.total?.toFixed(2) ?? "0"}</div>
                </div>
            </div>
        </div>);
    };

    const Milestone = () => {
        if(propertyState.milestone.status !== 'active') {
            return null;
        }
        return (<div className="milestone" style={positionState.milestone}>
            <div className='content' style={styleState.milestone}>
                    <span style={{marginBottom: 10}}>{propertyState.milestone.title}</span>
                    <Progress
                        percent={propertyState.milestone.percent}
                        trailColor={propertyState.milestone.bar_empty_color}
                        strokeColor={propertyState.milestone.bar_filled_color}
                        showInfo={false}
                    />
                    <span>{propertyState.milestone.profit} / {propertyState.milestone.target}</span>
            </div>
        </div>);
    };

    const Leaderboard = () => {
        if(propertyState.leaderboard.status !== 'active') {
            return null;
        }

        let hasTopDonators = propertyState.leaderboard.top_donators && propertyState.leaderboard.top_donators.length > 0;

        return (<div className="leaderboard" style={positionState.leaderboard}>
            <div className='content' style={styleState.leaderboard}>
                <strong>{propertyState.leaderboard.title ?? "Leaderboard"}</strong>
                <div className="row mt-4">
                    {
                        hasTopDonators &&
                        propertyState.leaderboard.top_donators!.map((x, index) => (
                            <>
                                <div className="col-6" key={`top-donator-${index}`}>{x.name}</div>
                                <div className="col-6" key={`top-donator-amount-${index}`}>${x.amount_usd}</div>
                            </>
                        ))
                    }
                </div>
            </div>
        </div>);
    };

    const Trigger = () => {
        if(propertyState.trigger.status !== 'active') {
            return null;
        }

        return (<div className="trigger" style={positionState.trigger}>
            <div className='content' style={styleState.trigger}>
                {
                    propertyState.trigger.content?
                    <img 
                        src={propertyState.trigger.content}
                        alt="trigger"
                    /> :
                    <></>
                }
                <span>{propertyState.trigger.caption}</span>
            </div>
        </div>);
    };

    return (
        <div className='green-screen'>
            <Announcement />
            <Poll />
            <QR />
            <Milestone />
            <Leaderboard />
            <Trigger />
        </div>
    );
}

export default Page;