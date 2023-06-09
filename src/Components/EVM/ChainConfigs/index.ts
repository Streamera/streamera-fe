import { ChainConfig } from "./types";
import { ethers } from 'ethers';

// chains
export const BSC_TEST: ChainConfig = {
    name: 'BSC',
    shortName: 'BSC',
    id: ethers.utils.hexlify(97).replace(/^0x0/, '0x'), // hexlify likes to change it to 0x0
    numericId: 97,
    evmChain: 'binance',
    rpc: 'https://data-seed-prebsc-2-s1.binance.org:8545',
    nativeCurrency: {
        name: 'BNB',
        decimals: 18,
        symbol: 'BNB',
    },
    blockExplorerUrl: 'https://testnet.bscscan.com',
    streameraAddress: '0x4Ba37A262e36035580ff6D9B42165bd0d59AFf12',
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
    streameraAddress: '0x6C90F4745949fd9A2ab2ca8093e169b8C87455C9',
    dexAddress: "0x8954AfA98594b838bda56FE4C12a09D7739D179b",
    nativeTokenAddress: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    wrappedNativeTokenAddress: '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889',
};
export const AVAX_TEST: ChainConfig = {
    name: 'Avalanche Testnet',
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
    streameraAddress: '0xA1307D7c6E53bB9fF0f6B7fc95ec213dE1A6440d',
    dexAddress: "0xE54Ca86531e17Ef3616d22Ca28b0D458b6C89106",
    nativeTokenAddress: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    wrappedNativeTokenAddress: '0xd00ae08403B9bbb9124bB305C09058E32C39A48c',
};
export const ETH: ChainConfig = {
    name: 'Ethereum',
    shortName: 'ETH',
    evmChain: 'ethereum',
    id: ethers.utils.hexlify(1).replace(/^0x0/, '0x'), // hexlify likes to change it to 0x0
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
    id: ethers.utils.hexlify(56).replace(/^0x0/, '0x'), // hexlify likes to change it to 0x0
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
    id: ethers.utils.hexlify(137).replace(/^0x0/, '0x'), // hexlify likes to change it to 0x0
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
    id: ethers.utils.hexlify(42161).replace(/^0x0/, '0x'), // hexlify likes to change it to 0x0
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
    name: 'Arbitrum',
    shortName: 'ARB',
    evmChain: 'arbitrium',
    id: ethers.utils.hexlify(421613).replace(/^0x0/, '0x'), // hexlify likes to change it to 0x0
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
    id: ethers.utils.hexlify(10).replace(/^0x0/, '0x'), // hexlify likes to change it to 0x0
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
    id: ethers.utils.hexlify(25).replace(/^0x0/, '0x'), // hexlify likes to change it to 0x0
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
    id: ethers.utils.hexlify(250).replace(/^0x0/, '0x'), // hexlify likes to change it to 0x0
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
    id: ethers.utils.hexlify(8217).replace(/^0x0/, '0x'), // hexlify likes to change it to 0x0
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
    id: ethers.utils.hexlify(2222).replace(/^0x0/, '0x'), // hexlify likes to change it to 0x0
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
    id: ethers.utils.hexlify(100).replace(/^0x0/, '0x'), // hexlify likes to change it to 0x0
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
    id: ethers.utils.hexlify(1313161554).replace(/^0x0/, '0x'), // hexlify likes to change it to 0x0
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
    id: ethers.utils.hexlify(128).replace(/^0x0/, '0x'), // hexlify likes to change it to 0x0
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
    id: ethers.utils.hexlify(32659).replace(/^0x0/, '0x'), // hexlify likes to change it to 0x0
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
    id: ethers.utils.hexlify(42220).replace(/^0x0/, '0x'), // hexlify likes to change it to 0x0
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
    name: 'Celo',
    shortName: 'CELO',
    id: ethers.utils.hexlify(44787).replace(/^0x0/, '0x'), // hexlify likes to change it to 0x0
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
    id: ethers.utils.hexlify(9001).replace(/^0x0/, '0x'), // hexlify likes to change it to 0x0
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
    id: ethers.utils.hexlify(2000).replace(/^0x0/, '0x'), // hexlify likes to change it to 0x0
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
    id: ethers.utils.hexlify(66).replace(/^0x0/, '0x'), // hexlify likes to change it to 0x0
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
    id: ethers.utils.hexlify(288).replace(/^0x0/, '0x'), // hexlify likes to change it to 0x0
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
    id: ethers.utils.hexlify(1285).replace(/^0x0/, '0x'), // hexlify likes to change it to 0x0
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
    id: ethers.utils.hexlify(1284).replace(/^0x0/, '0x'), // hexlify likes to change it to 0x0
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
    id: ethers.utils.hexlify(1666600000).replace(/^0x0/, '0x'), // hexlify likes to change it to 0x0
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
    name: 'Goerli',
    shortName: 'Goerli',
    id: ethers.utils.hexlify(5).replace(/^0x0/, '0x'), // hexlify likes to change it to 0x0
    numericId: 5,
    rpc: 'https://rpc.ankr.com/eth_goerli',
    nativeCurrency: {
        name: 'ETH',
        decimals: 18,
        symbol: 'ETH',
    },
    blockExplorerUrl: 'https://goerli.etherscan.io',
    streameraAddress: '0xBB53016f9811c8A9A42f145E4d9f1f412915ddb7',
    dexAddress: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
    nativeTokenAddress: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    wrappedNativeTokenAddress: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
};
export const MOONBASE_ALPHA: ChainConfig = {
    name: 'Moonbase',
    shortName: 'Moonbase',
    evmChain: 'moonbase',
    id: ethers.utils.hexlify(1287).replace(/^0x0/, '0x'), // hexlify likes to change it to 0x0
    numericId: 1287,
    rpc: 'https://moonbase-alpha.public.blastapi.io',
    nativeCurrency: {
        name: 'DEV',
        decimals: 18,
        symbol: 'DEV',
    },
    blockExplorerUrl: 'https://moonbase.moonscan.io',
    streameraAddress: '0x2eAF665bd8ab31DbFB303C37f20D2fab27251b1C',
    dexAddress: "0x2d4e873f9Ab279da9f1bb2c532d4F06f67755b77",
    nativeTokenAddress: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    wrappedNativeTokenAddress: '0x372d0695E75563D9180F8CE31c9924D7e8aaac47',
};
export const FILECOIN_TESTNET: ChainConfig = {
    name: 'Filecoin',
    shortName: 'Filecoin Testnet',
    id: ethers.utils.hexlify(3141).replace(/^0x0/, '0x'), // hexlify likes to change it to 0x0
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
    name: 'Fantom',
    shortName: 'Fantom Testnet',
    evmChain: 'fantom',
    id: ethers.utils.hexlify(4002).replace(/^0x0/, '0x'), // hexlify likes to change it to 0x0
    numericId: 4002,
    rpc: 'https://rpc.ankr.com/fantom_testnet',
    nativeCurrency: {
        name: 'FTM',
        decimals: 18,
        symbol: 'FTM',
    },
    blockExplorerUrl: 'https://testnet.ftmscan.com',
    streameraAddress: '0xE1008caB93DF9c6363F0A7fE5dEe2b19cd8639bB',
    dexAddress: "0xa6AD18C2aC47803E193F75c3677b14BF19B94883",
    nativeTokenAddress: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    wrappedNativeTokenAddress: '0xf1277d1Ed8AD466beddF92ef448A132661956621',
};