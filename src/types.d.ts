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