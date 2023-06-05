import { BigNumber } from "src/utils/ethers";
import { JsonRpcSigner, Web3Provider } from "src/utils/ethers";
import type { TokenList, TokenInfo } from "@uniswap/token-lists/dist/types";
import { ObsidianLogger } from "components/logger";
import { ETH_NETWORK_LOGO } from "src/utils/constants";

export type { TokenList, TokenInfo } from "@uniswap/token-lists/dist/types";
export { BigNumber } from "src/utils/ethers";
export type { Network, TransactionResponse } from "src/utils/ethers";
export type Signer = JsonRpcSigner;
export type Provider = Web3Provider;

export const NATIVE_TOKEN_ADDRESS = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";

export interface MulticallResponse {
    blockNumber: BigNumber;
    returnData: string[];
}

// Spec: https://eips.ethereum.org/EIPS/eip-3085#specification
export type Chain = {
    chainId: string;
    chainName: string;
    nativeCurrency: {
        // The address and logoURI fields are not part of the EIP-3085 spec but are added to make this field
        // compatible with type TokenInfo
        address: typeof NATIVE_TOKEN_ADDRESS;
        name: string;
        symbol: string;
        decimals: 18;
        logoURI: string;
    };
    rpcUrls: string[];
    blockExplorerUrls?: string[];
    iconUrls?: string[];
    // logoURI is not part of EIP-3085, but is added for convenience because that is what our BaseSelect component
    // uses to display images form the chain objects it recevies. It's not required because we always want a chain
    // logo to be showin in the network selector dropdown
    logoURI?: string; // Must be optional so it can be deleted before calling `wallet_addEthereumChain`.
};

export const supportedChains: Array<Chain> = [
    {
        chainId: `0x${Number(16).toString(16)}`,
        chainName: "OKExChain Testnet",
        nativeCurrency: {
            address: NATIVE_TOKEN_ADDRESS,
            name: "OKT",
            symbol: "OKT",
            decimals: 18,
            logoURI: "https://s2.coinmarketcap.com/static/img/coins/200x200/8267.png",
        },
        rpcUrls: ["https://exchaintestrpc.okex.org"],
        blockExplorerUrls: ["https://www.oklink.com/okexchain-test"],
        iconUrls: ["https://s2.coinmarketcap.com/static/img/coins/200x200/8267.png"],
        logoURI: "https://s2.coinmarketcap.com/static/img/coins/200x200/8267.png",
    },
];

// Set comprised of intersection of Chain IDs present for all contracts in src/contracts, supported by sdk, and by relayer
export type SupportedChainId = "65" // strings for indexing into JSON files
export const supportedChainIds = supportedChains.map((chain) => Number(chain.chainId)); // numbers for verifying the chainId user is connected to

// CNS names owned by wallet are queried from The Graph, so these types help parse the response
type CnsName = { name: string };
export interface CnsQueryResponse {
    data: {
        domains: CnsName[];
    };
}

// Relayer types
export type ApiError = { error: string };
export interface TokenInfoExtended extends TokenInfo {
    minSendAmount: string;
}
// Omit the TokenList.tokens type so we can override it with our own.
export interface TokenListSuccessResponse extends Omit<TokenList, "tokens"> {
    nativeTokenMinSendAmount: string;
    tokens: TokenInfoExtended[];
}
export type TokenListResponse = TokenListSuccessResponse | ApiError;
export type FeeEstimate = { fee: string; token: TokenInfo };
export type FeeEstimateResponse = FeeEstimate | ApiError;
export type WithdrawalInputs = {
    stealthAddr: string;
    acceptor: string;
    signature: string;
    sponsorFee: string;
};
export type RelayResponse = { relayTransactionHash: string } | ApiError;

export type SendTableMetadataRow = {
    dateSent: string;
    dateSentUnix: number;
    dateSentTime: string;
    amount: string;
    address: string;
    addressShortened: string;
    hash: string;
    tokenLogo?: string;
    tokenAddress: string;
    tokenSymbol: string;
};

// Logger type added to window
declare global {
    interface Window {
        logger: ObsidianLogger;
    }
}

export type Language = { label: string; value: string };
