import Safe from "@safe-global/protocol-kit";
import { Transaction } from "@safe-global/types-kit";

/**
 * Creates the transaction object to initalize a safe.
 * @param {string} pkpAddress - The pkp address
 * @param {string} signer - The additional signer of the safe
 * @param {string} chainId - The chain Id to create the safe on
 * @returns {Promise<any>} The estimated gas limit.
 */
export const createSafeTx = async (provider: any, pkpAddress: string, saltNonce: string, signer: string): Promise<{ address: string, tx: Transaction }> => {
    const protocolKit = await Safe.init({
        provider,
        predictedSafe: {
            safeAccountConfig: {
                owners: [pkpAddress, signer],
                threshold: 1,
            },
            safeDeploymentConfig: {
                saltNonce,
            },
        },
    });

    const safeAddress = await protocolKit.getAddress();

    const createTx = await protocolKit.createSafeDeploymentTransaction();

    return { address: safeAddress, tx: createTx };
};
