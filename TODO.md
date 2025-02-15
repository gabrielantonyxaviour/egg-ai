
Target Sponsors

1. Arbitrum 
2. Gaia and Collab land 
3. Privy 
4. Autonome

Tech

1. Supported chains: Arbitrum, Avalanche
2. Privy for wallet
3. Cookie.fun Twitter sentiment
3. TokenHunterZoro TikTok Sentiment
4. Gaia to build specialized AI
5. Collab.land AI agent Starter kit
6. Supavec for RAG inference
7. Autonome for custom user specific AI agent deployments


1. Gather resources for trades and train the AI and get a list of file ids - DONE
2. Finish fe - DONE
3. Configure /commands see how everything is
4. Make the AI return trade patterns - DONE
5. Improve trade analytics


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
12. Landing page aka profilepage

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

Time Left - 7 hours
Work - 10 hours
1. Recrod Pitch Demo - 1 hour


1. make responsive


## Docker clean up commands

docker stop $(docker ps -a -q)
docker rm $(docker ps -a -q)
docker system prune -a  # This will remove all unused images, containers, networks and volumes
docker builder prune    # This will clean up build cache

rm -rf node_modules
rm -rf */node_modules
rm -rf .pnpm-store

docker buildx build --platform=linux/amd64  -t eggai/eggai-chick . 

## FINAL SPRINT


3. Display the deployed ai agent url on ayutonome in ui
5. chat bot ui for the users integrated with chick ai agent.
9. Recpord demo
10. Submit demo
11. Make responsive
12. Call pappa
13. Meet romario

0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14,0x0625aFB445C3B6B7B929342a04A22599fd5dBB59,0xbe72E441BF55620febc26715db68d3494213D8Cb,0x58Eb19eF91e8A6327FEd391b51aE1887b833cc91