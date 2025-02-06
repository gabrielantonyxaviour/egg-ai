Target Sponsors

1. Arbitrum
2. Gaia and Collab land
3. Lit or Nillion 
4. TheGraph


Pitch

a button that prints you money
nfa dyor - ai agent that does that for you

Target Achievements

1. Started a community in collab.land
2. Partnership with Neil. 
3. 4 PRs to Gaia and Collab.land
4. 50 followers on X

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

6. TREN EGG
	1. First fetch all cooks latest calls
	2. take the first one, and the next and so 
		1. get complete market data for it using birdeye for memecoins. coinmarketcap for regular coins with birdeye. Every thing necessray to visualize a chart 
		2. make an X search, get Tiktok data, get instagram data, get cookie data for the ticker 
		3. Get the chefs call and all this data and structure it for a prompt with pulled data from the embedding.
		4. AI should return confidence score and risk score. 
7. CHAD EGG
	1. 


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

1. Profile -
2. Actions
3. Mode
4. Chefs
5. Chef
6. Trade

For Chef
1. Profile
2. Recipes
3. Create