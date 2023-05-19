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

export type UserDetails = {
    id: number;
    name: string;
    display_name: string;
    to_chain: string;
    to_token_address: string;
    facebook?: string;
    instagram?: string;
    twitter?: string;
    twitch?: string;
    tiktok?: string;
    youtube?: string;
}

export type UserDetailsKeys = keyof UserDetails;