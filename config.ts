import { createMidlConfig } from "@midl/satoshi-kit";
import { regtest, type Config } from "@midl/core";
import { xverseConnector } from "@midl/connectors";
import { midlRegtest } from "@midl/executor";
import { createConfig, http } from "wagmi";
import { QueryClient } from "@tanstack/react-query";

export const midlConfig = createMidlConfig({
    networks: [regtest],
    persist: true,
    connectors: [xverseConnector()],
}) as Config;

export const wagmiConfig = createConfig({
    chains: [midlRegtest],
    transports: {
        [midlRegtest.id]: http("https://rpc.staging.midl.xyz"),
    },
});

export const queryClient = new QueryClient();

export const TOKENS = {
    mBTC: { address: "0x1fA703E141D123d00074f28462e52aE32C0D38a2", decimals: 18, limit: "0.0004" },
    WETH: { address: "0x9546aBfA05DDd78C9ed3a5b9298973EC78bB6A92", decimals: 18, limit: "0.006" },
    CET: { address: "0x9a40f4D1661EEfb4192Eeb5186d3c245F06a1819", decimals: 18, limit: "0.033" },
    USDC: { address: "0xc45c716f69879340Ee813BbaA388f8d62b1871d0", decimals: 6, limit: "20" },
};

export const FAUCET_ADDRESS = "0x5902e7b0CD4a56bFEcC0610a13BBe1704e21Ff2e";
