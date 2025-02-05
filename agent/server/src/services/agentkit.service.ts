import {
    AgentKit,
    CdpWalletProvider,
    wethActionProvider,
    walletActionProvider,
    erc20ActionProvider,
    cdpApiActionProvider,
    cdpWalletActionProvider,
    pythActionProvider,
} from "@coinbase/agentkit";
import { getLangChainTools } from "@coinbase/agentkit-langchain";
import { HumanMessage } from "@langchain/core/messages";
import { MemorySaver } from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";
import { createReactAgent } from "@langchain/langgraph/prebuilt";

export class AgentKitService {
    private agent: any;
    private config: any;
    private memory: MemorySaver;
    private llm: any;
    constructor() {
        this.memory = new MemorySaver();
        // Initialize LLM
        this.llm = new ChatOpenAI({
            model: "qwen-2.5-coder-0.5b",

            configuration: {
                baseURL: process.env.GAIANET_SERVER_URL,

            }
        })
    }



    async initialize() {
        try {

            // Configure CDP Wallet Provider
            const config = {
                apiKeyName: process.env.CDP_API_KEY_NAME,
                apiKeyPrivateKey: process.env.CDP_API_KEY_PRIVATE_KEY?.replace(/\\n/g, "\n"),
                networkId: process.env.CDP_AGENT_KIT_NETWORK || "base-sepolia",
            };

            const walletProvider = await CdpWalletProvider.configure(config);

            // Initialize AgentKit with trading-focused tools
            const agentkit = await AgentKit.from({
                walletProvider,
                actionProviders: [
                    wethActionProvider(),
                    pythActionProvider(), // For price feeds
                    walletActionProvider(),
                    erc20ActionProvider(),
                    cdpApiActionProvider(config),
                    cdpWalletActionProvider(config),
                ],
            });

            const tools = await getLangChainTools(agentkit);

            // Create React Agent with trading-focused prompt
            this.agent = createReactAgent({
                llm,
                tools,
                checkpointSaver: this.memory,
                messageModifier: `
            You are a helpful trading assistant that guides beginners through crypto trading using 
            Coinbase Developer Platform. Your goal is to:
            1. Help users understand basic trading concepts
            2. Guide them through their first trades safely
            3. Explain fees and risks clearly
            4. Check wallet balances and market prices before suggesting actions
            5. Always prioritize user safety and risk management
            
            If you encounter a 5XX error, ask the user to try again later. 
            If someone asks for functionality you don't have, direct them to docs.cdp.coinbase.com.
            Be concise and clear in your responses, avoiding technical jargon when possible.
          `,
            });

            this.config = { configurable: { thread_id: "Trading Assistant" } };

            console.log("Trading agent initialized successfully");
        } catch (error) {
            console.error("Failed to initialize trading agent:", error);
            throw error;
        }
    }

    async handleMessage(message: string) {
        try {
            const stream = await this.agent.stream(
                { messages: [new HumanMessage(message)] },
                this.config
            );

            let response = '';
            for await (const chunk of stream) {
                if ("agent" in chunk) {
                    response += chunk.agent.messages[0].content;
                } else if ("tools" in chunk) {
                    response += chunk.tools.messages[0].content;
                }
            }

            return response;

        } catch (error) {
            console.error("Error processing message:", error);
            throw error;
        }
    }

    async stop() {
        // Cleanup if needed
        this.memory.clear();
    }
}