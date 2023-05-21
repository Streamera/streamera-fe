import { ChangeEvent, useCallback, useContext, useEffect, useRef, useState } from 'react';
import './styles.scss'
import { OverlayButtonType, Timeframe } from './types';
import Marquee from 'react-fast-marquee';
import { toast } from 'react-toastify';
import { cloneObj } from '../../common/utils';
import { QRCode } from 'react-qrcode-logo';
import { AddressContext } from '../../App';
import axios from '../../Services/axios';
import { useCookies } from 'react-cookie';
import { Announcement, Leaderboard, Milestone, Notification, QrCode, User, Voting } from '../../types';

const Page = () => {
    // cookies
    const [ cookies ] = useCookies(['signatures']);

    const { address } = useContext(AddressContext);
    const [ activeTab, setActiveTab ] = useState<OverlayButtonType>("announcement");

    // announcement
    const [ announcementId, setAnnouncementId ] = useState(0);
    const [ marqueeColor, setMarqueeColor ] = useState<string>("#000000");
    const [ marqueeBackgroundColor, setMarqueeBackgroundColor ] = useState<string>("#ffffff");
    const [ displayText, setDisplayText ] = useState<string>("Sample Text");
    const [ textSpeed, setTextSpeed ] = useState<number>(100);

    // Notification
    const [ triggerId, setTriggerId ] = useState(0);
    const [ notificationText, setNotificationText ] = useState<string>("Chad donated $99!");
    const [ notificationTextColor, setNotificationTextColor ] = useState<string>("#000000");
    const [ notificationBackgroundColor, setNotificationBackgroundColor ] = useState<string>("#ffffff");
    const [ gifFile, setGifFile ] = useState<File>();
    const [ gif, setGif ] = useState<string>("");

    // Leaderboard
    const [ leaderboardId, setLeaderboardId ] = useState(0);
    const [ leaderboardText, setLeaderboardText ] = useState<string>("Leaderboard");
    const [ leaderboardTextColor, setLeaderboardTextColor ] = useState<string>("#000000");
    const [ leaderboardBackgroundColor, setLeaderboardBackgroundColor ] = useState<string>("#ffffff");
    const [ leaderboardTimeframe, setLeaderboardTimeframe ] = useState<Timeframe>("all-time");

    // Milestone
    const [ milestoneId, setMilestoneId ] = useState(0);
    const [ milestoneText, setMilestoneText ] = useState<string>("Milestone");
    const [ milestoneTextColor, setMilestoneTextColor ] = useState<string>("#000000");
    const [ milestoneBackgroundColor, setMilestoneBackgroundColor ] = useState<string>("#ffffff");
    const [ milestoneProgressMainColor, setMilestoneProgressMainColor ] = useState<string>("#000000");
    const [ milestoneProgressColor, setMilestoneProgressColor ] = useState<string>("#ffffff");
    const [ milestoneTimeframe, setMilestoneTimeframe ] = useState<Timeframe>("all-time");

    // Voting
    const [ votingId, setVotingId ] = useState(0);
    const [ votingText, setVotingText ] = useState<string>("Voting");
    const [ votingChoice, setVotingChoice ] = useState<string>("");
    const [ votingTextColor, setVotingTextColor ] = useState<string>("#000000");
    const [ votingBackgroundColor, setVotingBackgroundColor ] = useState<string>("#ffffff");
    const [ votingChoices, setVotingChoices ] = useState<string[]>([]);

    //qr code
    const [ qrId, setQrId ] = useState(0);
    const [ qrUrl, setQrUrl ] = useState("");
    const [ qrBlob, setQrBlob ] = useState<Blob>();
    const [ newQrLogo, setNewQrLogo ] = useState("");
    const [ newQrLogoFile, setNewQrLogoFile ] = useState<File>();
    const previousAddress = useRef<string>("");

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

    //voting
    const onVotingTextChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setVotingText(e.target.value);
    }, []);

    const onVotingChoiceChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setVotingChoice(e.target.value);
    }, []);

    const clearVotingChoice = useCallback(() => {
        setVotingChoice("");
    }, []);

    const onVotingTextColorChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setVotingTextColor(e.target.value);
    }, []);

    const onVotingBackgroundColorChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setVotingBackgroundColor(e.target.value);
    }, []);

    const onChoiceAdd = useCallback(() => {
        if(!votingChoice) {
            return;
        }

        let newChoices = cloneObj<string[]>(votingChoices);
        newChoices.push(votingChoice);

        if(newChoices.length > 5) {
            toast.error("Max number of choices reached.");
            return;
        }

        setVotingChoices(newChoices);
        clearVotingChoice();
    }, [votingChoices, votingChoice, clearVotingChoice]);

    const onChoiceDelete = useCallback((choice: string) => {
        let newChoices = votingChoices.filter(x => x !== choice);
        setVotingChoices(newChoices);
    }, [votingChoices]);

    // qrcode
    const onQrCodeLogoChanged = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setNewQrLogo(URL.createObjectURL(event.target.files[0]));
            setNewQrLogoFile(event.target.files[0]);
        }
    }, []);

    // save button
    const saveAnnouncement = useCallback(async() => {
        // 'content', 'speed', 'start_at', 'end_at', 'status'
        if(!textSpeed || !displayText || !announcementId || activeTab !== "announcement") {
            return;
        }

        let res = await axios.post(`/announcement/update/${announcementId}`, {
            content: displayText,
            speed: textSpeed,
            signature: cookies['signatures'][address],
            bg_color: marqueeBackgroundColor,
            font_color: marqueeColor,
        });

        if(!res.data.success) {
            toast.success("Error saving Announcement");
            return;
        }
        toast.success("Edited");

    }, [activeTab, address, announcementId, textSpeed, displayText, cookies, marqueeBackgroundColor, marqueeColor]);

    const saveNotification = useCallback(async() => {
        // 'content', 'caption', 'status', 'type'
        /* if(!textSpeed || !displayText || !announcementId || activeTab !== "announcement") {
            return;
        }

        let res = await axios.post(`/trigger/update/${triggerId}`, {
            content: displayText,
            speed: textSpeed,
            signature: cookies['signatures'][address],
            bg_color: marqueeBackgroundColor,
            font_color: marqueeColor,
        });

        if(!res.data.success) {
            toast.success("Error saving Announcement");
            return;
        }
        toast.success("Edited"); */
    }, []);

    const saveLeaderboard = useCallback(async() => {
        // 'title', 'status', 'timeframe'
        if(!leaderboardTimeframe || !leaderboardText || !leaderboardId || activeTab !== "leaderboard") {
            return;
        }

        let res = await axios.post(`/leaderboard/update/${leaderboardId}`, {
            title: leaderboardText,
            timeframe: leaderboardTimeframe,
            signature: cookies['signatures'][address],
            bg_color: leaderboardBackgroundColor,
            font_color: leaderboardTextColor,
        });

        if(!res.data.success) {
            toast.success("Error saving leaderboard");
            return;
        }
        toast.success("Edited");
    }, [leaderboardBackgroundColor, leaderboardTextColor, leaderboardTimeframe, leaderboardText, leaderboardId, activeTab, cookies, address]);

    const saveMilestone = useCallback(async() => {
        // 'user_id', 'title', 'target', 'style_id', 'start_at', 'end_at', 'timeframe'
    }, []);

    const saveVoting = useCallback(async() => {
        // 'user_id', 'status', 'stream_id', 'title', 'style_id', 'start_at', 'end_at'
        // polls
    }, []);

    const saveQr = useCallback(async() => {
        if(!qrBlob || !qrId || activeTab !== "qrcode") {
            return;
        }

        let formData = new FormData();
        formData.append('qr_code', qrBlob);
        formData.append('signature', cookies['signatures'][address]);
        let res = await axios({
            url: `/qr/update/${qrId}`,
            method: 'POST',
            data: formData,
            headers: {
                "Content-Type": "multipart/form-data",
            }
        });

        if(!res.data.success) {
            toast.success("Error saving QR Code");
            return;
        }
        toast.success("Edited");
    }, [ activeTab, address, cookies, qrBlob, qrId]);

    const onSaveClick = useCallback(() => {
        if(!address) {
            return;
        }

        // not going to use await here
        saveAnnouncement();
        saveNotification();
        saveLeaderboard();
        saveMilestone();
        saveVoting();
        saveQr();
        return;
    }, [address, saveQr, saveAnnouncement, saveNotification, saveLeaderboard, saveMilestone, saveVoting]);

    // getUserData callbacks
    const getAnnoucement = useCallback(async(user: User) => {
        let res = await axios.post<Announcement[]>('/announcement/find', { user_id: user.id });
        if(res.data.length === 0) {
            return;
        }

        let {
            id,
            content,
            speed,
            bg_color,
            font_color
        } = res.data[0];

        setAnnouncementId(id);
        setDisplayText(!content || content.length === 0? "Sample Text" : content);
        setTextSpeed(speed);
        setMarqueeBackgroundColor(bg_color ?? "#000000");
        setMarqueeColor(font_color ?? "#ffffff");
    }, []);

    const getNotification = useCallback(async(user: User) => {
        let res = await axios.post<Notification[]>('/trigger/find', { user_id: user.id });
        if(res.data.length === 0) {
            return;
        }

        let {
            id,
            content,
            caption,
            bg_color,
            font_color
        } = res.data[0];
        
        setAnnouncementId(id);
        setNotificationText(!caption || caption.length === 0? "Sample Text" : caption);
        setNotificationBackgroundColor(bg_color ?? "#000000");
        setNotificationTextColor(font_color ?? "#ffffff");
        setGif(content);
    }, []);

    const getLeaderboard = useCallback(async(user: User) => {
        let res = await axios.post<Leaderboard[]>('/leaderboard/find', { user_id: user.id });
        if(res.data.length === 0) {
            return;
        }

        let {
            id,
            title,
            timeframe,
            bg_color,
            font_color
        } = res.data[0];
        
        setLeaderboardId(id);
        setLeaderboardText(!title || title.length === 0? "Sample Text" : title);
        setLeaderboardTextColor(bg_color ?? "#000000");
        setLeaderboardBackgroundColor(font_color ?? "#ffffff");
        setLeaderboardTimeframe(timeframe as Timeframe);
    }, []);

    const getMilestone = useCallback(async(user: User) => {
        let res = await axios.post<Milestone[]>('/milestone/find', { user_id: user.id });
        if(res.data.length === 0) {
            return;
        }

        console.log(res.data);
    }, []);

    const getVoting = useCallback(async(user: User) => {
        let res = await axios.post<Voting[]>('/poll/find', { user_id: user.id });
        if(res.data.length === 0) {
            return;
        }

        console.log(res.data);
    }, []);

    const getQrCode = useCallback(async(user: User) => {
        let qrCodeRes = await axios.post<QrCode[]>('/qr/find', { user_id: user.id });
        if(qrCodeRes.data.length === 0) {
            return;
        }

        setQrUrl(qrCodeRes.data[0].qr);
        setQrId(qrCodeRes.data[0].id);
    }, []);

    // useEffects
    useEffect(() => {
        const getUserData = async() => {
            // get user id
            let res = await axios.post<User[]>('/user/find', { wallet: address });
            if(!res.data[0]) {
                return;
            }

            let user = res.data[0];
            getAnnoucement(user);
            getLeaderboard(user);
            // getNotification(user);
            // getVoting(user);
            // getMilestone(user);
            getQrCode(user);
        }

        getUserData();
    }, [ address, getAnnoucement, getNotification, getVoting, getLeaderboard, getMilestone, getQrCode ]);

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
                    <>
                        <div className="video-frame center">
                            <div className="voting-container" style={{ color: votingTextColor, backgroundColor: votingBackgroundColor, }}>
                                <span style={{marginBottom: 30}}>{votingText}</span>
                                <div className="row" style={{ width: 350 }}>
                                    {
                                        votingChoices.map((choice) => (
                                            <>
                                                <div className="col-6 text-left">{choice}</div>
                                                <div className="col-6 text-right">$0.00</div>
                                            </>
                                        ))
                                    }
                                </div>
                                <div className="row mt-5">
                                    <div className="col-6 text-left">Ends: here</div>
                                    <div className="col-6 text-right">Total: $99.99</div>
                                </div>
                            </div>
                        </div>
                        <div className="d-flex flex-column align-items-start mt-3 w-100">
                            <div className="d-flex align-items-center mt-3 w-100">
                                <strong className='mr-2'>Color</strong>
                                <input type="color" value={votingTextColor} onChange={onVotingTextColorChange}/>
                                <strong className='ml-5 mr-2'>Background Color</strong>
                                <input type="color" value={votingBackgroundColor} onChange={onVotingBackgroundColorChange}/>
                            </div>
                            <strong className='mt-3'>Title</strong>
                            <input type="text" className='form-control' style={{ maxWidth: 500 }} value={votingText} onChange={onVotingTextChange}/>
                            <strong className='mt-3'>New Choice</strong>
                            <div className="d-flex align-items-center" style={{ maxWidth: 500 }}>
                                <input type="text" className='form-control' value={votingChoice} onChange={onVotingChoiceChange}/>
                                <button className="btn btn-success btn-sm ml-2" onClick={() => { onChoiceAdd() } }><i className="fa fa-plus"></i></button>
                            </div>
                            <div className="choices-container">
                                {
                                    votingChoices.map((choice) => (
                                        <div className="vote-choice">
                                            <span>{choice}</span>
                                            <button className='btn btn-sm btn-danger' onClick={() => { onChoiceDelete(choice) }}><i className="fa fa-trash"></i></button>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </>
                }
                { /** QR Code */}
                {
                    activeTab === "qrcode" &&
                    <>
                        <span className='mt-3'>Your payees will be able to send donations to you by scanning this QR Code.</span>
                        {
                            /* display backend file if not editing */
                            qrUrl &&
                            !newQrLogoFile &&
                            <img src={qrUrl} alt="qrCode"/>
                        }

                        {
                            /** editing */
                            newQrLogoFile &&
                            <QRCode 
                                value={`https://metamask.app.link/dapp/localhost:3000/pay/${address}`}
                                logoImage={newQrLogo}
                                id="qr-code"
                                logoOnLoad={() => {
                                    const canvas: any = document.getElementById("qr-code");
                                    if(canvas) {
                                        canvas.toBlob((blob: Blob) => {
                                            if(address === previousAddress.current) {
                                                return;
                                            }
                                            previousAddress.current = address;
                                            setQrBlob(blob);
                                        });
                                    }
                                }}
                                enableCORS
                            />
                        }
                        <strong>Change Logo</strong>
                        <input type="file" onChange={onQrCodeLogoChanged} accept='image/jpeg, image/png'></input>
                    </>
                }
                <div className="button-container">
                    <button 
                        className='save' 
                        onClick={onSaveClick} 
                        disabled={!address} 
                        style={{cursor: address? 'pointer' : 'no-drop'}}
                    >
                        {address? 'Save' : 'Connect to Continue'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Page;