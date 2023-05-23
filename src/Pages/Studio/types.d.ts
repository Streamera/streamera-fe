import { Theme } from "../../types";

export type StartStudioParams = {
    address: string;
}

// import { Announcement, Notification, Leaderboard, Milestone, Voting, QrCode } from "../../types";

export type AnnouncementProp = {
    content?: string;
    speed?: number;
    status?: string;
    theme?: Theme;
}

export type QrProp = {
    qr?: string;
    status?: string;
}

export type PollProp = {
    title?: string;
    options?: {
        option: string;
        total: number;
    }[];
    total?: number;
    end_at?: string;
    status?: string;
    theme?: Theme;
}

export type PaymentAggregate = {
    from_user: number | null;
    name: string;
    amount_usd: number; 
}

export type LeaderboardProp = {
    title?: string;
    timeframe?: string;
    status?: string;
    top_donators?: PaymentAggregate[];
    theme?: Theme;
}

export type MilestoneProp = {
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
    theme?: Theme;
}

export type TriggerProp = {
    content?: string;
    caption?: string;
    type?: string;
    status?: string;
}

export type PaymentProp = {
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

export type ComponentProperty = {
    qr: QrProp;
    announcement: AnnouncementProp;
    leaderboard: LeaderboardProp;
    poll: PollProp;
    milestone: MilestoneProp;
    payment: PaymentProp;
    trigger: TriggerProp;
}