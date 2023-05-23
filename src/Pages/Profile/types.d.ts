export type UserDetails = {
    id: number;
    name: string;
    display_name: string;
    to_chain: string;
    to_token_address: string;
    profile_picture: string;
    facebook?: string;
    instagram?: string;
    twitter?: string;
    twitch?: string;
    tiktok?: string;
    youtube?: string;
    quick_amount: number[];
    chain_logo?: string;
}

export type UserDetailsKeys = keyof UserDetails;