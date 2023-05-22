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
import { Announcement, Leaderboard, Milestone, Notification, OverlayPosition, QrCode, Status, User, Voting, VotingOptions } from '../../types';
import { Select, DatePicker, Switch } from 'antd';
import dayjs from 'dayjs';
const { RangePicker } = DatePicker;

const timeframeOptions = [
    {
        label: 'All Time',
        value: 'all-time',
    },
    {
        label: 'Monthly',
        value: 'monthly',
    },
    {
        label: 'Weekly',
        value: 'weekly',
    },
    {
        label: 'Daily',
        value: 'daily',
    },
]

const overlayPositionOptions = [
    {
        label: 'Top Left',
        value: 'top-left',
    },
    {
        label: 'Top Center',
        value: 'top-center',
    },
    {
        label: 'Top Right',
        value: 'top-right',
    },
    {
        label: 'Middle Left',
        value: 'middle-left',
    },
    {
        label: 'Middle Center',
        value: 'middle-center',
    },
    {
        label: 'Middle Right',
        value: 'middle-right',
    },
    {
        label: 'Bottom Left',
        value: 'bottom-left',
    },
    {
        label: 'Bottom Center',
        value: 'bottom-center',
    },
    {
        label: 'Bottom Right',
        value: 'bottom-right',
    },
];

