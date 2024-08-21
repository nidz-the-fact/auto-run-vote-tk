const { ethers } = require('ethers');
const { format, formatDistance } = require('date-fns');

// --------------------------------------------------- //
// config
const PRIVATE_KEY = 'xxxYourPrivateKeyxxx'; // private key Your wallet account
const CONTRACT_ADDRESS = '0x4D1E2145082d0AB0fDa4a973dC4887C7295e21aB'; // contract
const RPC_URL = 'https://rpc.taiko.xyz'; // rpc chain
const VOTE_VALUE = ethers.parseEther('0.0001'); // value
const DELAY_MS = 5000; // timme send - 5000=5ms
const SCAN_URL = 'https://taikoscan.io/tx/'; // explorer - /tx/
// --------------------------------------------------- //

const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

const abi = [
  'function vote() external payable'
];
const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, wallet);

let tx_count = 1;
let last_tx_time = new Date();

async function sendTransaction() {
  try {
    const txResponse = await contract.vote({ value: VOTE_VALUE });
    await txResponse.wait(); 

    const txHash = txResponse.hash;
    const scanLink = `${SCAN_URL}${txHash}`;

    const current_time = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
    const elapsed_time = formatDistance(last_tx_time, new Date(), { includeSeconds: true });
    const walletAddress = wallet.address;

    console.log('---------------------------------------');
    console.log(`Transaction Number: ${tx_count}`);
    console.log(`Current Time: ${current_time}`);
    console.log(`Elapsed Time: ${elapsed_time}`);
    console.log(`Wallet Address: ${walletAddress}`);
    console.log(`Tx Link: ${scanLink}`);
    console.log('---------------------------------------');

    tx_count++;
    last_tx_time = new Date();
  } catch (error) {
    console.error('Error sending transaction:', error);
  }
}

async function main() {
  while (true) {
    await sendTransaction();
    await new Promise(resolve => setTimeout(resolve, DELAY_MS));
  }
}

main();
