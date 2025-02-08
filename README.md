# Egg AI

**Autonomous and specialized AI agent that helps you "follow trade" trade analysts**  
_AI that does DYOR for you_

![image](https://github.com/user-attachments/assets/59ee468f-c2e3-4370-96db-d5774e472fab)

## 🎯 Pitch
> *A button that prints you money*  
> *NFA DYOR - AI agent that does that for you*

## 🥚 What is Egg AI?
Egg AI is an AI solution that allows users to follow top crypto traders ("chefs") autonomously with the safety of AI-powered analysis. Instead of blindly copying trades or trying to do your own research, our AI checks each trade call from trusted chefs, analyzes the market, and executes trades based on your preferences.

We've built two ways to trade, letting you choose how much control you want:

### 🔥 Tren Egg Mode
Click a button to print money:
- No trading experience needed
- Bot auto follows trades posted by verified chefs
- AI takes care of risks, goals, and preferences
- Perfect if you're busy but want to follow top trades

![image](https://github.com/user-attachments/assets/848c9dd4-de60-46c4-b219-f768bf002144)

### 🏆 Chad Egg Mode
For traders who want more control:
- Pick which chefs to follow
- Set your own confidence levels
- AI still does the DYOR for you
- Customize your risk and profit targets
- Pay for premium chef signals if you want (future feature)

![image](https://github.com/user-attachments/assets/100c3f50-16bf-41e6-89c5-6784bff96148)

## 🤖 What It Does
Our AI analyzes each trade call by looking at:
- Risk vs reward potential
- Market conditions and trends
- Chef's past performance and reputation
- Social sentiment from X, TikTok, and Instagram
- How much of your funds to put in

## 🛠 How It's Made
Egg AI is built to make copy trading smarter and safer using these key components:

### 🔧 Technical Setup
- **Networks**: Built on Arbitrum and Avalanche. Trades on GMX (Decentralized Perpetual Exchange)
- **Wallet Security**: Lit Protocol for wallet generation and secure trade execution
- **AI Agent Kit**: Collab.Land Agent Kit to build autonomous AI agents
- **Deployment**: Autonome to deploy specific customized AI agents for each user
- **AI Provider**: Gaia as our AI provider running Qwen 7B parameter model
- **RAG Engine**: Supavec to generate powerful AI embeddings on technical crypto trading resources
- **Market Sentiment**: Cookie.Fun for X sentiment on the trade, TokenHunterZoro for TikTok mentions

## ⚙️ Trade Analysis Flow
This is where the magic happens. When a chef posts a trade:

### 1️⃣ **Analysis**
- AI grabs the complete trade details (historic price, liquidity, trade volume, 7-day candlestick, etc.)
- Performs a market sentiment study (Cookie.Fun and TokenHunterZoro)
- Considers the chef's track record (average PnL% achieved in past trades)
- Gives analyzed risk/reward scores (with embeddings from Supavec and response from Gaia)

```json
{
  "risktoreward": number;      // How much you could make vs lose
  "longtermscore": number;     // Where the market's heading
  "marketstrength": number;    // How the market's doing now
  "chefreputation": number;    // How good the trader is
  "equitypercent": number;   // How much to put in
  "explanation": string;   
}
```

### 2️⃣ **Execution**
- Adjusts position size based on user confidence in chefs
- Signs the transaction to place the trade using Lit
- Manages entry and exit automatically

## 🔥 Smart Bits We're Proud Of

### 🎯 Trade Scoring
We built a scoring system that looks at:
- Profit vs loss potential
- Market trend strength
- Current market conditions
- Chef's reputation and success rate
- Suggested position size

### 🤖 Auto-Trading Logic
- **High chef confidence + decent AI score** → Trade goes through
- **Low chef confidence + high AI score** → Trade goes through
- **High chef confidence + high AI score** → Might increase position size
- Adjusts automatically for Tren/Chad mode users

### 🤝 Custom AI Agents
Using Autonome, each user gets their own AI agent that:
- Learns their risk tolerance
- Tracks which chefs work best for them
- Adjusts strategy based on their portfolio size

The coolest part? Whether you're in **Tren Mode** letting the AI handle everything, or **Chad Mode** picking your own chefs and confidence levels, the system constantly checks and balances both the chef's calls and market conditions to keep your trades safe.

## 🔗 Important Links

**Live URL**: https://egg-ai.vercel.app/

**Pitch Deck**: https://www.canva.com/design/DAGebCcYds4/wUMbyP9W89DYiCpGaO78LA/view?utm_content=DAGebCcYds4&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h1b63e6233e

**Demo Video**: https://www.canva.com/design/DAGecEPLC6w/BsoYkan_aBuP0UF4vRYwHA/watch?utm_content=DAGecEPLC6w&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=had0fe8cb19

**Project Dashboard**: https://ethglobal.com/showcase/egg-ai-atkir

**Follow on X**: https://x.com/egg_ai_agent

