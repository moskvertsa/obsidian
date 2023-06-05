/**
 * @notice Class for managing relayed withdrawal transactions
 */

import { StaticJsonRpcProvider } from "./ethers";
import {
    FeeEstimateResponse,
    Provider,
    TokenInfoExtended,
    RelayResponse,
    TokenListResponse,
    WithdrawalInputs,
} from "components/models";

export class ObsidianApi {
    constructor(
        readonly baseUrl: string,
        readonly tokens: TokenInfoExtended[],
        readonly chainId: number,
        readonly nativeTokenMinSendAmount: string | undefined
    ) {}

    static async create(provider: Provider | StaticJsonRpcProvider) {
        // Get API URL based on chain ID
        const chainId = (await provider.getNetwork()).chainId;
        const baseUrl = "";

        let tokens = {
            65: [
                {
                    chainId: 1,
                    address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
                    decimals: 18,
                    symbol: "OKT",
                    name: "OKT",
                    logoURI: "https://s2.coinmarketcap.com/static/img/coins/200x200/8267.png",
                    minSendAmount: "21000000000000000",
                },
            ],
        };

        // Get list of tokens supported on this network
        // const response = await fetch(`${baseUrl}/tokens?chainId=${chainId}`);
        // const data = (await response.json()) as TokenListResponse;
        let nativeMinSend: string = "21000000000000000";

        // let tokens: TokenInfoExtended[];
        // if ("error" in data) {
        //     tokens = [];
        //     console.warn(`Could not fetch tokens from backend: ${data.error}`);
        // } else {
        //     tokens = data.tokens;
        //     nativeMinSend = data.nativeTokenMinSendAmount;
        // }

        // Return instance, using an empty array of tokens if we could not fetch them from
        // backend (i.e. only native token will be available to send)
        return new ObsidianApi(baseUrl, tokens[chainId], chainId, nativeMinSend);
    }

    async getFeeEstimate(tokenAddress: string) {
        const response = await fetch(`${this.baseUrl}/tokens/${tokenAddress}/estimate?chainId=${this.chainId}`);
        const data = (await response.json()) as FeeEstimateResponse;
        if ("error" in data) throw new Error(`Could not estimate fee: ${data.error}`);
        return data;
    }

    async relayWithdraw(tokenAddress: string, withdrawalInputs: WithdrawalInputs) {
        const body = JSON.stringify(withdrawalInputs);
        const headers = { "Content-Type": "application/json" };
        const url = `${this.baseUrl}/tokens/${tokenAddress}/relay?chainId=${this.chainId}`;
        const response = await fetch(url, { method: "POST", body, headers });
        const data = (await response.json()) as RelayResponse;
        if ("error" in data) throw new Error(`Could not relay withdraw: ${data.error}`);
        return data;
    }
}
