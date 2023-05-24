import { ChainConfig } from "./types";
import { ethers } from 'ethers';

// chains
export const BSC_TEST: ChainConfig = {
    name: 'BNB Chain',
    shortName: 'BSC',
    id: ethers.utils.hexlify(97),
    numericId: 97,
    evmChain: 'binance',
    rpc: 'https://data-seed-prebsc-2-s1.binance.org:8545',
    nativeCurrency: {
        name: 'BNB',
        decimals: 18,
        symbol: 'BNB',
    },
    blockExplorerUrl: 'https://testnet.bscscan.com',
    streameraAddress: '0x2D6d5b42fe8898515a74A2b53055967AE522e290',
    dexAddress: "0xD99D1c33F9fC3444f8101754aBC46c52416550D1",
    nativeTokenAddress: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    wrappedNativeTokenAddress: '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd',
};
export const POLYGON_TEST: ChainConfig = {
    name: 'Polygon',
    shortName: 'MUMBAI',
    evmChain: 'polygon',
    // id: ethers.utils.hexlify(80001),
    id: '0x13881',
    numericId: 80001,
    // rpc: 'https://rpc-mumbai.matic.today/',
    rpc: 'https://polygon-testnet.public.blastapi.io/',
    // rpc: 'https://rpc-mumbai.maticvigil.com/',
    nativeCurrency: {
        name: 'MATIC',
        decimals: 18,
        symbol: 'MATIC',
    },
    blockExplorerUrl: 'https://mumbai.polygonscan.com',
};
export const AVAX_TEST: ChainConfig = {
    name: 'Avalanche C-Chain Testnet',
    shortName: 'AVAX',
    evmChain: 'avalanche',
    id: '0xa869',
    numericId: 43113,
    rpc: 'https://api.avax-test.network/ext/bc/C/rpc',
    nativeCurrency: {
        name: 'AVAX',
        decimals: 18,
        symbol: 'AVAX',
    },
    blockExplorerUrl: 'https://testnet.snowtrace.io/',
};
export const ETH: ChainConfig = {
    name: 'Ethereum',
    shortName: 'ETH',
    evmChain: 'ethereum',
    id: ethers.utils.hexlify(1),
    numericId: 1,
    rpc: '',
    nativeCurrency: {
        name: 'ETH',
        decimals: 18,
        symbol: 'ETH',
    },
};
export const BSC: ChainConfig = {
    name: 'BNB Chain',
    shortName: 'BSC',
    evmChain: 'binance',
    id: ethers.utils.hexlify(56),
    numericId: 56,
    rpc: 'https://bsc-dataseed1.binance.org',
    nativeCurrency: {
        name: 'BNB',
        decimals: 18,
        symbol: 'BNB',
    },
    blockExplorerUrl: 'https://bscscan.com',
};
export const AVAX: ChainConfig = {
    name: 'Avalanche C-Chain',
    shortName: 'AVAX',
    evmChain: 'avalanche',
    id: '0xa86a',
    numericId: 43114,
    rpc: 'https://api.avax.network/ext/bc/C/rpc',
    nativeCurrency: {
        name: 'AVAX',
        decimals: 18,
        symbol: 'AVAX',
    },
    blockExplorerUrl: 'https://snowtrace.io',
};
export const POLYGON: ChainConfig = {
    name: 'Polygon',
    shortName: 'Polygon',
    evmChain: 'polygon',
    id: ethers.utils.hexlify(137),
    numericId: 137,
    rpc: 'https://polygon-rpc.com',
    nativeCurrency: {
        name: 'MATIC',
        decimals: 18,
        symbol: 'MATIC',
    },
    blockExplorerUrl: 'https://polygonscan.com',
};
export const ARB: ChainConfig = {
    name: 'Arbitrum One',
    shortName: 'ARB',
    evmChain: 'arbitrium',
    id: ethers.utils.hexlify(42161),
    numericId: 42161,
    rpc: 'https://arb1.arbitrum.io/rpc',
    nativeCurrency: {
        name: 'ETH',
        decimals: 18,
        symbol: 'ETH',
    },
    blockExplorerUrl: 'https://arbiscan.io',
};
export const ARB_TEST: ChainConfig = {
    name: 'Arbitrum Goerli',
    shortName: 'ARB',
    evmChain: 'arbitrium',
    id: ethers.utils.hexlify(421613),
    numericId: 421613,
    rpc: 'https://arbitrum-goerli.public.blastapi.io',
    nativeCurrency: {
        name: 'ETH',
        decimals: 18,
        symbol: 'ETH',
    },
    blockExplorerUrl: 'https://goerli.arbiscan.io',
};
export const OP: ChainConfig = {
    name: 'Optimism',
    shortName: 'OP',
    id: ethers.utils.hexlify(10),
    numericId: 10,
    rpc: 'https://mainnet.optimism.io',
    nativeCurrency: {
        name: 'ETH',
        decimals: 18,
        symbol: 'ETH',
    },
    blockExplorerUrl: 'https://optimistic.etherscan.io',
};
export const CRO: ChainConfig = {
    name: 'Cronos Mainnet',
    shortName: 'CRO',
    id: ethers.utils.hexlify(25),
    numericId: 25,
    rpc: 'https://evm.cronos.org',
    nativeCurrency: {
        name: 'CRO',
        decimals: 18,
        symbol: 'CRO',
    },
    blockExplorerUrl: 'https://cronos.org/explorer',
};
export const FTM: ChainConfig = {
    name: 'Fantom Opera',
    shortName: 'FTM',
    evmChain: 'fantom',
    id: ethers.utils.hexlify(250),
    numericId: 250,
    rpc: 'https://rpc.ftm.tools',
    nativeCurrency: {
        name: 'FTM',
        decimals: 18,
        symbol: 'FTM',
    },
    blockExplorerUrl: 'https://ftmscan.com',
};
export const KLAYTN: ChainConfig = {
    name: 'Klaytn Mainnet Cypress',
    shortName: 'KLAYTN',
    id: ethers.utils.hexlify(8217),
    numericId: 8217,
    rpc: 'https://public-node-api.klaytnapi.com/v1/cypress',
    nativeCurrency: {
        name: 'KLAY',
        decimals: 18,
        symbol: 'KLAY',
    },
    blockExplorerUrl: 'https://scope.klaytn.com',
};
export const KAVA: ChainConfig = {
    name: 'Kava EVM',
    shortName: 'KAVA',
    id: ethers.utils.hexlify(2222),
    numericId: 2222,
    rpc: 'https://evm.kava.io',
    nativeCurrency: {
        name: 'KAVA',
        decimals: 18,
        symbol: 'KAVA',
    },
    blockExplorerUrl: 'https://explorer.kava.io',
};
export const GNO: ChainConfig = {
    name: 'Gnosis',
    shortName: 'GNO',
    id: ethers.utils.hexlify(100),
    numericId: 100,
    rpc: 'https://rpc.gnosischain.com',
    nativeCurrency: {
        name: 'xDAI',
        decimals: 18,
        symbol: 'xDAI',
    },
    blockExplorerUrl: 'https://gnosisscan.io',
};
export const AURORA: ChainConfig = {
    name: 'Aurora Mainnet',
    shortName: 'AURORA',
    evmChain: 'aurora',
    id: ethers.utils.hexlify(1313161554),
    numericId: 1313161554,
    rpc: 'https://mainnet.aurora.dev',
    nativeCurrency: {
        name: 'AURORA',
        decimals: 18,
        symbol: 'AURORA',
    },
    blockExplorerUrl: 'https://aurorascan.dev',
};
export const HECO: ChainConfig = {
    name: 'Huobi ECO Chain Mainnet',
    shortName: 'HECO',
    id: ethers.utils.hexlify(128),
    numericId: 128,
    rpc: 'https://http-mainnet.hecochain.com',
    nativeCurrency: {
        name: 'HT',
        decimals: 18,
        symbol: 'HT',
    },
    blockExplorerUrl: 'https://hecoinfo.com',
};
export const FUSION: ChainConfig = {
    name: 'Fusion Mainnet',
    shortName: 'FUSION',
    id: ethers.utils.hexlify(32659),
    numericId: 32659,
    rpc: 'https://mainnet.anyswap.exchange',
    nativeCurrency: {
        name: 'FSN',
        decimals: 18,
        symbol: 'FSN',
    },
    blockExplorerUrl: 'https://www.fusion.org/',
};
export const CELO: ChainConfig = {
    name: 'Celo Mainnet',
    shortName: 'CELO',
    id: ethers.utils.hexlify(42220),
    numericId: 42220,
    rpc: 'https://forno.celo.org',
    nativeCurrency: {
        name: 'CELO',
        decimals: 18,
        symbol: 'CELO',
    },
    blockExplorerUrl: 'https://explorer.celo.org',
};
export const CELO_TEST: ChainConfig = {
    name: 'Celo Alfajores',
    shortName: 'CELO',
    id: ethers.utils.hexlify(44787),
    numericId: 44787,
    rpc: 'https://alfajores-forno.celo-testnet.org',
    nativeCurrency: {
        name: 'CELO',
        decimals: 18,
        symbol: 'CELO',
    },
    blockExplorerUrl: 'https://alfajores.celoscan.io',
};
export const EVMOS: ChainConfig = {
    name: 'Evmos',
    shortName: 'EVMOS',
    id: ethers.utils.hexlify(9001),
    numericId: 9001,
    rpc: 'https://eth.bd.evmos.org:8545',
    nativeCurrency: {
        name: 'EVMOS',
        decimals: 18,
        symbol: 'EVMOS',
    },
    blockExplorerUrl: 'https://evm.evmos.org',
};
export const DOGE: ChainConfig = {
    name: 'Dogechain Mainnet',
    shortName: 'DOGE',
    id: ethers.utils.hexlify(2000),
    numericId: 2000,
    rpc: 'https://rpc-sg.dogechain.dog',
    nativeCurrency: {
        name: 'DOGE',
        decimals: 18,
        symbol: 'DOGE',
    },
    blockExplorerUrl: 'https://explorer.dogechain.dog',
};
export const OKX: ChainConfig = {
    name: 'OKXChain Mainnet',
    shortName: 'OKX',
    id: ethers.utils.hexlify(66),
    numericId: 66,
    rpc: 'https://exchainrpc.okex.org',
    nativeCurrency: {
        name: 'OKT',
        decimals: 18,
        symbol: 'OKT',
    },
    blockExplorerUrl: 'https://www.oklink.com/en/okc',
};
export const BOBA: ChainConfig = {
    name: 'Boba Network',
    shortName: 'BOBA',
    id: ethers.utils.hexlify(288),
    numericId: 288,
    rpc: 'https://mainnet.boba.network',
    nativeCurrency: {
        name: 'ETH',
        decimals: 18,
        symbol: 'ETH',
    },
    blockExplorerUrl: 'https://blockexplorer.boba.network',
};
export const MOVR: ChainConfig = {
    name: 'Moonriver',
    shortName: 'MOVR',
    id: ethers.utils.hexlify(1285),
    numericId: 1285,
    rpc: 'https://rpc.api.moonriver.moonbeam.network',
    nativeCurrency: {
        name: 'MOVR',
        decimals: 18,
        symbol: 'MOVR',
    },
    blockExplorerUrl: 'https://moonriver.moonscan.io',
};
export const GLMR: ChainConfig = {
    name: 'Moonbeam',
    shortName: 'GLMR',
    evmChain: 'moonbeam',
    id: ethers.utils.hexlify(1284),
    numericId: 1284,
    rpc: 'https://rpc.api.moonbeam.network',
    nativeCurrency: {
        name: 'GLMR',
        decimals: 18,
        symbol: 'GLMR',
    },
    blockExplorerUrl: 'https://moonbeam.moonscan.io',
};
export const ONE: ChainConfig = {
    name: 'Harmony One',
    shortName: 'ONE',
    id: ethers.utils.hexlify(1666600000),
    numericId: 1666600000,
    rpc: 'https://api.harmony.one',
    nativeCurrency: {
        name: 'ONE',
        decimals: 18,
        symbol: 'ONE',
    },
    blockExplorerUrl: 'https://explorer.harmony.one',
};
export const GOERLI: ChainConfig = {
    name: 'Goerli Testnet',
    shortName: 'Goerli',
    id: ethers.utils.hexlify(5),
    numericId: 5,
    rpc: 'https://rpc.ankr.com/eth_goerli',
    nativeCurrency: {
        name: 'ETH',
        decimals: 18,
        symbol: 'ETH',
    },
    blockExplorerUrl: 'https://goerli.etherscan.io',
};
export const MOONBASE_ALPHA: ChainConfig = {
    name: 'Moonbase Alpha Tesnet',
    shortName: 'Moonbase',
    evmChain: 'moonbase',
    id: ethers.utils.hexlify(1287),
    numericId: 1287,
    rpc: 'https://moonbase-alpha.public.blastapi.io',
    nativeCurrency: {
        name: 'DEV',
        decimals: 18,
        symbol: 'DEV',
    },
    blockExplorerUrl: 'https://moonbase.moonscan.io',
};
export const FILECOIN_TESTNET: ChainConfig = {
    name: 'Filecoin Hyperspace Testnet',
    shortName: 'Filecoin Testnet',
    id: ethers.utils.hexlify(3141),
    numericId: 3141,
    rpc: 'https://rpc.ankr.com/filecoin_testnet',
    nativeCurrency: {
        name: 'tFIL',
        decimals: 18,
        symbol: 'tFIL',
    },
    blockExplorerUrl: 'https://filfox.info/en',
};
export const FANTOM_TESTNET: ChainConfig = {
    name: 'Fantom Testnet',
    shortName: 'Fantom Testnet',
    evmChain: 'fantom',
    id: ethers.utils.hexlify(4002),
    numericId: 4002,
    rpc: 'https://rpc.ankr.com/fantom_testnet',
    nativeCurrency: {
        name: 'FTM',
        decimals: 18,
        symbol: 'FTM',
    },
    blockExplorerUrl: 'https://testnet.ftmscan.com',
};