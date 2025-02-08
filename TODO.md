Product Name
Egg AI

Pitch

a button that prints you money
nfa dyor - ai agent that does that for you

Target Sponsors

1. Arbitrum
2. Gaia and Collab land
3. Lit 
4. Autonome

Tech

1. Supported chains: Arbitrum, Avalanche
2. Lit protocol for wallet
3. Cookie.fun Twitter sentiment
3. TokenHunterZoro TikTok Sentiment
4. Gaia to build specialized AI
5. Collab.land AI agent Starter kit
6. Supavec for RAG inference
7. Autonome for custom user specific AI agent deployments

An autonomous AI agent that lets you click a button to print money.  

Egg AI is a specialized AI agent that has the knowledge to perform advanced market and trade pattern analytics. Egg AI is upto date with realtime market data, market sentiment and social sentiment from sources like X, TikTok and Instagram. 

Users can choose two modes to run the application:
1. TREN EGG
2. CHAD EGG

TREN EGG
This mode lets users to just click a button and start making money. The user doesn't have to manage risks, set limits or any configurations. Everything is run on auto pilot with the help of AI.
Pros:
No trading experience and financial knowledege required
Cons:
Higher profit fee cuts, no control over what decision the AI makes.

CHAD EGG
This mode lets users to choose a trade analyst (a.k.a chef) to follow trade with custom confidence levels. Follow trading is the method of performing a trade play as shared by a chef with the help of AI. The AI agent does the DYOR for you and decides to play the trade or not.  If you followed a chef with high confidence, the trade play will be made even if the AI agent has relatively lower confidence after it did its research and if you followed the chef with low confidence, the trade play will be performed only if the AI agent has high confidence after its research. The users need to strike a balance in the confidence level based on their trust. This mode also allows users to set custom risk meters and profits goals (wen lambo) in a time frame. 
Pros:
More control over the AI decision making. Lower profit fees and higher gains
Cons: 
Needs financial knowledege and some research to find good and reliable chefs. Might need to pay to get access to chefs trade calls. 

Just started building this project. Any suggestions/support would mean a lot

Follow on X | https://x.com/egg_ai_agent


1. Gather resources for trades and train the AI and get a list of file ids
2. Finish fe
3. Configure /commands see how everything is
4. Make the AI return trade patterns
5. Improve trade analytics


AI's decision making

In the first step as soon as any play is posted by any chef, I want the AI to do a basic analysis score with a response something like riskToReward, longTermScore, marketStrength, chefReputation, equityPercent(ai suggested percent of total equity that could be invested into this play) Can you suggest me one more score?

Trades should be performed for all followers of the Chef based on the follow confidence, if the metrics are not too favourable but the confidence is high, the trade should go through. if the metrics are favourable but the confidence is low, trade should go through. Come up with a ts function that does this check. as per the equityPercent. If the confidence is too high and the ai score is also high, the ai can slightly increase the equity when performing the trade. but if the confidence is too low and the ai score is high, the equity can be reduced slightly.

After CHAD users, all TREN wallets will make the trade as per the equity percent. There should be threshold for that.


Caller profile

8. Name 
9. Image
10. bio
11. Sub cost
12. avg PNL %
13. Avg Calls per day
14. Total subs
15. Socials links
16. Categories
	1. Spot
	2. Futures
	3. Memecoins


User profile


1. balance
2. PNL %
3. View all trades
4. Chefs
	1. if tren, dont show anything
	2. if chad, show a list of follows with confidence
	3. if chad, show browse button
5. if chad, show a risk meter and wen lambo meter.

Browse page

6. list of callers

navbar 
7. Register chef button

AIl actions
8. As soon as a cook posts trade 
	1. do a complete market research and come up with confidence and risk percentage (AI)
	2. Get all subscribers (CHAD)
		1. make trade based on confidence. if done, send notifs on telegram
	3. Get all remaining (TREN)
		2. Just make trades if the confidence level is good and reputation is good, send notifs on telegram
	4. As soon as the close signal triggers
		2. sell on all accounts with position
		3. validate pnl (AI)
		4. store the records

Trading bot interface

9. /start
	1. connect to app with telegram
	2. once connected, generates a wallet and stores in backend
10. /home
	1. Show wallet address and current balance
		1. ETH on arb
		2. SEI
		3. SOL
	2. Buttons
		1. Withdraw
		2. View Trades
		3. Positions
		4. Pause
		5. Green Ball Red ball (TREN and CHAD) 
		6. x Close on bottom

TODO

11. Sign in flow full testing - DONE
12. Landing page aka profile page

FRONTEND BOXES

1. Profile - FULLY DONE
	1. Pause trading
	2. Refresh prices
	3. Save changes
2. Actions - UI DONE
	- DATA - TODO LATER
3. Mode - FULLY DONE
4. Chefs - TODO LATER
5. Chef - FULLY DONE
6. Trade - TODO LATER

For Chef
1. Create Chef - DONE
2. Profile - DONE
3. Recipes - DONE
4. Create - DONE

Looking to go long BTC at this level (95279) lots of confluence here so looking for a bounce (VAL, golden pocket, 4H OB)

Also setting limit orders for this ONDO long. Entries @ 1.263, 1.177, 4H close under 1.11 for stops, TPs in yellow

Time Left - 14 hours

Transactions testing - 3 hours

1. GMX calls testing
	1. Create Position
	2. Take profits
	3. Withdraw position

Preparing AI data - 5 hours

1. Trading PDF resources and creating embeddings
2. Testing Cookie.fun sentiment, (Twitter Search by Eliza, Tiktok by TokenHunterZorom)
3. Test Fetching current market data from GMX APIs
4. Structure everything into a prompt

AI Testing - 2 hours

1. Test the pipeline, get inferences.

Frontend final integrations - 2 hours

Telegram Integration - 4 hours