const Page = () => {
    // cookies
    const [ cookies ] = useCookies(['signatures']);

    const { address } = useContext(AddressContext);
    const [ activeTab, setActiveTab ] = useState<OverlayButtonType>("announcement");

    // announcement
    const [ announcementId, setAnnouncementId ] = useState(0);
    const [ announcementColor, setAnnouncementColor ] = useState<string>("#000000");
    const [ announcementBackgroundColor, setAnnouncementBackgroundColor ] = useState<string>("#ffffff");
    const [ announcementText, setAnnouncementText ] = useState<string>("Sample Text");
    const [ announcementTextSpeed, setAnnouncementTextSpeed ] = useState<number>(100);
    const [ announcementPosition, setAnnouncementPosition ] = useState<OverlayPosition>("middle-center");
    const [ announcementStatus, setAnnouncementStatus ] = useState<Status>("inactive");

    // Notification
    const [ notificationId, setNotificationId ] = useState(0);
    const [ notificationText, setNotificationText ] = useState<string>("Chad donated $99!");
    const [ notificationTextColor, setNotificationTextColor ] = useState<string>("#000000");
    const [ notificationBackgroundColor, setNotificationBackgroundColor ] = useState<string>("#ffffff");
    const [ gifFile, setGifFile ] = useState<File>();
    const [ gif, setGif ] = useState<string>("");
    const [ notificationPosition, setNotificationPosition ] = useState<OverlayPosition>("middle-center");
    const [ notificationStatus, setNotificationStatus ] = useState<Status>("inactive");

    // Leaderboard
    const [ leaderboardId, setLeaderboardId ] = useState(0);
    const [ leaderboardText, setLeaderboardText ] = useState<string>("Leaderboard");
    const [ leaderboardTextColor, setLeaderboardTextColor ] = useState<string>("#000000");
    const [ leaderboardBackgroundColor, setLeaderboardBackgroundColor ] = useState<string>("#ffffff");
    const [ leaderboardTimeframe, setLeaderboardTimeframe ] = useState<Timeframe>("all-time");
    const [ leaderboardPosition, setLeaderboardPosition ] = useState<OverlayPosition>("middle-center");
    const [ leaderboardStatus, setLeaderboardStatus ] = useState<Status>("inactive");

    // Milestone
    const [ milestoneId, setMilestoneId ] = useState(0);
    const [ milestoneText, setMilestoneText ] = useState<string>("Milestone");
    const [ milestoneTextColor, setMilestoneTextColor ] = useState<string>("#000000");
    const [ milestoneBackgroundColor, setMilestoneBackgroundColor ] = useState<string>("#ffffff");
    const [ milestoneProgressMainColor, setMilestoneProgressMainColor ] = useState<string>("#000000");
    const [ milestoneProgressColor, setMilestoneProgressColor ] = useState<string>("#ffffff");
    const [ milestoneTimeframe, setMilestoneTimeframe ] = useState<Timeframe>("all-time");
    const [ milestonePosition, setMilestonePosition ] = useState<OverlayPosition>("middle-center");
    const [ milestoneTarget, setMilestoneTarget ] = useState("0");
    const [ milestoneStartAt, setMilestoneStartAt ] = useState("");
    const [ milestoneEndAt, setMilestoneEndAt ] = useState("");
    const [ milestoneStatus, setMilestoneStatus ] = useState<Status>("inactive");

    // Voting
    const [ votingId, setVotingId ] = useState(0);
    const [ votingText, setVotingText ] = useState<string>("Voting");
    const [ votingChoice, setVotingChoice ] = useState<string>("");
    const [ votingTextColor, setVotingTextColor ] = useState<string>("#000000");
    const [ votingBackgroundColor, setVotingBackgroundColor ] = useState<string>("#ffffff");
    const [ votingChoices, setVotingChoices ] = useState<VotingOptions[]>([]);
    const [ votingPosition, setVotingPosition ] = useState<OverlayPosition>("middle-center");
    const [ votingStartAt, setVotingStartAt ] = useState("");
    const [ votingEndAt, setVotingEndAt ] = useState("");
    const [ votingStatus, setVotingStatus ] = useState<Status>("inactive");

    //qr code
    const [ qrId, setQrId ] = useState(0);
    const [ qrUrl, setQrUrl ] = useState("");
    const [ qrBlob, setQrBlob ] = useState<Blob>();
    const [ newQrLogo, setNewQrLogo ] = useState("");
    const [ newQrLogoFile, setNewQrLogoFile ] = useState<File>();
    const [ qrPosition, setQrPosition ] = useState<OverlayPosition>("middle-center");
    const [ qrStatus, setQrStatus ] = useState<Status>("inactive");
    const previousAddress = useRef<string>("");

    // announcement
    const onAnnouncementColorChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setAnnouncementColor(e.target.value);
    }, []);

    const onAnnouncementBackgroundColorChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setAnnouncementBackgroundColor(e.target.value);
    }, []);

    const onAnnouncementTextSpeedChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        let speed = parseInt(e.target.value);

        if(isNaN(speed)) {
            speed = 100;
        }
        setAnnouncementTextSpeed(speed);
    }, []);

    const onAnnouncementTextChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setAnnouncementText(e.target.value);
    }, []);

    const onAnnouncementPositionChange = useCallback((value: OverlayPosition) => {
        setAnnouncementPosition(value);
    }, []);

    const onAnnouncementActiveChange = useCallback((value: boolean) => {
        setAnnouncementStatus(value? "active" : "inactive");
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

    const onNotificationPositionChange = useCallback((value: OverlayPosition) => {
        setNotificationPosition(value);
    }, []);

    const onNotificationActiveChange = useCallback((value: boolean) => {
        setNotificationStatus(value? "active" : "inactive");
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

    const onLeaderboardTimeframeChanged = useCallback((value: Timeframe) => {
        setLeaderboardTimeframe(value);
    }, []);

    const onGifValueChanged = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setGif(URL.createObjectURL(event.target.files[0]));
            setGifFile(event.target.files[0]);
        }
    }, []);

    const onLeaderboardPositionChange = useCallback((value: OverlayPosition) => {
        setLeaderboardPosition(value);
    }, []);

    const onLeaderboardActiveChange = useCallback((value: boolean) => {
        setLeaderboardStatus(value? "active" : "inactive");
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

    const onMilestoneTargetChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setMilestoneTarget(e.target.value);
    }, []);

    const onMilestoneDateRangeChange = useCallback((dateRangeFn: any, dateRangeStrings: any, info: any) => {
        let [startDate, endDate] = dateRangeStrings;
        setMilestoneStartAt(startDate);
        setMilestoneEndAt(endDate);
    }, []);

    const onMilestoneTimeframeChanged = useCallback((value: Timeframe) => {
        setMilestoneTimeframe(value);
    }, []);

    const onMilestonePositionChange = useCallback((value: OverlayPosition) => {
        setMilestonePosition(value);
    }, []);

    const onMilestoneActiveChange = useCallback((value: boolean) => {
        setMilestoneStatus(value? "active" : "inactive");
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

    const onVotingPositionChange = useCallback((value: OverlayPosition) => {
        setVotingPosition(value);
    }, []);

    const onVotingDateRangeChange = useCallback((dateRangeFn: any, dateRangeStrings: any, info: any) => {
        let [startDate, endDate] = dateRangeStrings;
        setVotingStartAt(startDate);
        setVotingEndAt(endDate);
    }, []);

    const onVotingActiveChange = useCallback((value: boolean) => {
        setVotingStatus(value? "active" : "inactive");
    }, []);

    const onChoiceAdd = useCallback(() => {
        if(!votingChoice) {
            return;
        }

        let newChoices = cloneObj(votingChoices);
        newChoices.push({
            id: 0,
            option: votingChoice,
        });

        if(newChoices.length > 5) {
            toast.error("Max number of choices reached.");
            return;
        }

        setVotingChoices(newChoices);
        clearVotingChoice();
    }, [votingChoices, votingChoice, clearVotingChoice]);

    const onChoiceDelete = useCallback((id: number, choice: string) => {
        let newChoices: VotingOptions[] = [];

        if(id !== 0) {
            newChoices = votingChoices.filter(x => x.id !== id);
        }

        else {
            newChoices = votingChoices.filter(x => x.option !== choice);
        }
        setVotingChoices(newChoices);
    }, [votingChoices]);

    // qrcode
    const onQrCodeLogoChanged = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setNewQrLogo(URL.createObjectURL(event.target.files[0]));
            setNewQrLogoFile(event.target.files[0]);
        }
    }, []);

    const onQrPositionChange = useCallback((value: OverlayPosition) => {
        setQrPosition(value);
    }, []);

    const onQrActiveChange = useCallback((value: boolean) => {
        setQrStatus(value? "active" : "inactive");
    }, []);

    // save button
    const saveAnnouncement = useCallback(async() => {
        // 'content', 'speed', 'start_at', 'end_at', 'status'
        if(!announcementTextSpeed || !announcementText || !announcementId || activeTab !== "announcement") {
            return;
        }

        let res = await axios.post(`/announcement/update/${announcementId}`, {
            content: announcementText,
            speed: announcementTextSpeed,
            signature: cookies['signatures'][address],
            bg_color: announcementBackgroundColor,
            font_color: announcementColor,
            position: announcementPosition,
            status: announcementStatus,
        });

        if(!res.data.success) {
            toast.success("Error saving announcement");
            return;
        }
        toast.success("Edited");

    }, [activeTab, address, announcementStatus, announcementId, announcementTextSpeed, announcementText, cookies, announcementBackgroundColor, announcementColor, announcementPosition]);

    const saveNotification = useCallback(async() => {
        // 'content', 'caption', 'status', 'type'
        if(!notificationText || !notificationId || activeTab !== "notification") {
            return;
        }

        let formData = new FormData();
        if(gifFile) {
            formData.append('content', gifFile);
        }

        formData.append('signature', cookies['signatures'][address]);
        formData.append('caption', notificationText);
        formData.append('bg_color', notificationBackgroundColor);
        formData.append('font_color', notificationTextColor);
        formData.append('position', notificationPosition);
        formData.append('status', notificationStatus);

        let res = await axios({
            url: `/trigger/update/${notificationId}`,
            method: 'POST',
            data: formData,
            headers: {
                "Content-Type": "multipart/form-data",
            }
        });

        if(!res.data.success) {
            toast.success("Error saving notification");
            return;
        }
        toast.success("Edited");
    }, [notificationStatus, notificationBackgroundColor, notificationTextColor, notificationId, notificationText, gifFile, address, cookies, activeTab, notificationPosition]);

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
            position: leaderboardPosition,
            status: leaderboardStatus,
        });

        if(!res.data.success) {
            toast.success("Error saving leaderboard");
            return;
        }
        toast.success("Edited");
    }, [leaderboardStatus, leaderboardBackgroundColor, leaderboardTextColor, leaderboardTimeframe, leaderboardText, leaderboardId, activeTab, cookies, address, leaderboardPosition]);

    const saveMilestone = useCallback(async() => {
        // 'user_id', 'title', 'target', 'style_id', 'start_at', 'end_at', 'timeframe'
        if(!milestoneTimeframe || !milestoneId || !milestoneText || activeTab !== "milestone") {
            return;
        }

        let res = await axios.post(`/milestone/update/${milestoneId}`, {
            title: milestoneText,
            timeframe: milestoneTimeframe,
            signature: cookies['signatures'][address],
            bg_color: milestoneBackgroundColor,
            font_color: milestoneTextColor,
            bar_empty_color: milestoneProgressMainColor,
            bar_filled_color: milestoneProgressColor,
            position: milestonePosition,
            start_at: milestoneStartAt,
            end_at: milestoneEndAt,
            target: milestoneTarget,
            status: milestoneStatus,
        });

        if(!res.data.success) {
            toast.success("Error saving milestone");
            return;
        }
        toast.success("Edited");
    }, [milestoneStatus, milestoneId, milestoneBackgroundColor, milestoneProgressColor, milestoneProgressMainColor, milestoneText, milestoneTextColor, milestoneTimeframe, address, cookies, activeTab, milestonePosition, milestoneEndAt, milestoneStartAt, milestoneTarget]);

    const saveVoting = useCallback(async() => {
        if (votingChoices.length === 0) {
            toast.error("Add at least 1 voting choice");
        }

        // 'user_id', 'status', 'title', 'style_id', 'start_at', 'end_at', options
        if(!votingText || !votingId || votingChoices.length === 0 || activeTab !== "voting") {
            return;
        }

        let res = await axios.post(`/poll/update/${votingId}`, {
            title: votingText,
            signature: cookies['signatures'][address],
            bg_color: votingBackgroundColor,
            font_color: votingTextColor,
            options: votingChoices,
            position: votingPosition,
            start_at: votingStartAt,
            end_at: votingEndAt,
            status: votingStatus,
        });

        if(!res.data.success) {
            toast.success("Error saving polls");
            return;
        }
        toast.success("Edited");
    }, [votingStatus, votingText, votingChoices, votingId, address, cookies, votingBackgroundColor, votingTextColor, activeTab, votingPosition, votingStartAt, votingEndAt]);

    const saveQr = useCallback(async() => {
        if(!qrId || activeTab !== "qrcode") {
            return;
        }

        let formData = new FormData();
        if(qrBlob) {
            formData.append('qr_code', qrBlob);
        }
        formData.append('position', qrPosition);
        formData.append('status', qrStatus);
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
    }, [qrStatus, activeTab, address, cookies, qrBlob, qrId, qrPosition]);

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
            font_color,
            position,
            status,
        } = res.data[0];

        setAnnouncementId(id);
        setAnnouncementText(!content || content.length === 0? "Sample Text" : content);
        setAnnouncementTextSpeed(speed);
        setAnnouncementBackgroundColor(bg_color? bg_color : "#000000");
        setAnnouncementColor(font_color? font_color: "#ffffff");
        setAnnouncementPosition(position ?? 'middle-center');
        setAnnouncementStatus(status);
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
            font_color,
            position,
            status,
        } = res.data[0];

        setNotificationId(id);
        setNotificationText(!caption || caption.length === 0? "Sample Text" : caption);
        setNotificationBackgroundColor(bg_color? bg_color : "#000000");
        setNotificationTextColor(font_color? font_color: "#ffffff");
        setGif(content);
        setNotificationPosition(position ?? 'middle-center');
        setNotificationStatus(status)
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
            font_color,
            position,
            status,
        } = res.data[0];

        setLeaderboardId(id);
        setLeaderboardText(!title || title.length === 0? "Sample Text" : title);
        setLeaderboardTextColor(bg_color? bg_color : "#000000");
        setLeaderboardBackgroundColor(font_color? font_color: "#ffffff");
        setLeaderboardTimeframe(timeframe as Timeframe);
        setLeaderboardPosition(position ?? 'middle-center');
        setLeaderboardStatus(status);
    }, []);

    const getMilestone = useCallback(async(user: User) => {
        let res = await axios.post<Milestone[]>('/milestone/find', { user_id: user.id });
        if(res.data.length === 0) {
            return;
        }

        let {
            id,
            title,
            target,
            start_at,
            end_at,
            timeframe,
            bg_color,
            font_color,
            bar_filled_color,
            bar_empty_color,
            position,
            status,
        } = res.data[0];

        setMilestoneId(id);
        setMilestoneText(!title || title.length === 0? "Sample Text" : title);
        setMilestoneProgressMainColor(bar_empty_color? bar_empty_color: "#ffffff");
        setMilestoneProgressColor(bar_filled_color? bar_filled_color: "#ffffff");
        setMilestoneBackgroundColor(bg_color? bg_color : "#000000");
        setMilestoneTextColor(font_color? font_color: "#ffffff");
        setMilestoneTimeframe(timeframe as Timeframe);
        setMilestonePosition(position ?? 'middle-center');
        setMilestoneTarget(target);
        setMilestoneStartAt(start_at);
        setMilestoneEndAt(end_at);
        setMilestoneStatus(status);
    }, []);

    const getVoting = useCallback(async(user: User) => {
        let res = await axios.post<Voting[]>('/poll/find', { user_id: user.id });
        if(res.data.length === 0) {
            return;
        }

        let {
            id,
            title,
            start_at,
            end_at,
            bg_color,
            font_color,
            options,
            position,
            status,
        } = res.data[0];

        setVotingId(id);
        setVotingText(!title || title.length === 0? "Sample Text" : title);
        setVotingBackgroundColor(bg_color? bg_color : "#000000");
        setVotingTextColor(font_color? font_color: "#ffffff");
        setVotingChoices(options);
        setVotingPosition(position ?? 'middle-center');
        setVotingStartAt(start_at);
        setVotingEndAt(end_at);
        setVotingStatus(status);
    }, []);

    const getQrCode = useCallback(async(user: User) => {
        let qrCodeRes = await axios.post<QrCode[]>('/qr/find', { user_id: user.id });
        if(qrCodeRes.data.length === 0) {
            return;
        }

        let qrCode = qrCodeRes.data[0];
        let {
            qr,
            id,
            position,
            status,
        } = qrCode;

        setQrUrl(qr);
        setQrId(id);
        setQrPosition(position ?? 'middle-center');
        setQrStatus(status);
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
            getNotification(user);
            getMilestone(user);
            getVoting(user);
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
                                    color: announcementColor,
                                    backgroundColor: announcementBackgroundColor,
                                    borderTopLeftRadius: 'inherit',
                                    borderTopRightRadius: 'inherit',
                                }}
                                speed={announcementTextSpeed}
                            >
                                <div className="marquee-text">
                                    {announcementText}
                                </div>
                            </Marquee>
                        </div>

                        <strong className='mt-4'>Active</strong>
                        <Switch onChange={onAnnouncementActiveChange} checked={announcementStatus === "active"}></Switch>

                        <div className="d-flex align-items-center mt-3 w-100">
                            <strong className='mr-2'>Text Color</strong>
                            <input type="color" value={announcementColor} onChange={onAnnouncementColorChange}/>
                            <strong className='ml-5 mr-2'>Background Color</strong>
                            <input type="color" value={announcementBackgroundColor} onChange={onAnnouncementBackgroundColorChange}/>
                            <strong className='ml-5 mr-2'>Text Speed</strong>
                            <input type="decimal" step={1} className='form-control' style={{ maxWidth: 100 }} value={announcementTextSpeed} onChange={onAnnouncementTextSpeedChange}/>
                        </div>

                        <div className="d-flex flex-column mt-4 align-items-start w-100">
                            <strong>Display Text</strong>
                            <input type="text" className='form-control mt-1' value={announcementText} style={{ maxWidth: 500 }} onChange={onAnnouncementTextChange}/>
                        </div>

                        <strong className='mt-4'>Position</strong>
                        <Select
                            className='w-100 text-left'
                            style={{ maxWidth: 500 }}
                            options={overlayPositionOptions}
                            onChange={value => { onAnnouncementPositionChange(value); }}
                            value={announcementPosition}
                        >
                        </Select>
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

                        <strong className='mt-4'>Active</strong>
                        <Switch onChange={onNotificationActiveChange} checked={notificationStatus === "active"}></Switch>

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

                            <strong className='mt-4'>Position</strong>
                            <Select
                                className='w-100 text-left'
                                style={{ maxWidth: 500 }}
                                options={overlayPositionOptions}
                                onChange={value => { onNotificationPositionChange(value); }}
                                value={notificationPosition}
                            >
                            </Select>
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

                        <strong className='mt-4'>Active</strong>
                        <Switch onChange={onLeaderboardActiveChange} checked={leaderboardStatus === "active"}></Switch>

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
                            <Select
                                className='w-100 text-left'
                                style={{ maxWidth: 500 }}
                                options={timeframeOptions}
                                onChange={value => { onLeaderboardTimeframeChanged(value); }}
                                value={leaderboardTimeframe}
                            >
                            </Select>

                            <strong className='mt-4'>Position</strong>
                            <Select
                                className='w-100 text-left'
                                style={{ maxWidth: 500 }}
                                options={overlayPositionOptions}
                                onChange={value => { onLeaderboardPositionChange(value); }}
                                value={leaderboardPosition}
                            >
                            </Select>
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

                        <strong className='mt-4'>Active</strong>
                        <Switch onChange={onMilestoneActiveChange} checked={milestoneStatus === "active"}></Switch>

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
                            <strong className='mt-3'>Date Range</strong>
                            <RangePicker
                                showTime
                                value={[dayjs(milestoneStartAt), dayjs(milestoneEndAt)]}
                                onCalendarChange={onMilestoneDateRangeChange}
                            />
                            <strong className='mt-3'>Text</strong>
                            <input type="text" className='form-control' style={{ maxWidth: 500 }} value={milestoneText} onChange={onMilestoneTextChange}/>

                            <strong className='mt-3'>Target</strong>
                            <input type="decimal" step={0.01} className='form-control' style={{ maxWidth: 500 }} value={milestoneTarget} onChange={onMilestoneTargetChange}/>

                            <strong className='mt-3'>Timeframe</strong>
                            <Select
                                className='w-100 text-left'
                                style={{ maxWidth: 500 }}
                                options={timeframeOptions}
                                onChange={value => { onMilestoneTimeframeChanged(value); }}
                                value={leaderboardTimeframe}
                            >
                            </Select>

                            <strong className='mt-4'>Position</strong>
                            <Select
                                className='w-100 text-left'
                                style={{ maxWidth: 500 }}
                                options={overlayPositionOptions}
                                onChange={value => { onMilestonePositionChange(value); }}
                                value={milestonePosition}
                            >
                            </Select>
                        </div>
                    </>
                }
                { /** Voting */}
                {
                    activeTab === "voting" &&
                    <>
                        <div className="video-frame center">
                            <div className="voting-container" style={{ color: votingTextColor, backgroundColor: votingBackgroundColor, }}>
                                <span>{votingText}</span>
                                <div className="row" style={{ width: 350 }}>
                                    {
                                        votingChoices.map((x, index) => (
                                            <>
                                                <div className="col-6 text-left" key={`voting-option-${index}`}>{x.option}</div>
                                                <div className="col-6 text-right" key={`voting-value-${index}`}>$0.00</div>
                                            </>
                                        ))
                                    }
                                </div>
                                <div className="row">
                                    <div className="col-6 d-flex align-items-end justify-content-start">{dayjs(votingEndAt).format('YYYY-MM-DD HH:mm:ss')}</div>
                                    <div className="col-6 text-right">Total: $99.99</div>
                                </div>
                            </div>
                        </div>

                        <strong className='mt-4'>Active</strong>
                        <Switch onChange={onVotingActiveChange}  checked={votingStatus === "active"}></Switch>

                        <div className="d-flex flex-column align-items-start mt-3 w-100">
                            <div className="d-flex align-items-center mt-3 w-100">
                                <strong className='mr-2'>Color</strong>
                                <input type="color" value={votingTextColor} onChange={onVotingTextColorChange}/>
                                <strong className='ml-5 mr-2'>Background Color</strong>
                                <input type="color" value={votingBackgroundColor} onChange={onVotingBackgroundColorChange}/>
                            </div>
                            <strong className='mt-3'>Date Range</strong>
                            <RangePicker
                                showTime
                                value={[dayjs(votingStartAt), dayjs(votingEndAt)]}
                                onCalendarChange={onVotingDateRangeChange}
                            />
                            <strong className='mt-3'>Title</strong>
                            <input type="text" className='form-control' style={{ maxWidth: 500 }} value={votingText} onChange={onVotingTextChange}/>
                            <strong className='mt-3'>New Choice</strong>
                            <div className="d-flex align-items-center" style={{ maxWidth: 500 }}>
                                <input type="text" className='form-control' value={votingChoice} onChange={onVotingChoiceChange}/>
                                <button className="btn btn-success btn-sm ml-2" onClick={() => { onChoiceAdd() } }><i className="fa fa-plus"></i></button>
                            </div>
                            <div className="choices-container">
                                {
                                    votingChoices.map((x, index) => (
                                        <div className="vote-choice" key={`${x.option}|choices|${index}`}>
                                            <span>{x.option}</span>
                                            <button className='btn btn-sm btn-danger' onClick={() => { onChoiceDelete(x.id, x.option) }}><i className="fa fa-trash"></i></button>
                                        </div>
                                    ))
                                }
                            </div>

                            <strong className='mt-4'>Position</strong>
                            <Select
                                className='w-100 text-left'
                                style={{ maxWidth: 500 }}
                                options={overlayPositionOptions}
                                onChange={value => { onVotingPositionChange(value); }}
                                value={votingPosition}
                            >
                            </Select>
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
                            <img src={qrUrl} alt="qrCode" className='qr'/>
                        }

                        {
                            /** editing */
                            newQrLogoFile &&
                            <QRCode
                                value={`https://metamask.app.link/dapp/localhost:3000/pay/${address}`}
                                logoImage={newQrLogo}
                                logoHeight={50}
                                logoWidth={50}
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

                        <strong className='mt-4'>Active</strong>
                        <Switch onChange={onQrActiveChange} checked={qrStatus === "active"}></Switch>

                        <strong className='mt-4'>Change Logo</strong>
                        <input type="file" onChange={onQrCodeLogoChanged} accept='image/jpeg, image/png'></input>

                        <strong className='mt-4'>Position</strong>
                        <Select
                            className='w-100 text-left'
                            style={{ maxWidth: 500 }}
                            options={overlayPositionOptions}
                            onChange={value => { onQrPositionChange(value); }}
                            value={qrPosition}
                        >
                        </Select>
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