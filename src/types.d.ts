import { Squid, TokenData } from "@0xsquid/sdk";

export type SupportedChain = {
    name: string;
    chainId: string | number;
    chainLogo: string;
}

export type SquidContextData = {
    squid: Squid | null;
    supportedChains: SupportedChain[];
    supportedTokens: {
        [chains: string]: TokenData[]
    };
}

export type User = {
    created_at: string;
    display_name: string;
    id: number;
    name: string;
    profile_picture: string | null;
    social: any;
    status: string;
    to_chain: string;
    to_token_address: string;
    to_token_symbol: string;
    updated_at: string | null;
    wallet: string;
    quick_amount: string[];
}

export type OverlayPosition = 'top-left' | 'top-center' | 'top-right' | 'middle-left' | 'middle-center' | 'middle-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
export type Status = 'active' | 'inactive';
export interface ElementStyle {
    style_id: number;
    font_type?: string;
    font_size?: string;
    font_color?: string;
    bg_color?: string;
    bg_image?: string;
    bar_empty_color?: string;
    bar_filled_color?: string;
    position?: OverlayPosition;
    theme?: Theme;
}

export interface BasicDataDetails {
    id: number;
    created_at: string;
    updated_at: string | null;
    deleted_at: string | null;
}

export interface Announcement extends ElementStyle, BasicDataDetails {
    content: string;
    speed: number;
    start_at: string;
    end_at: string;
    status: Status;
}
export interface Notification extends ElementStyle, BasicDataDetails {
    content: string;
    caption: string;
    type: string;
    status: Status;
}
export interface Leaderboard extends ElementStyle, BasicDataDetails {
    title: string;
    timeframe: string;
    status: Status;
}
export interface Milestone extends ElementStyle, BasicDataDetails {
    title: string;
    target: string;
    start_at: string;
    end_at: string;
    timeframe: string;
    status: Status;
}
export interface VotingOptions {
    id?: number;
    option: string;
    total?: number;
}
export interface Voting extends ElementStyle, BasicDataDetails {
    title: string;
    start_at: string;
    end_at: string;
    options: VotingOptions[];
    status: Status;
}
export interface QrCode extends ElementStyle, BasicDataDetails {
    qr: string;
    status: Status;
}

// theme component
export type Theme = "none" | "cyberpunk" | "regal" | "rainbow";