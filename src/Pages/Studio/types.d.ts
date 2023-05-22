export type StartStudioParams = {
    address: string;
}

// import { Announcement, Notification, Leaderboard, Milestone, Voting, QrCode } from "../../types";

export type announcementProp = {
    content?: string;
    speed?: number;
    status?: string;
}

export type qrProp = {
    qr?: string;
    status?: string;
}

export type pollProp = {
    title?: string;
    options?: {
        option: string;
        poll_amount: number;
    }[];
    total?: number;
    end_at?: string;
    status?: string;
}

export type leaderboardProp = {
    title?: string;
    timeframe?: string;
    status?: string;
}

export type milestoneProp = {
    title?: string;
    timeframe?: string;
    target?: string;
    start_at?: string;
    end_at?: string;
    bar_empty_color?: string;
    bar_filled_color?: string;
    status?: string;
    profit?: string;
    percent?: number;
}

export type triggerProp = {
    content?: string;
    caption?: string;
    type?: string;
    status?: string;
}

export type paymentProp = {
    from_wallet?: string;
    from_chain?: string;
    from_token_symbol?: string;
    from_token_address?: string;
    from_amount?: string;
    to_wallet?: string;
    to_chain?: string;
    to_token_symbol?: string;
    to_token_address?: string;
    to_amount?: string;
    tx_hash?: string;
    usd_worth?: string;
    status?: string;
    created_at?: string;
}

export type componentProperty = {
    qr: qrProp;
    announcement: announcementProp;
    leaderboard: leaderboardProp;
    poll: pollProp;
    milestone: milestoneProp;
    payment: paymentProp;
    trigger: triggerProp;
}