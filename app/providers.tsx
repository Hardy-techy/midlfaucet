"use client";

import { MidlProvider } from "@midl/react";
import { SatoshiKitProvider } from "@midl/satoshi-kit";
import { QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { midlConfig, wagmiConfig, queryClient } from "../config";
import "@midl/satoshi-kit/styles.css";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <WagmiProvider config={wagmiConfig}>
            <MidlProvider config={midlConfig}>
                <QueryClientProvider client={queryClient}>
                    <SatoshiKitProvider config={midlConfig}>
                        {children}
                    </SatoshiKitProvider>
                </QueryClientProvider>
            </MidlProvider>
        </WagmiProvider>
    );
}
