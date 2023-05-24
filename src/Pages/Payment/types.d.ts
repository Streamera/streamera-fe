export type PaymentStatus = 'pending' | 'success' | 'failed';

export type PaymentData = {
    from_user: number | null;
    from_wallet: string;
    from_chain: number;
    from_token_symbol: string;
    from_token_address: string;
    from_amount: string;
    to_user: number;
    to_wallet: string;
    to_chain: number;
    to_token_symbol: string;
    to_token_address: string;
    // to_amount: string;
    tx_hash: string;
    usd_worth: string;
}

export type PaymentReturn = {
    success: boolean;
    data: { id: string | number };
}

export type PaymentStatusData = {
    status: PaymentStatus;
}