import path from 'path';
import LitJsSdk from '@lit-protocol/lit-node-client';
import { LitContracts } from '@lit-protocol/contracts-sdk';
import { ethers } from 'ethers';
import siwe from "siwe"
import { AUTH_METHOD_SCOPE, AUTH_METHOD_TYPE, } from '@lit-protocol/constants';
import pkg from '@lit-protocol/lit-auth-client';
const { LitAuthClient, getAuthIdByAuthMethod } = pkg;
const LITCONFIG = {
    "TEST_ENV": {
        "litNetwork": "cayenne",
        "debug": false,
        "minNodeCount": 2
    },
    "test": {
        "sendRealTxThatCostsMoney": false
    },
    "MNEUMONIC": "island arrow object divide umbrella snap essay seminar top develop oyster success",
    "COSMOS_RPC": "https://cosmos-rpc.publicnode.com",
    "CHRONICLE_RPC": "https://chain-rpc.litprotocol.com/http",
    "CHRONICLE_RPC_2": "https://lit-protocol.calderachain.xyz/http",
    "RECIPIENT": "cosmos1jyz3m6gxuwceq63e44fqpgyw2504ux85ta8vma",
    "DENOM": "uatom",
    "AMOUNT": 1,
    "DEFAULT_GAS": 0.025,
    "AUTH_METHOD_ACCESS_TOKEN": "<your access token here>",
    "CONTROLLER_PRIVATE_KEY": "f21d3fafe29fa10d26092ce4e91cd7108b734b98393f79b3c2cd04de24ca6817",
    "CONTROLLER_ADDRESS": "0xeF71c2604f17Ec6Fc13409DF24EfdC440D240d37",
    "PKP_TOKENID": "76782466186288095105667301754604586214815535829618018025889449690021181398503",
    "PKP_PUBKEY": "04b5caf00c9f5adc9b22ca460b88482bad44ed4fac8ee63014b727cf60efc568dbdfe498a94fbd9cd294d651529f9fe76e057e9736150eea038415b06f64a87939",
    "PKP_ETH_ADDRESS": "0xDd66eE5E696911F92e19B8612F711FA508816a6e",
    "PKP_COSMOS_ADDRESS": "cosmos1v8wr9cvhhy7n43vmyswp69akszdhqtuzh4pztf",
    "PKP_SUI_ADDRESS": "0x8c0d831a2db7a71ba0d151f27e3a11349a45b5430eba956a65c9955db06d4e22",
    "CONTROLLER_AUTHSIG": {
        "sig": "0x137b66529678d1fc58ab5b340ad036082af5b9912f823ba22c2851b8f50990a666ad8f2ab2328e8c94414c0a870163743bde91a5f96e9f967fd45d5e0c17c3911b",
        "derivedVia": "web3.eth.personal.sign",
        "signedMessage": "localhost wants you to sign in with your Ethereum account:\n0xeF71c2604f17Ec6Fc13409DF24EfdC440D240d37\n\nTESTING TESTING 123\n\nURI: https://localhost/login\nVersion: 1\nChain ID: 1\nNonce: eoeo0dsvyLL2gcHsC\nIssued At: 2023-11-17T15:04:20.324Z\nExpiration Time: 2215-07-14T15:04:20.323Z",
        "address": "0xeF71c2604f17Ec6Fc13409DF24EfdC440D240d37"
    },
    "CONTROLLER_ADDRESS_2": "0xeF71c2604f17Ec6Fc13409DF24EfdC440D240d37",
    "PKP_TOKENID_2": "17721897921193976077336024133272331792112731041238443667910728449433240332747",
    "PKP_PUBKEY_2": "04863db2ece69acb897a07d367b833ebb29f7c4416edca34e8bedbd32252c0fbfa4779c22309dd94eed86601f6967e3792b06df33c072592355eb0045985f8e4b3",
    "PKP_ETH_ADDRESS_2": "0x9fc386f8cd07631b42817996357e35F10aC04727",
    "PKP_COSMOS_ADDRESS_2": "cosmos1853xq9ntk6hv69rvnmaxafssk6r40eemlyeqz0",
    "PKP_SUI_ADDRESS_2": "0x71175cb41d82e5b28d8a4865ee934d2ed31eeb561d10f3c3a10cab5ac354b688",
    "CONTROLLER_AUTHSIG_2": {
        "sig": "0x017564beb9aaddd669a59ce7aa5f0d73effb4b501dad052813e6bf2bec8b88551399c14e883a4a7310d9a1e142aa3c7c738b5db388c98af4fc45d1cdad25cdc11b",
        "derivedVia": "web3.eth.personal.sign",
        "signedMessage": "localhost wants you to sign in with your Ethereum account:\n0xeF71c2604f17Ec6Fc13409DF24EfdC440D240d37\n\nTESTING TESTING 123\n\nURI: https://localhost/login\nVersion: 1\nChain ID: 1\nNonce: gOv4cHte0F8Bg59Mb\nIssued At: 2023-11-17T15:04:32.857Z\nExpiration Time: 2215-07-14T15:04:32.857Z",
        "address": "0xeF71c2604f17Ec6Fc13409DF24EfdC440D240d37"
    }
}
async function main() {
    // ========== Controller Setup ===========
    const provider = new ethers.providers.JsonRpcProvider(
        LITCONFIG.CHRONICLE_RPC
    );

    const controllerWallet = new ethers.Wallet(
        LITCONFIG.CONTROLLER_PRIVATE_KEY,
        provider
    );
    const address = controllerWallet.address;
    // Craft the SIWE message
    const domain = 'localhost';
    const origin = 'https://localhost/login';
    const statement =
        'This is a test statement.  You can put anything you want here.';

    // expiration time in ISO 8601 format.  This is 7 days in the future, calculated in milliseconds
    const expirationTime = new Date(
        Date.now() + 1000 * 60 * 60 * 24 * 7 * 10000
    ).toISOString();

    let nonce = await litNodeClient.getLatestBlockhash();


    const siweMessage = new siwe.SiweMessage({
        domain,
        address: address,
        statement,
        uri: origin,
        version: '1',
        chainId: 1,
        nonce,
        expirationTime,
    });
    const messageToSign = siweMessage.prepareMessage();

    // Sign the message and format the authSig
    const signature = await wallet.signMessage(messageToSign);

    const authSig = {
        sig: signature,
        derivedVia: 'web3.eth.personal.sign',
        signedMessage: messageToSign,
        address: address,
    };

    console.log(authSig);

    // // Form the authNeededCallback to create a session with
    // // the wallet signature.
    // const authNeededCallback = async (params) => {
    //  const response = await client.signSessionKey({
    //    statement: params.statement,
    //    authMethods: [
    //      {
    //        authMethodType: 1,
    //        // use the authSig created above to authenticate
    //        // allowing the pkp to sign on behalf.
    //        accessToken: JSON.stringify(authSig),
    //      },
    //    ],
    //    pkpPublicKey: `<your pkp public key>`,
    //    expiration: params.expiration,
    //    resources: params.resources,
    //    chainId: 1,
    //  });
    //  return response.authSig;
    // };

    // // Set resources to allow for signing of any message.
    // const resourceAbilities = [
    //  {
    //    resource: new LitActionResource('*'),
    //    ability: LIT_ABILITY.PKPSigning,
    //  },
    // ];
    // // Get the session key for the session signing request
    // // will be accessed from local storage or created just in time.
    // const sessionKeyPair = client.getSessionKey();

    // // Request a session with the callback to sign
    // // with an EOA wallet from the custom auth needed callback created above.
    // const sessionSigs = await client.getSessionSigs({
    //    chain: "ethereum",
    //    expiration:  new Date(Date.now() + 60_000 * 60).toISOString(),
    //    resourceAbilityRequests: resourceAbilities,
    //    authNeededCallback,
    // });


    //     const contractClient = new LitContracts({
    //         signer: controllerWallet,
    //     });

    //     await contractClient.connect();
    //     const mintCost = await contractClient.pkpNftContract.read.mintCost();


    //     const authId = getAuthIdByAuthMethod(authMethod);
    //     const authMethod = {
    //         authMethodType: AUTH_METHOD_TYPE.EthWallet,
    //         accessToken: JSON.stringify(authSig),
    //     };

    //     const mintInfo = await contractClient.mintWithAuth({
    //         authMethod: authMethod,
    //         scopes: [
    //             // AUTH_METHOD_SCOPE.NoPermissions,
    //             AUTH_METHOD_SCOPE.SignAnything,
    //             AUTH_METHOD_SCOPE.PersonalSign
    //         ],
    //     });
    //     // -- minting a PKP
    //     const mintTx =
    //         await contractClient.pkpHelperContract.write.mintNextAndAddAuthMethods(
    //             AuthMethodType.LitAction,
    //             [AuthMethodType.LitAction, AuthMethodType.],
    //             [authId],
    //             ['0x'], // only for web3auth atm
    //             [[1]],
    //             true, // addPkpEthAddressAsPermittedAddress,
    //             true, // sendPkpToItself,
    //             {
    //                 value: mintCost,
    //             }
    //         );

    //     const mintTxReceipt = await mintTx.wait();

    //     const tokenId = mintTxReceipt.events[0].topics[1];

    //     // -- get the scopes
    //     const scopes =
    //         await contractClient.pkpPermissionsContract.read.getPermittedAuthMethodScopes(
    //             tokenId,
    //             AuthMethodType.EthWallet,
    //             authId,
    //             3
    //         );

    //     // ==================== Post-Validation ====================
    //     if (mintCost === undefined || mintCost === null) {
    //         return fail('mintCost should not be empty');
    //     }

    //     if (scopes[1] !== true) {
    //         return fail('scope 1 (sign anything) should be true');
    //     }

    //     // ==================== Success ====================
    //     return success(`ContractsSDK mints a PKP
    // Logs:
    // ---
    // mintHash: ${mintTxReceipt.transactionHash}
    // tokenId: ${tokenId}
    // scope 1 (sign anything): ${scopes[1]}
    // scope 2 (only sign messages): ${scopes[2]}
    // `);
}
main()