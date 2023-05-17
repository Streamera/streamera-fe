export type ChainConfig = {
    name: string;
    shortName: string;
    id: string;
    numericId: number | string;
    evmChain?: string;
    rpc: string;
    nativeCurrency: {
        name: string;
        decimals: number;
        symbol: string;
    };
    blockExplorerUrl?: string;
    streameraAddress?: string;
    dexAddress?: string;
    nativeTokenAddress?: string; // token address when native token (unwrapped) is used
    wrappedNativeTokenAddress?: string; // wrapped token address like wbnb
}