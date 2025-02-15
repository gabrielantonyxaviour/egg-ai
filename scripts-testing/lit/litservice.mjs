import {
    Delegatee as AwDelegatee,
    AwSignerError,
    AwSignerErrorType,
    LitNetwork,
} from '@lit-protocol/agent-wallet';

export class LitService {
    static instance = null;
    awDelegatee = null;
    intentMatcher = null;

    /**
     * Private constructor for the LitService class.
     * @param awDelegatee - An instance of the `AwDelegatee` class.
     */
    constructor(awDelegatee) {
        this.awDelegatee = awDelegatee;
    }

    /**
     * Creates an instance of the `AwDelegatee` class.
     * Handles errors related to missing private keys or insufficient balances by prompting the user for input.
     *
     * @param litNetwork - The Lit network to use for the LitService role.
     * @param privateKey - Optional. The private key for the LitService role.
     * @returns A promise that resolves to an instance of the `AwDelegatee` class.
     * @throws If initialization fails, the function logs an error and exits the process.
     */
    static async createAwDelegatee(litNetwork, privateKey) {
        let awDelegatee;
        try {
            // Attempt to create the AwDelegatee instance.
            awDelegatee = await AwDelegatee.create(privateKey, { litNetwork });
        } catch (error) {
            // Handle specific errors related to missing private keys or insufficient balances.
            if (error instanceof AwSignerError) {
                if (error.type === AwSignerErrorType.INSUFFICIENT_BALANCE_CAPACITY_CREDIT_MINT) {
                    console.log('Insufficient balance');
                }
            }

            // Log any other errors and exit the process.
            console.error('Failed to initialize LitService role', error);
            throw error;
        }

        return awDelegatee;
    }

    static async getInstance() {
        if (!LitService.instance) {
            const awDelegatee = await LitService.createAwDelegatee(
                'datil-dev',
                process.env.AI_AGENT_PRIVATE_KEY || ""
            );
            LitService.instance = new LitService(awDelegatee);
        }
        return LitService.instance;
    }

    setIntentMatcher(intentMatcher) {
        this.intentMatcher = intentMatcher;
    }

    async start() {
    }

    async stop() {
        this.awDelegatee.disconnect();
    }
}
