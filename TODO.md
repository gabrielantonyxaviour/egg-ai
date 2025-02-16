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

## Docker clean up commands

docker stop $(docker ps -a -q)
docker rm $(docker ps -a -q)
docker system prune -a  # This will remove all unused images, containers, networks and volumes
docker builder prune    # This will clean up build cache

rm -rf node_modules
rm -rf */node_modules
rm -rf .pnpm-store

docker buildx build --platform=linux/amd64  -t eggai/eggai-chick . 


0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14,0x0625aFB445C3B6B7B929342a04A22599fd5dBB59,0xbe72E441BF55620febc26715db68d3494213D8Cb,0x58Eb19eF91e8A6327FEd391b51aE1887b833cc91