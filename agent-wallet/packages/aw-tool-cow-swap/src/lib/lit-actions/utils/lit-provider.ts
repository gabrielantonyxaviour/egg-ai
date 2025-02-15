import {
    createPublicClient,
    http,
    serializeTransaction,
    hashMessage,
    SignableMessage,
    Transaction,
    hexToBytes,
    keccak256,
    concat,
    toBytes,
    type Hex,
    type Hash,
} from 'viem';

export type RequestArguments = {
    readonly method: string;
    readonly params?: readonly unknown[] | object;
};

export type Eip1193Provider = {
    request: (args: RequestArguments) => Promise<unknown>;
};

export const createLitProvider = (rpcUrl: string, pkpPublicKey: string): Eip1193Provider => {
    const transport = http(rpcUrl);
    const publicClient = createPublicClient({
        transport
    });

    return {
        async request({ method, params }: RequestArguments): Promise<unknown> {
            const parameters = Array.isArray(params) ? params : [];

            switch (method) {
                case 'eth_signTypedData':
                case 'eth_signTypedData_v4': {
                    const [, typedData] = parameters as [string, string];
                    const parsedData = JSON.parse(typedData);

                    const sig = await Lit.Actions.signAndCombineEcdsa({
                        toSign: parsedData,
                        publicKey: pkpPublicKey.startsWith('0x') ? pkpPublicKey.slice(2) : pkpPublicKey,
                        sigName: 'litSignTypedData',
                        signWithEIP191: true
                    });

                    const signature = {
                        r: '0x' + JSON.parse(sig).r.substring(2),
                        s: '0x' + JSON.parse(sig).s,
                        v: JSON.parse(sig).v
                    };

                    return signature;
                }

                case 'eth_sendTransaction':
                case 'eth_signTransaction': {
                    const [tx] = parameters as [Transaction];

                    // Serialize the transaction
                    const serializedTx = serializeTransaction(tx);
                    const txHash = keccak256(serializedTx);

                    // Sign the transaction hash
                    const sig = await Lit.Actions.signAndCombineEcdsa({
                        toSign: hexToBytes(txHash),
                        publicKey: pkpPublicKey.startsWith('0x') ? pkpPublicKey.slice(2) : pkpPublicKey,
                        sigName: 'litSignTransaction'
                    });

                    const parsedSig = JSON.parse(sig);
                    const signature = {
                        r: ('0x' + parsedSig.r.substring(2)) as Hex,
                        s: ('0x' + parsedSig.s) as Hex,
                        yParity: parsedSig.v === 27 ? 0 : 1
                    };

                    // For eth_signTransaction, return the signed transaction
                    if (method === 'eth_signTransaction') {
                        const signedTx = serializeTransaction(tx, signature);
                        return signedTx;
                    }

                    // For eth_sendTransaction, send the signed transaction
                    return await Lit.Actions.runOnce(
                        { waitForResponse: true, name: 'txnSender' },
                        async () => {
                            try {
                                const signedTx = serializeTransaction(tx, signature);
                                const hash = await publicClient.request({
                                    method: 'eth_sendRawTransaction',
                                    params: [signedTx as Hex]
                                }) as Hash;
                                console.log('Transaction sent:', hash);
                                return hash;
                            } catch (error) {
                                console.error('Error broadcasting transaction:', error);
                                throw error;
                            }
                        }
                    );
                }

                case 'eth_sign':
                case 'personal_sign': {
                    const [, message] = parameters as [string, SignableMessage];
                    const messageHash = hashMessage(message);

                    const sig = await Lit.Actions.signAndCombineEcdsa({
                        toSign: hexToBytes(messageHash),
                        publicKey: pkpPublicKey.startsWith('0x') ? pkpPublicKey.slice(2) : pkpPublicKey,
                        sigName: 'litSignMessage'
                    });

                    const parsedSig = JSON.parse(sig);
                    // Return the concatenated signature for eth_sign
                    return concat([
                        ('0x' + parsedSig.r.substring(2)) as Hex,
                        ('0x' + parsedSig.s) as Hex,
                        toBytes(parsedSig.v)
                    ]);
                }

                default:
                    // Cast the method and params to any to bypass viem's strict typing
                    return (publicClient as any).request({
                        method: method as any,
                        params: parameters
                    });
            }
        }
    };
};