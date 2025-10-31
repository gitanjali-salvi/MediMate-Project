const { Web3 } = require('web3');
const fs = require('fs');
const path = require('path');

// --- CONFIGURATION ---

// 1. Set the Ganache RPC Server URL (from your Ganache app)
const GANACHE_URL = 'http://127.0.0.1:7545';

// 2. Set the Contract Address (from your 'truffle migrate' output)
const CONTRACT_ADDRESS = '0x8d15598b96fB2249c3f93fd32a22bbFA4067B625'; // <-- PASTE YOURS HERE

// 3. Set the path to the contract's ABI JSON file
const ABI_PATH = path.resolve(__dirname, '../../build/contracts/DocumentRegistry.json');

// --- INITIALIZATION ---

let web3;
let contract;

try {
    // 1. Initialize Web3 Provider
    //const provider = new Web3.providers.HttpProvider(GANACHE_URL);
    web3 = new Web3(GANACHE_URL);

    // 2. Load the Contract ABI
    const abiFile = fs.readFileSync(ABI_PATH, 'utf8');
    const abiJson = JSON.parse(abiFile);
    const contractAbi = abiJson.abi;

    // 3. Create the Contract Instance
    contract = new web3.eth.Contract(contractAbi, CONTRACT_ADDRESS);

    console.log('Blockchain connection utility initialized successfully.');
    console.log('Connected to Ganache at:', GANACHE_URL);
    console.log('Loaded contract at address:', CONTRACT_ADDRESS);

} catch (error) {
    console.error('Failed to initialize blockchain utility:', error.message);
    console.error('Please ensure Ganache is running and contract address/ABI path are correct.');
    web3 = null;
    contract = null;
}

// 4. Export the instances
module.exports = { web3, contract };