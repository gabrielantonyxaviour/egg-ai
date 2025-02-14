import { ethers } from 'ethers'; // Import ethers
import LitJsSdk from '@lit-protocol/lit-node-client';
import { LIT_NETWORK, LIT_ABILITY } from '@lit-protocol/constants';
import {
    LitActionResource,
    createSiweMessage,
    generateAuthSig,
} from "@lit-protocol/auth-helpers";

import dotenv from 'dotenv';
dotenv.config();
const _litActionCode = async () => {
    console.log(magicNumber);
    try {
        LitActions.setResponse({ response: JSON.stringify({ message: "Hello from Lit Protocol!" }) });
    } catch (error) {
        LitActions.setResponse({ response: error.message });
    }
};

const litActionCode = `(${_litActionCode.toString()})();`;


const litNodeClient = new LitJsSdk.LitNodeClient({
    alertWhenUnauthorized: false,
    litNetwork: LIT_NETWORK.DatilDev,
    debug: false,
});

await litNodeClient.connect();
console.log("Connected to Lit Network");

const privateKey = process.env.EVM_PRIVATE_KEY;
const ethersWallet = new ethers.Wallet(privateKey);
console.log("Wallet Address:", ethersWallet.address);

const sessionSignatures = await litNodeClient.getSessionSigs({
    chain: "ethereum",
    expiration: new Date(Date.now() + 1000 * 60 * 10).toISOString(), // 10 minutes
    resourceAbilityRequests: [
        {
            resource: new LitActionResource("*"),
            ability: LIT_ABILITY.LitActionExecution,
        },
    ],
    authNeededCallback: async ({
        uri,
        expiration,
        resourceAbilityRequests,
    }) => {
        const toSign = await createSiweMessage({
            uri,
            expiration,
            resources: resourceAbilityRequests,
            walletAddress: ethersWallet.address,
            nonce: await litNodeClient.getLatestBlockhash(),
            litNodeClient,
        });

        return await generateAuthSig({
            signer: ethersWallet,
            toSign,
        });
    },
});

// Execute the Lit Action
const response = await litNodeClient.executeJs({
    sessionSigs: sessionSignatures,
    code: litActionCode,
    jsParams: {
        magicNumber: 43, // Example parameter
    },
});

console.log("Lit Action Response:", response);
