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
}

export type OverlayPosition = 'top-left' | 'top-center' | 'top-right' | 'middle-left' | 'middle-center' | 'middle-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';

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
}

export interface Timestamps {
    created_at: string;
    updated_at: string | null;
    deleted_at: string | null;
}
export interface QrCode extends ElementStyle, Timestamps {
    qr: string;
    status: 'active' | 'inactive';
}