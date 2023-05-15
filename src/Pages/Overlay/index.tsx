import { ChangeEvent, useCallback, useState } from 'react';
import './styles.scss'
import { OverlayButtonType, Timeframe } from './types';
import Marquee from 'react-fast-marquee';

const Page = () => {
    const [ activeTab, setActiveTab ] = useState<OverlayButtonType>("announcement");
    const [ marqueeColor, setMarqueeColor ] = useState<string>("#000000");
    const [ marqueeBackgroundColor, setMarqueeBackgroundColor ] = useState<string>("#ffffff");
    const [ displayText, setDisplayText ] = useState<string>("Sample Text");
    const [ textSpeed, setTextSpeed ] = useState<number>(100);

    // Notification
    const [ notificationText, setNotificationText ] = useState<string>("Chad donated $99!");
    const [ notificationTextColor, setNotificationTextColor ] = useState<string>("#000000");
    const [ notificationBackgroundColor, setNotificationBackgroundColor ] = useState<string>("#ffffff");
    const [ gifFile, setGifFile ] = useState<File>();
    const [ gif, setGif ] = useState<string>("");

    // Leaderboard
    const [ leaderboardText, setLeaderboardText ] = useState<string>("Leaderboard");
    const [ leaderboardTextColor, setLeaderboardTextColor ] = useState<string>("#000000");
    const [ leaderboardBackgroundColor, setLeaderboardBackgroundColor ] = useState<string>("#ffffff");
    const [ leaderboardTimeframe, setLeaderboardTimeframe ] = useState<Timeframe>("all-time");

    // Milestone
    const [ milestoneText, setMilestoneText ] = useState<string>("Milestone");
    const [ milestoneTextColor, setMilestoneTextColor ] = useState<string>("#000000");
    const [ milestoneBackgroundColor, setMilestoneBackgroundColor ] = useState<string>("#ffffff");
    const [ milestoneProgressMainColor, setMilestoneProgressMainColor ] = useState<string>("#000000");
    const [ milestoneProgressColor, setMilestoneProgressColor ] = useState<string>("#ffffff");
    const [ milestoneTimeframe, setMilestoneTimeframe ] = useState<Timeframe>("all-time");

    // announcement
    const onMarqueeColorChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setMarqueeColor(e.target.value);
    }, []);

    const onMarqueeBackgroundColorChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setMarqueeBackgroundColor(e.target.value);
    }, []);

    const onTextSpeedChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        let speed = parseInt(e.target.value);

        if(isNaN(speed)) {
            speed = 100;
        }
        setTextSpeed(speed);
    }, []);

    const onDisplayTextchange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setDisplayText(e.target.value);
    }, []);

    // notifications
    const onNotificationTextChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setNotificationText(e.target.value);
    }, []);

    const onNotificationTextColorChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setNotificationTextColor(e.target.value);
    }, []);

    const onNotificationBackgroundColorChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setNotificationBackgroundColor(e.target.value);
    }, []);

    // leaderboard
    const onLeaderboardTextChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setLeaderboardText(e.target.value);
    }, []);

    const onLeaderboardTextColorChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setLeaderboardTextColor(e.target.value);
    }, []);

    const onLeaderboardBackgroundColorChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setLeaderboardBackgroundColor(e.target.value);
    }, []);

    const onLeaderboardTimeframeChanged = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
        setLeaderboardTimeframe(e.target.value as Timeframe);
    }, []);

    const onGifValueChanged = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setGif(URL.createObjectURL(event.target.files[0]));
            setGifFile(event.target.files[0]);
        }
    }, []);

    //milestone
    const onMilestoneTextChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setMilestoneText(e.target.value);
    }, []);

    const onMilestoneTextColorChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setMilestoneTextColor(e.target.value);
    }, []);

    const onMilestoneBackgroundColorChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setMilestoneBackgroundColor(e.target.value);
    }, []);

    const onMilestoneProgressMainColorChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setMilestoneProgressMainColor(e.target.value);
    }, []);

    const onMilestoneProgressColorChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setMilestoneProgressColor(e.target.value);
    }, []);

    const onMilestoneTimeframeChanged = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
        setMilestoneTimeframe(e.target.value as Timeframe);
    }, []);

    return (
        <div className='overlay-page'>
            <div className="nav-container">
                <button className={activeTab === 'announcement'? 'active' : ''} onClick={() => setActiveTab('announcement')}>Announcement</button>
                <button className={activeTab === 'notification'? 'active' : ''} onClick={() => setActiveTab('notification')}>Notification</button>
                <button className={activeTab === 'leaderboard'? 'active' : ''} onClick={() => setActiveTab('leaderboard')}>Leaderboard</button>
                <button className={activeTab === 'milestone'? 'active' : ''} onClick={() => setActiveTab('milestone')}>Milestone</button>
                <button className={activeTab === 'voting'? 'active' : ''} onClick={() => setActiveTab('voting')}>Voting</button>
                <button className={activeTab === 'qrcode'? 'active' : ''} onClick={() => setActiveTab('qrcode')}>QR Code</button>
            </div>
            
            <div className="main-content">
                <strong>{activeTab.charAt(0).toUpperCase() + activeTab.substring(1, activeTab.length)}</strong>
                { /** Announcement */}
                {
                    activeTab === "announcement" &&
                    <>
                        <div className="video-frame">
                            <Marquee
                                style={{
                                    color: marqueeColor,
                                    backgroundColor: marqueeBackgroundColor,
                                    borderTopLeftRadius: 'inherit',
                                    borderTopRightRadius: 'inherit',
                                }}
                                speed={textSpeed}
                            >
                                <div className="marquee-text">
                                    {displayText}
                                </div>
                            </Marquee>
                        </div>
                        <div className="d-flex align-items-center mt-3 w-100">
                            <strong className='mr-2'>Text Color</strong>
                            <input type="color" value={marqueeColor} onChange={onMarqueeColorChange}/>
                            <strong className='ml-5 mr-2'>Background Color</strong>
                            <input type="color" value={marqueeBackgroundColor} onChange={onMarqueeBackgroundColorChange}/>
                            <strong className='ml-5 mr-2'>Text Speed</strong>
                            <input type="decimal" step={1} className='form-control' style={{ maxWidth: 100 }} value={textSpeed} onChange={onTextSpeedChange}/>
                        </div>
                        <div className="d-flex flex-column mt-4 align-items-start w-100">
                            <strong>Display Text</strong>
                            <input type="text" className='form-control mt-1' value={displayText} onChange={onDisplayTextchange}/>
                        </div>
                    </>
                }
                { /** Notification */}
                {
                    activeTab === "notification" &&
                    <>
                        <div className="video-frame center">
                            <div className="notification-container">
                                {
                                    gif &&
                                    <img src={gif} alt="gif"/>
                                }
                                <span style={{ color: notificationTextColor, backgroundColor: notificationBackgroundColor }}>{notificationText}</span>
                            </div>
                        </div>
                        <div className="d-flex flex-column align-items-start mt-3 w-100">
                            <div className="d-flex align-items-center mt-3 w-100">
                                <strong className='mr-2'>Color</strong>
                                <input type="color" value={notificationTextColor} onChange={onNotificationTextColorChange}/>
                                <strong className='ml-5 mr-2'>Background Color</strong>
                                <input type="color" value={notificationBackgroundColor} onChange={onNotificationBackgroundColorChange}/>
                            </div>
                            <strong className='mt-3'>GIF</strong>
                            <input type="file" accept='image/gif' onChange={onGifValueChanged}/>
                            <strong className='mt-3'>Notification Text</strong>
                            <input type="text" className='form-control' style={{ maxWidth: 500 }} value={notificationText} onChange={onNotificationTextChange}/>
                        </div>
                    </>
                }
                { /** Leaderboard */}
                {
                    activeTab === "leaderboard" &&
                    <>
                        <div className="video-frame center">
                            <div className="leaderboard-container" style={{ color: leaderboardTextColor, backgroundColor: leaderboardBackgroundColor, }}>
                                <span style={{marginBottom: 30}}>{leaderboardText}</span>
                                <div className="row" style={{ width: 250 }}>
                                    <div className="col-6">Chad 1</div>
                                    <div className="col-6">$99</div>
                                    <div className="col-6">Chad 2</div>
                                    <div className="col-6">$98</div>
                                    <div className="col-6">Chad 3</div>
                                    <div className="col-6">$97</div>
                                </div>
                            </div>
                        </div>
                        <div className="d-flex flex-column align-items-start mt-3 w-100">
                            <div className="d-flex align-items-center mt-3 w-100">
                                <strong className='mr-2'>Color</strong>
                                <input type="color" value={leaderboardTextColor} onChange={onLeaderboardTextColorChange}/>
                                <strong className='ml-5 mr-2'>Background Color</strong>
                                <input type="color" value={leaderboardBackgroundColor} onChange={onLeaderboardBackgroundColorChange}/>
                            </div>
                            <strong className='mt-3'>Text</strong>
                            <input type="text" className='form-control' style={{ maxWidth: 500 }} value={leaderboardText} onChange={onLeaderboardTextChange}/>
                            <strong className='mt-3'>Timeframe</strong>
                            <select className='form-control' style={{ maxWidth: 500 }} value={leaderboardTimeframe} onChange={onLeaderboardTimeframeChanged}>
                                <option value="all-time">All Time</option>
                                <option value="monthly">Monthly</option>
                                <option value="weekly">Weekly</option>
                                <option value="daily">Daily</option>
                            </select>
                        </div>
                    </>
                }
                { /** Milestone */}
                {
                    activeTab === "milestone" &&
                    <>
                        <div className="video-frame center">
                            <div className="milestone-container" style={{ color: milestoneTextColor, backgroundColor: milestoneBackgroundColor, }}>
                                <span style={{marginBottom: 10}}>{milestoneText}</span>
                                <div className="progress-container" style={{ backgroundColor: milestoneProgressMainColor }}>
                                    <div className="progress" style={{ backgroundColor: milestoneProgressColor }}></div>
                                </div>
                            </div>
                        </div>
                        <div className="d-flex flex-column align-items-start mt-3 w-100">
                            <div className="d-flex align-items-center mt-3 w-100">
                                <strong className='mr-2'>Color</strong>
                                <input type="color" value={milestoneTextColor} onChange={onMilestoneTextColorChange}/>
                                <strong className='ml-5 mr-2'>Background Color</strong>
                                <input type="color" value={milestoneBackgroundColor} onChange={onMilestoneBackgroundColorChange}/>
                                <strong className='ml-5 mr-2'>Progress Main Color</strong>
                                <input type="color" value={milestoneProgressMainColor} onChange={onMilestoneProgressMainColorChange}/>
                                <strong className='ml-5 mr-2'>Progress Color</strong>
                                <input type="color" value={milestoneProgressColor} onChange={onMilestoneProgressColorChange}/>
                            </div>
                            <strong className='mt-3'>Text</strong>
                            <input type="text" className='form-control' style={{ maxWidth: 500 }} value={milestoneText} onChange={onMilestoneTextChange}/>
                            <strong className='mt-3'>Timeframe</strong>
                            <select className='form-control' style={{ maxWidth: 500 }} value={milestoneTimeframe} onChange={onMilestoneTimeframeChanged}>
                                <option value="all-time">All Time</option>
                                <option value="monthly">Monthly</option>
                                <option value="weekly">Weekly</option>
                                <option value="daily">Daily</option>
                            </select>
                        </div>
                    </>
                }
                { /** Voting */}
                {
                    activeTab === "voting" &&
                    <></>
                }
                { /** QR Code */}
                {
                    activeTab === "qrcode" &&
                    <></>
                }
                <div className="button-container">
                    <button className='save'>Save</button>
                </div>
            </div>
        </div>
    );
}

export default Page;