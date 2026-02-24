"use client";

import { ConnectButton } from "@midl/satoshi-kit";
import {
    useAddTxIntention,
    useFinalizeBTCTransaction,
    useSignIntention,
    useEVMAddress,
} from "@midl/executor-react";
import { useAddNetwork } from "@midl/react";
import { encodeFunctionData } from "viem";
import { FAUCET_ADDRESS } from "../config";
import { useState, useEffect } from "react";
import { usePublicClient } from "wagmi";

export default function FaucetPage() {
    const [status, setStatus] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const { addTxIntentionAsync } = useAddTxIntention();
    const { finalizeBTCTransactionAsync } = useFinalizeBTCTransaction();
    const { signIntentionAsync } = useSignIntention();
    const userEVMAddress = useEVMAddress();
    const publicClient = usePublicClient();
    const { addNetwork } = useAddNetwork();

    const faucetAbi = [{
        name: "claimAll",
        type: "function",
        stateMutability: "nonpayable",
        inputs: [],
        outputs: [],
    }];

    const handleClaimAll = async () => {
        setLoading(true);
        try {
            // Step 1: Add intention and AWAIT it
            setStatus("Preparing transaction...");
            const intention = await addTxIntentionAsync({
                reset: true,
                intention: {
                    evmTransaction: {
                        to: FAUCET_ADDRESS as `0x${string}`,
                        data: encodeFunctionData({
                            abi: faucetAbi,
                            functionName: "claimAll",
                            args: [],
                        }),
                    },
                },
            });

            // Step 2: Finalize BTC transaction and AWAIT it
            setStatus("Estimating fees...");
            const finalization = await finalizeBTCTransactionAsync();

            // Step 3: Sign intention (THIS triggers the Xverse popup!)
            setStatus("Sign the transaction in your wallet...");
            const signedEvmTx = await signIntentionAsync({
                intention,
                txId: finalization.tx.id,
            });

            // Step 4: Broadcast
            setStatus("Broadcasting transaction...");
            await publicClient?.sendBTCTransactions({
                serializedTransactions: [signedEvmTx as `0x${string}`],
                btcTransaction: finalization.tx.hex,
            });

            setStatus("Transaction submitted! Waiting for confirmation...");
            setTimeout(() => {
                setStatus("Claim successful! You received all 4 tokens.");
                setLoading(false);
                setTimeout(() => setStatus(null), 5000);
            }, 3000);

        } catch (err: any) {
            console.error("Claim error:", err);
            setStatus(`Error: ${err.message}`);
            setLoading(false);
            setTimeout(() => setStatus(null), 5000);
        }
    };

    return (
        <div className="min-h-screen px-6 py-12 flex flex-col items-center justify-center relative">

            {/* Minimalist absolute header */}
            <header className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-50">
                <div className="text-xl font-bold tracking-tight">MIDL Faucet</div>
                {/* 
                  Using direct relative class for stacking context guarantees 
                  the wallet popup won't be hidden behind complex DOM structures. 
                */}
                <div className="relative z-[9999]">
                    <ConnectButton />
                </div>
            </header>

            <main className="w-full max-w-md flex flex-col items-center text-center mt-20">
                <h1 className="text-4xl font-light mb-4 tracking-tighter">Claim Testnet Assets</h1>
                <p className="text-neutral-500 mb-12 text-sm max-w-[280px]">
                    Receive all supported tokens (mBTC, WETH, CET, USDC) in a single transaction.
                </p>

                <div className="w-full relative">
                    <button
                        onClick={handleClaimAll}
                        disabled={!mounted || loading || !userEVMAddress}
                        className="w-full py-4 text-base font-medium btn-minimal disabled:opacity-50"
                    >
                        {!mounted
                            ? "Connect wallet to claim"
                            : loading
                                ? "Processing..."
                                : !userEVMAddress
                                    ? "Connect wallet to claim"
                                    : "Claim All Faucets"
                        }
                    </button>
                    {status && (
                        <div className="mt-6 text-sm text-neutral-600 animate-pulse">
                            {status}
                        </div>
                    )}
                </div>

                {/* Network Helper */}
                <div className="mt-16 text-xs text-neutral-400">
                    Having trouble connecting Xverse?
                    <button
                        onClick={() => {
                            addNetwork({
                                connectorId: "xverse",
                                networkConfig: {
                                    name: "MIDL Regtest",
                                    network: "regtest",
                                    rpcUrl: "https://rpc.staging.midl.xyz",
                                    indexerUrl: "https://mempool.staging.midl.xyz",
                                }
                            });
                        }}
                        className="ml-2 underline hover:text-black transition-colors"
                    >
                        Add MIDL Regtest Network
                    </button>
                </div>
            </main>

        </div>
    );
}
