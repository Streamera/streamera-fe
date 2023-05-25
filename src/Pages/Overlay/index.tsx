import { ChangeEvent, useCallback, useContext, useEffect, useRef, useState } from 'react';
import './styles.scss'
import { OverlayButtonType, Timeframe } from './types';
import { toast } from 'react-toastify';
import { cloneObj, getDappDomain } from '../../common/utils';
import { QRCode } from 'react-qrcode-logo';
import { AddressContext } from '../../App';
import axios from '../../Services/axios';
import { useCookies } from 'react-cookie';
import { Announcement, Leaderboard, Milestone, Notification, OverlayPosition, QrCode, Status, Theme, User, Voting, VotingOptions } from '../../types';
import { Select, DatePicker, Switch, ColorPicker, Slider, Input, InputNumber, Tag } from 'antd';
import {StudioAnnouncement, StudioLeaderboard, StudioMilestone, StudioVoting} from '../../Components/Studio';
import PositionInput from '../../Components/PositionInput';
import dayjs from 'dayjs';
import moment from 'moment';
import { UserDetails } from '../Profile/types';
const { RangePicker } = DatePicker;

const timeframeOptions = [
    {
        label: 'All Time',
        value: 'alltime',
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
];

const themeOptions = [
    {
        label: 'None',
        value: 'none',
    },
    {
        label: 'Cyberpunk',
        value: 'cyberpunk',
    },
    {
        label: 'Regal',
        value: 'regal',
    },
    {
        label: 'Rainbow',
        value: 'rainbow',
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
    const [ announcementTheme, setAnnouncementTheme ] = useState<Theme>("none");

    // Notification
    const [ notificationId, setNotificationId ] = useState(0);
    const [ notificationText, setNotificationText ] = useState<string>("Chad donated $99!");
    const [ notificationTextColor, setNotificationTextColor ] = useState<string>("#000000");
    const [ notificationBackgroundColor, setNotificationBackgroundColor ] = useState<string>("#ffffff");
    const [ gifFile, setGifFile ] = useState<File>();
    const [ gif, setGif ] = useState<string>("");
    const [ notificationPosition, setNotificationPosition ] = useState<OverlayPosition>("middle-center");
    const [ notificationStatus, setNotificationStatus ] = useState<Status>("inactive");
    const gifRef = useRef<any>();

    // Leaderboard
    const [ leaderboardId, setLeaderboardId ] = useState(0);
    const [ leaderboardText, setLeaderboardText ] = useState<string>("Leaderboard");
    const [ leaderboardTextColor, setLeaderboardTextColor ] = useState<string>("#000000");
    const [ leaderboardBackgroundColor, setLeaderboardBackgroundColor ] = useState<string>("#ffffff");
    const [ leaderboardTimeframe, setLeaderboardTimeframe ] = useState<Timeframe>("alltime");
    const [ leaderboardPosition, setLeaderboardPosition ] = useState<OverlayPosition>("middle-center");
    const [ leaderboardStatus, setLeaderboardStatus ] = useState<Status>("inactive");
    const [ leaderboardTheme, setLeaderboardTheme ] = useState<Theme>("none");

    // Milestone
    const [ milestoneId, setMilestoneId ] = useState(0);
    const [ milestoneText, setMilestoneText ] = useState<string>("Milestone");
    const [ milestoneTextColor, setMilestoneTextColor ] = useState<string>("#000000");
    const [ milestoneBackgroundColor, setMilestoneBackgroundColor ] = useState<string>("#ffffff");
    const [ milestoneProgressMainColor, setMilestoneProgressMainColor ] = useState<string>("#000000");
    const [ milestoneProgressColor, setMilestoneProgressColor ] = useState<string>("#ffffff");
    const [ milestoneTimeframe, setMilestoneTimeframe ] = useState<Timeframe>("alltime");
    const [ milestonePosition, setMilestonePosition ] = useState<OverlayPosition>("middle-center");
    const [ milestoneTarget, setMilestoneTarget ] = useState("0");
    const [ milestoneStartAt, setMilestoneStartAt ] = useState("");
    const [ milestoneEndAt, setMilestoneEndAt ] = useState("");
    const [ milestoneStatus, setMilestoneStatus ] = useState<Status>("inactive");
    const [ milestoneTheme, setMilestoneTheme ] = useState<Theme>("none");

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
    const [ votingTheme, setVotingTheme ] = useState<Theme>("none");

    //qr code
    const [ qrId, setQrId ] = useState(0);
    const [ qrUrl, setQrUrl ] = useState("");
    const [ qrBlob, setQrBlob ] = useState<Blob>();
    const [ newQrLogo, setNewQrLogo ] = useState("");
    const [ newQrLogoFile, setNewQrLogoFile ] = useState<File>();
    const [ qrPosition, setQrPosition ] = useState<OverlayPosition>("middle-center");
    const [ qrStatus, setQrStatus ] = useState<Status>("inactive");
    const qrLogoRef = useRef<any>();
    const previousAddress = useRef<string>("");
    const previousQrLogo = useRef<string>("");

    // setup (userState)
    const [ userState, setUserState ] = useState<User | null>(null);

    // announcement
    const onAnnouncementColorChange = useCallback((hex: string) => {
        setAnnouncementColor(hex);
    }, []);

    const onAnnouncementBackgroundColorChange = useCallback((hex: string) => {
        setAnnouncementBackgroundColor(hex);
    }, []);

    const onAnnouncementTextSpeedChange = useCallback((speed: number) => {
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

    const onAnnouncementThemeChange = useCallback((value: Theme) => {
        setAnnouncementTheme(value);
    }, []);

    const onAnnouncementActiveChange = useCallback((value: boolean) => {
        setAnnouncementStatus(value? "active" : "inactive");
    }, []);

    // notifications
    const onNotificationTextChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setNotificationText(e.target.value);
    }, []);

    const onNotificationTextColorChange = useCallback((hex: string) => {
        setNotificationTextColor(hex);
    }, []);

    const onNotificationBackgroundColorChange = useCallback((hex: string) => {
        setNotificationBackgroundColor(hex);
    }, []);

    const onNotificationPositionChange = useCallback((value: OverlayPosition) => {
        setNotificationPosition(value);
    }, []);

    const onNotificationActiveChange = useCallback((value: boolean) => {
        setNotificationStatus(value? "active" : "inactive");
    }, []);

    const onGifButtonClicked = useCallback(() => {
        if(!gifRef.current) {
            return;
        }

        gifRef.current.click();
    }, []);

    const onGifValueChanged = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setGif(URL.createObjectURL(event.target.files[0]));
            setGifFile(event.target.files[0]);
        }
    }, []);

    // leaderboard
    const onLeaderboardTextChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setLeaderboardText(e.target.value);
    }, []);

    const onLeaderboardTextColorChange = useCallback((hex: string) => {
        setLeaderboardTextColor(hex);
    }, []);

    const onLeaderboardBackgroundColorChange = useCallback((hex: string) => {
        setLeaderboardBackgroundColor(hex);
    }, []);

    const onLeaderboardTimeframeChanged = useCallback((value: Timeframe) => {
        setLeaderboardTimeframe(value);
    }, []);

    const onLeaderboardPositionChange = useCallback((value: OverlayPosition) => {
        setLeaderboardPosition(value);
    }, []);

    const onLeaderboardThemeChange = useCallback((value: Theme) => {
        setLeaderboardTheme(value);
    }, []);

    const onLeaderboardActiveChange = useCallback((value: boolean) => {
        setLeaderboardStatus(value? "active" : "inactive");
    }, []);

    //milestone
    const onMilestoneTextChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setMilestoneText(e.target.value);
    }, []);

    const onMilestoneTextColorChange = useCallback((hex: string) => {
        setMilestoneTextColor(hex);
    }, []);

    const onMilestoneBackgroundColorChange = useCallback((hex: string) => {
        setMilestoneBackgroundColor(hex);
    }, []);

    const onMilestoneProgressMainColorChange = useCallback((hex: string) => {
        setMilestoneProgressMainColor(hex);
    }, []);

    const onMilestoneProgressColorChange = useCallback((hex: string) => {
        setMilestoneProgressColor(hex);
    }, []);

    const onMilestoneTargetChange = useCallback((value: string | null) => {
        setMilestoneTarget(value ?? "0");
    }, []);

    const onMilestoneDateRangeChange = useCallback((dateRangeFn: any, dateRangeStrings: any, info: any) => {
        let [startDate, endDate] = dateRangeStrings;

        if(!startDate) {
            startDate = moment().format('YYYY-MM-DD HH:mm:ss');
        }

        if(!endDate) {
            endDate = moment(startDate).add(1, 'day').format('YYYY-MM-DD HH:mm:ss');
        }

        setMilestoneStartAt(startDate);
        setMilestoneEndAt(endDate);
    }, []);

    const onMilestoneTimeframeChanged = useCallback((value: Timeframe) => {
        setMilestoneTimeframe(value);
    }, []);

    const onMilestonePositionChange = useCallback((value: OverlayPosition) => {
        setMilestonePosition(value);
    }, []);

    const onMilestoneThemeChange = useCallback((value: Theme) => {
        setMilestoneTheme(value);
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

    const onVotingTextColorChange = useCallback((hex: string) => {
        setVotingTextColor(hex);
    }, []);

    const onVotingBackgroundColorChange = useCallback((hex: string) => {
        setVotingBackgroundColor(hex);
    }, []);

    const onVotingPositionChange = useCallback((value: OverlayPosition) => {
        setVotingPosition(value);
    }, []);

    const onVotingThemeChange = useCallback((value: Theme) => {
        setVotingTheme(value);
    }, []);

    const onVotingDateRangeChange = useCallback((dateRangeFn: any, dateRangeStrings: any, info: any) => {
        let [startDate, endDate] = dateRangeStrings;

        if(!startDate) {
            startDate = moment().format('YYYY-MM-DD HH:mm:ss');
        }

        if(!endDate) {
            endDate = moment(startDate).add(1, 'day').format('YYYY-MM-DD HH:mm:ss');
        }

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
    const onQrButtonClicked = useCallback(() => {
        if(!qrLogoRef.current) {
            return;
        }

        qrLogoRef.current.click();
    }, []);

    const onQrCodeLogoChanged = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setNewQrLogoFile(undefined);

            setTimeout(() => {
                setNewQrLogo(URL.createObjectURL(event.target.files![0]));
                setNewQrLogoFile(event.target.files![0]);
            }, 0);
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
            theme: announcementTheme,
        });

        if(!res.data.success) {
            toast.success("Error saving announcement");
            return;
        }
        toast.success("Saved");

    }, [activeTab, address, announcementTheme, announcementStatus, announcementId, announcementTextSpeed, announcementText, cookies, announcementBackgroundColor, announcementColor, announcementPosition]);

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
        toast.success("Saved");
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
            theme: leaderboardTheme,
        });

        if(!res.data.success) {
            toast.success("Error saving leaderboard");
            return;
        }
        toast.success("Saved");
    }, [leaderboardStatus, leaderboardBackgroundColor, leaderboardTheme, leaderboardTextColor, leaderboardTimeframe, leaderboardText, leaderboardId, activeTab, cookies, address, leaderboardPosition]);

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
            theme: milestoneTheme,
        });

        if(!res.data.success) {
            toast.success("Error saving milestone");
            return;
        }
        toast.success("Saved");
    }, [milestoneStatus, milestoneId, milestoneTheme, milestoneBackgroundColor, milestoneProgressColor, milestoneProgressMainColor, milestoneText, milestoneTextColor, milestoneTimeframe, address, cookies, activeTab, milestonePosition, milestoneEndAt, milestoneStartAt, milestoneTarget]);

    const saveVoting = useCallback(async() => {
        // 'user_id', 'status', 'title', 'style_id', 'start_at', 'end_at', options
        if(!votingText || !votingId || activeTab !== "voting") {
            return;
        }

        if (votingChoices.length === 0) {
            toast.error("Add at least 1 voting choice");
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
            theme: votingTheme,
        });

        if(!res.data.success) {
            toast.success("Error saving polls");
            return;
        }
        toast.success("Saved");
    }, [votingStatus, votingText, votingChoices, votingTheme, votingId, address, cookies, votingBackgroundColor, votingTextColor, activeTab, votingPosition, votingStartAt, votingEndAt]);

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
        toast.success("Saved");
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
            theme,
        } = res.data[0];

        setAnnouncementId(id);
        setAnnouncementText(!content || content.length === 0? "Sample Text" : content);
        setAnnouncementTextSpeed(speed);
        setAnnouncementBackgroundColor(bg_color? bg_color : "#000000");
        setAnnouncementColor(font_color? font_color: "#ffffff");
        setAnnouncementPosition(position ?? 'middle-center');
        setAnnouncementStatus(status);
        setAnnouncementTheme(theme ?? "none");
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
            theme,
        } = res.data[0];

        setLeaderboardId(id);
        setLeaderboardText(!title || title.length === 0? "Sample Text" : title);
        setLeaderboardTextColor(bg_color? bg_color : "#000000");
        setLeaderboardBackgroundColor(font_color? font_color: "#ffffff");
        setLeaderboardTimeframe(timeframe as Timeframe);
        setLeaderboardPosition(position ?? 'middle-center');
        setLeaderboardStatus(status);
        setLeaderboardTheme(theme ?? "none");
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
            theme,
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
        setMilestoneTheme(theme ?? "none");
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
            theme,
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
        setVotingTheme(theme ?? "none");
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

    const sendTrigger = useCallback(async() => {
        await axios.post<QrCode[]>('/trigger/demo', { user_id: userState!.id });
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

            setUserState(user);
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
                <button className={activeTab === 'setup'? 'active' : ''} onClick={() => setActiveTab('setup')}>Setup</button>
            </div>

            <div className="main-content">
                { /** Announcement */}
                {
                    activeTab === "announcement" &&
                    <>
                        <StudioAnnouncement
                            text={announcementText}
                            speed={announcementTextSpeed}
                            color={announcementColor}
                            bgColor={announcementBackgroundColor}
                            theme={announcementTheme}
                            isPreview
                        />

                        <div className="d-flex flex-column w-100">

                        </div>
                        <div className="d-flex align-items-center justify-content-center my-5 w-100">
                            <strong className='mr-2'>Active</strong>
                            <Switch onChange={onAnnouncementActiveChange} checked={announcementStatus === "active"}></Switch>
                            <strong className='ml-5 mr-2'>Text</strong>
                            <ColorPicker
                                value={announcementColor}
                                onChange={(value, hex) => onAnnouncementColorChange(hex) }
                            />
                            <strong className='ml-5 mr-2'>Background</strong>
                            <ColorPicker
                                value={announcementBackgroundColor}
                                onChange={(value, hex) => onAnnouncementBackgroundColorChange(hex) }
                            />
                        </div>
                        <strong>Text Speed</strong>
                        <Slider
                            defaultValue={announcementTextSpeed}
                            onAfterChange={onAnnouncementTextSpeedChange}
                            min={10}
                            max={300}
                            className='w-100'
                            style={{ maxWidth: 500 }}
                        />

                        <strong className='mt-4'>Theme</strong>
                        <Select
                            className='w-100 text-left'
                            style={{ maxWidth: 500 }}
                            options={themeOptions}
                            onChange={value => { onAnnouncementThemeChange(value); }}
                            value={announcementTheme}
                        >
                        </Select>

                        <strong className='mt-4'>Display Text</strong>
                        <Input
                            style={{ maxWidth: 500 }}
                            className='w-100'
                            value={announcementText}
                            onChange={onAnnouncementTextChange}
                        />

                        <strong className='mt-4'>Position</strong>
                        <PositionInput
                            value={announcementPosition}
                            onChange={onAnnouncementPositionChange}
                        />
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

                        <div className="d-flex align-items-center my-5">

                            <strong className='mr-2'>Active</strong>
                            <Switch onChange={onNotificationActiveChange} checked={notificationStatus === "active"}></Switch>

                            <strong className='ml-5 mr-2'>Text</strong>
                            <ColorPicker
                                value={notificationTextColor}
                                onChange={(value, hex) => onNotificationTextColorChange(hex) }
                            />
                            <strong className='ml-5 mr-2'>Background</strong>
                            <ColorPicker
                                value={notificationBackgroundColor}
                                onChange={(value, hex) => onNotificationBackgroundColorChange(hex) }
                            />

                            <button className='ml-5 upload-button' onClick={onGifButtonClicked}><i className="fa fa-upload"></i><span>Upload GIF</span></button>
                            <input ref={ref => gifRef.current = ref} className='d-none' type="file" accept='image/gif,image/webp' onChange={onGifValueChanged}/>
                        </div>

                        <strong className='mt-4'>Notification Text</strong>
                        <Input
                            style={{ maxWidth: 500 }}
                            className='w-100'
                            value={notificationText}
                            onChange={onNotificationTextChange}
                        />

                        <strong className='mt-4'>Position</strong>
                        <PositionInput
                            value={notificationPosition}
                            onChange={onNotificationPositionChange}
                        />
                    </>
                }
                { /** Leaderboard */}
                {
                    activeTab === "leaderboard" &&
                    <>
                        <StudioLeaderboard
                            theme={leaderboardTheme}
                            text={leaderboardText}
                            color={leaderboardTextColor}
                            bgColor={leaderboardBackgroundColor}
                            topDonators={[
                                {
                                    from_user: null,
                                    name: 'Chad',
                                    amount_usd: 99
                                },
                                {
                                    from_user: null,
                                    name: 'Chad1',
                                    amount_usd: 99
                                },
                                {
                                    from_user: null,
                                    name: 'Chad2',
                                    amount_usd: 99
                                },
                                {
                                    from_user: null,
                                    name: 'Chad3',
                                    amount_usd: 99
                                },
                                {
                                    from_user: null,
                                    name: 'Chad4',
                                    amount_usd: 99
                                }
                            ]}
                            isPreview
                        />

                        <div className="d-flex align-items-center mt-3">
                            <strong className='mr-2'>Active</strong>
                            <Switch onChange={onLeaderboardActiveChange} checked={leaderboardStatus === "active"}></Switch>

                            <strong className='ml-5 mr-2'>Text</strong>
                            <ColorPicker
                                value={leaderboardTextColor}
                                onChange={(value, hex) => onLeaderboardTextColorChange(hex) }
                            />
                            <strong className='ml-5 mr-2'>Background</strong>
                            <ColorPicker
                                value={leaderboardBackgroundColor}
                                onChange={(value, hex) => onLeaderboardBackgroundColorChange(hex) }
                            />
                        </div>

                        <strong className='mt-4'>Theme</strong>
                        <Select
                            className='w-100 text-left'
                            style={{ maxWidth: 500 }}
                            options={themeOptions}
                            onChange={value => { onLeaderboardThemeChange(value); }}
                            value={leaderboardTheme}
                        >
                        </Select>

                        <strong className='mt-3'>Text</strong>
                        <Input
                            style={{ maxWidth: 500 }}
                            value={leaderboardText}
                            onChange={onLeaderboardTextChange}
                        />

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
                        <PositionInput
                            value={leaderboardPosition}
                            onChange={onLeaderboardPositionChange}
                        />
                    </>
                }
                { /** Milestone */}
                {
                    activeTab === "milestone" &&
                    <>
                        <StudioMilestone
                            theme={milestoneTheme}
                            text={milestoneText}
                            color={milestoneTextColor}
                            bgColor={milestoneBackgroundColor}
                            progress={30}
                            current={parseFloat(milestoneTarget) * 0.3}
                            target={parseFloat(milestoneTarget)}
                            progressColor={milestoneProgressColor}
                            progressBgColor={milestoneProgressMainColor}
                            isPreview
                        />

                        <div className="d-flex flex-column justify-content-center">
                            <div className="d-flex align-items-center mt-3">
                                <strong className='mr-2'>Active</strong>
                                <Switch onChange={onMilestoneActiveChange} checked={milestoneStatus === "active"}></Switch>

                                <strong className='ml-5 mr-2'>Text</strong>
                                <ColorPicker
                                    value={milestoneTextColor}
                                    onChange={(value, hex) => onMilestoneTextColorChange(hex) }
                                />
                                <strong className='ml-5 mr-2'>Background</strong>
                                <ColorPicker
                                    value={milestoneBackgroundColor}
                                    onChange={(value, hex) => onMilestoneBackgroundColorChange(hex) }
                                />
                            </div>
                            <div className="d-flex justify-content-center mt-3">
                                <strong className='mr-2'>Bar Color</strong>
                                <ColorPicker
                                    value={milestoneProgressColor}
                                    onChange={(value, hex) => onMilestoneProgressColorChange(hex) }
                                />
                                <strong className='ml-5 mr-2'>Progress Color</strong>
                                <ColorPicker
                                    value={milestoneProgressMainColor}
                                    onChange={(value, hex) => onMilestoneProgressMainColorChange(hex) }
                                />
                            </div>
                        </div>

                        <strong className='mt-4'>Theme</strong>
                        <Select
                            className='w-100 text-left'
                            style={{ maxWidth: 500 }}
                            options={themeOptions}
                            onChange={value => { onMilestoneThemeChange(value); }}
                            value={milestoneTheme}
                        >
                        </Select>

                        <strong className='mt-3'>Date Range</strong>
                        <RangePicker
                            showTime
                            value={[dayjs(milestoneStartAt), dayjs(milestoneEndAt)]}
                            onCalendarChange={onMilestoneDateRangeChange}
                            style={{ width: 500 }}
                        />
                        <strong className='mt-3'>Text</strong>
                        <Input
                            className='w-100'
                            value={milestoneText}
                            onChange={onMilestoneTextChange}
                            style={{ maxWidth: 500 }}
                        />

                        <strong className='mt-3'>Target</strong>
                        <InputNumber
                            className='w-100'
                            style={{ maxWidth: 500 }}
                            value={milestoneTarget}
                            onChange={onMilestoneTargetChange}
                        />

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
                        <PositionInput
                            value={milestonePosition}
                            onChange={onMilestonePositionChange}
                        />
                    </>
                }
                { /** Voting */}
                {
                    activeTab === "voting" &&
                    <>
                        <StudioVoting
                            theme={votingTheme}
                            text={votingText}
                            color={votingTextColor}
                            bgColor={votingBackgroundColor}
                            endAt={votingEndAt}
                            choices={votingChoices}
                            total={0}
                            isPreview
                        />

                        <div className="d-flex align-items-center mt-3">
                            <strong className='mr-2'>Active</strong>
                            <Switch onChange={onVotingActiveChange}  checked={votingStatus === "active"}></Switch>
                            <strong className='ml-5 mr-2'>Text</strong>
                            <ColorPicker
                                value={votingTextColor}
                                onChange={(value, hex) => onVotingTextColorChange(hex) }
                            />
                            <strong className='ml-5 mr-2'>Background</strong>
                            <ColorPicker
                                value={votingBackgroundColor}
                                onChange={(value, hex) => onVotingBackgroundColorChange(hex) }
                            />
                        </div>

                        <strong className='mt-4'>Theme</strong>
                        <Select
                            className='w-100 text-left'
                            style={{ maxWidth: 500 }}
                            options={themeOptions}
                            onChange={value => { onVotingThemeChange(value); }}
                            value={votingTheme}
                        >
                        </Select>

                        <strong className='mt-3'>Date Range</strong>
                        <RangePicker
                            className='w-100'
                            style={{ maxWidth: 500 }}
                            showTime
                            value={[dayjs(votingStartAt), dayjs(votingEndAt)]}
                            onCalendarChange={onVotingDateRangeChange}
                        />
                        <strong className='mt-3'>Title</strong>
                        <Input
                            className='w-100'
                            style={{ maxWidth: 500 }}
                            value={votingText}
                            onChange={onVotingTextChange}
                        />

                        <strong className='mt-3'>New Choice</strong>
                        <div className="d-flex align-items-center w-100" style={{ maxWidth: 500 }}>
                            <Input
                                className='w-100'
                                style={{ maxWidth: 500 }}
                                value={votingChoice}
                                onChange={onVotingChoiceChange}
                            />
                            <button className="btn btn-success btn-sm ml-2" onClick={() => { onChoiceAdd() } }><i className="fa fa-plus"></i></button>
                        </div>
                        <div className="choices-container">
                            {
                                votingChoices.map((x, index) => (
                                    <div className="vote-choice" key={`${x.option}|choices|${index}`}>
                                        <button className="delete" onClick={() => onChoiceDelete(x.id ?? 0, x.option)}>
                                            <span className='text'>{x.option}</span>
                                            <span className="icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"></path></svg></span>
                                        </button>
                                    </div>
                                ))
                            }
                        </div>

                        <strong className='mt-4'>Position</strong>
                        <PositionInput
                            value={votingPosition}
                            onChange={onVotingPositionChange}
                        />
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
                                value={`https://metamask.app.link/dapp/${getDappDomain()}/pay/${address}`}
                                logoImage={newQrLogo}
                                logoHeight={50}
                                logoWidth={50}
                                id="qr-code"
                                logoOnLoad={() => {
                                    const canvas: any = document.getElementById("qr-code");
                                    if(canvas) {
                                        canvas.toBlob((blob: Blob) => {
                                            if(address === previousAddress.current && newQrLogo === previousQrLogo.current) {
                                                return;
                                            }
                                            previousAddress.current = address;
                                            previousQrLogo.current = newQrLogo;
                                            setQrBlob(blob);
                                        });
                                    }
                                }}
                                enableCORS
                            />
                        }

                        <div className="d-flex mt-3">
                            <strong className='mr-2'>Active</strong>
                            <Switch onChange={onQrActiveChange} checked={qrStatus === "active"}></Switch>

                            <button className='ml-5 upload-button' onClick={onQrButtonClicked}><i className="fa fa-upload"></i><span>Upload Logo</span></button>
                            <input className='d-none' ref={ref => qrLogoRef.current = ref} type="file" onChange={onQrCodeLogoChanged} accept='image/jpeg, image/png'></input>
                        </div>

                        <strong className='mt-4'>Position</strong>
                        <PositionInput
                            value={qrPosition}
                            onChange={onQrPositionChange}
                        />
                    </>
                }
                { /** Setup */}
                {
                    activeTab === "setup" &&
                    <>
                        <div className='mt-3 mx-5 text-left'>
                            <h3>Overlay URL:</h3>
                            Click the <span className="badge bg-info">Copy</span> button and paste the URL in the OBS "Browser Module".
                            <br />
                            <br />
                            <p>
                                <Tag color="#2db7f5">New</Tag>After changing the view, double click on the browser source on OBS and press "Refresh cache of current page".
                                <br />
                                If it doesn't appear, make sure OBS has been updated to the latest version.
                            </p>

                            <input type="text" id="studio-url" className="studio-url" value={`${getDappDomain()}/studio/${address}`} readOnly />

                            <div className='studio-action'>
                                <button
                                    className='mt-2 btn btn-info studio-copy'
                                    disabled={!address}
                                    onClick={() => {
                                        navigator.clipboard.writeText(`${getDappDomain()}/studio/${address}`);
                                        toast.success(`Copied URL`)
                                    }}
                                >
                                    Copy
                                </button>
                                &nbsp;
                                <a
                                    className='mt-2 btn btn-warning studio-open'
                                    href={`${getDappDomain()}/studio/${address}`}
                                    target={`_blank`}
                                >
                                    Open in new tab
                                </a>
                                &nbsp;
                                <button
                                    className='mt-2 btn btn-success studio-popup'
                                    onClick={sendTrigger}
                                    disabled={!address}
                                >
                                    Pop up notification
                                </button>
                            </div>


                            <h3 className='mt-5'>Payment URL:</h3>
                            Click the <span className="badge bg-info">Copy</span> button and send the payment url to your audience.
                            <br />
                            <br />

                            <input type="text" id="pay-url" className="pay-url" value={`${getDappDomain()}/pay/${address}`} readOnly />

                            <div className='studio-action'>
                                <button
                                    className='mt-2 btn btn-info'
                                    disabled={!address}
                                    onClick={() => {
                                        navigator.clipboard.writeText(`${getDappDomain()}/pay/${address}`);
                                        toast.success(`Copied URL`)
                                    }}
                                >
                                    Copy
                                </button>
                                &nbsp;
                                <a
                                    className='mt-2 btn btn-warning'
                                    href={`${getDappDomain()}/pay/${address}`}
                                    target={`_blank`}
                                >
                                    Open in new tab
                                </a>
                            </div>
                        </div>

                        <div className="d-flex mt-3">

                        </div>

                    </>
                }
                {
                    activeTab != 'setup' &&
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
                }
            </div>
        </div>
    );
}

export default Page;