//*** Package Dependencies ***\\
const Web3 = require('web3')
const Tx = require('ethereumjs-tx').Transaction

//*** Contract Manager Account ***\\
var account = '0x2342342342...'
var key = new Buffer.from('{Private Key for Billing Manager Address}', 'hex')
//To send transactions.

//*** Connection Methods ***\\
//Prevent Idle Connection Disconnects from Infura. This is an old workaround that is probably not needed anymore, but it is a cool function to know if ever needed.
// console.log("App Restarted, Current PID: " + process.pid)
// setTimeout(function () {
//     process.on("exit", function () {
//         require("child_process").spawn(process.argv.shift(), process.argv, {
//             cwd: process.cwd(),
//             detached : true,
//             stdio: "inherit"
//         })
//     })
//     process.exit()
// }, 60000)

//Infura Websockets connection.
const getProvider = () => {
    const provider = new Web3.providers.WebsocketProvider('wss://ropsten.infura.io/ws/{yourinfurakey}')
    provider.on('connect', () => {
    	console.log('*** WebSocket Connected ***')
	})
    provider.on('error', e => {
        console.log('*** WebSocket Error ***')
        getProvider()
    })
    provider.on('end', e => {
        console.log('*** WebSocket Ended ***')
        getProvider()
    })
        provider.on('close', e => {
        console.log('*** WebSocket Closed ***')
        getProvider()
    })
        provider.on('timeout', e => {
        console.log('*** WebSocket Timeout ***')
        getProvider()
    })
        provider.on('exit', e => {
        console.log('*** WebSocket Exit ***')
        getProvider()
    })
        provider.on('ready', e => {
        //console.log('*** WebSocket Ready ***')
    })
    return provider
}
//setInterval(getProvider, 60000)
const web3 = new Web3(getProvider())

//*** Contracts ***\\
const tokenContractABI = [
	{
		"constant": true,
		"inputs": [],
		"name": "name",
		"outputs": [
			{
				"name": "",
				"type": "bytes32"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "stop",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "guy",
				"type": "address"
			},
			{
				"name": "wad",
				"type": "uint256"
			}
		],
		"name": "approve",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "owner_",
				"type": "address"
			}
		],
		"name": "setOwner",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "totalSupply",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "src",
				"type": "address"
			},
			{
				"name": "dst",
				"type": "address"
			},
			{
				"name": "wad",
				"type": "uint256"
			}
		],
		"name": "transferFrom",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "decimals",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "guy",
				"type": "address"
			},
			{
				"name": "wad",
				"type": "uint256"
			}
		],
		"name": "mint",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "wad",
				"type": "uint256"
			}
		],
		"name": "burn",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "name_",
				"type": "bytes32"
			}
		],
		"name": "setName",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "src",
				"type": "address"
			}
		],
		"name": "balanceOf",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "stopped",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "authority_",
				"type": "address"
			}
		],
		"name": "setAuthority",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "symbol",
		"outputs": [
			{
				"name": "",
				"type": "bytes32"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "guy",
				"type": "address"
			},
			{
				"name": "wad",
				"type": "uint256"
			}
		],
		"name": "burn",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "wad",
				"type": "uint256"
			}
		],
		"name": "mint",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "dst",
				"type": "address"
			},
			{
				"name": "wad",
				"type": "uint256"
			}
		],
		"name": "transfer",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "dst",
				"type": "address"
			},
			{
				"name": "wad",
				"type": "uint256"
			}
		],
		"name": "push",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "src",
				"type": "address"
			},
			{
				"name": "dst",
				"type": "address"
			},
			{
				"name": "wad",
				"type": "uint256"
			}
		],
		"name": "move",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "start",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "authority",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "guy",
				"type": "address"
			}
		],
		"name": "approve",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "src",
				"type": "address"
			},
			{
				"name": "guy",
				"type": "address"
			}
		],
		"name": "allowance",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "src",
				"type": "address"
			},
			{
				"name": "wad",
				"type": "uint256"
			}
		],
		"name": "pull",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"name": "symbol_",
				"type": "bytes32"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "guy",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "wad",
				"type": "uint256"
			}
		],
		"name": "Mint",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "guy",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "wad",
				"type": "uint256"
			}
		],
		"name": "Burn",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "authority",
				"type": "address"
			}
		],
		"name": "LogSetAuthority",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "owner",
				"type": "address"
			}
		],
		"name": "LogSetOwner",
		"type": "event"
	},
	{
		"anonymous": true,
		"inputs": [
			{
				"indexed": true,
				"name": "sig",
				"type": "bytes4"
			},
			{
				"indexed": true,
				"name": "guy",
				"type": "address"
			},
			{
				"indexed": true,
				"name": "foo",
				"type": "bytes32"
			},
			{
				"indexed": true,
				"name": "bar",
				"type": "bytes32"
			},
			{
				"indexed": false,
				"name": "wad",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "fax",
				"type": "bytes"
			}
		],
		"name": "LogNote",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "src",
				"type": "address"
			},
			{
				"indexed": true,
				"name": "guy",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "wad",
				"type": "uint256"
			}
		],
		"name": "Approval",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "src",
				"type": "address"
			},
			{
				"indexed": true,
				"name": "dst",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "wad",
				"type": "uint256"
			}
		],
		"name": "Transfer",
		"type": "event"
	}
]
const tokenContractAddress = '0x234234234234...'
var tokenContract = new web3.eth.Contract(tokenContractABI, tokenContractAddress)

const subscriptionContractABI = [
	{
		"constant": false,
		"inputs": [
			{
				"name": "_subscriberAddress",
				"type": "address"
			}
		],
		"name": "cancelSubscription",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_subscriberAddress",
				"type": "address"
			}
		],
		"name": "chargeSubscriber",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_subscriberAddress",
				"type": "address"
			}
		],
		"name": "initiateSubscription",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_newContractManager",
				"type": "address"
			}
		],
		"name": "updateContractManager",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"name": "_contractManager",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "SubscriberAddress",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "SubscriptionAmount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "BillingInterval",
				"type": "string"
			}
		],
		"name": "subscriptionEvent",
		"type": "event"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "aMonthInSeconds",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "billingInterval",
		"outputs": [
			{
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "contractManager",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "contractOwner",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "DAIcontract",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getSubscriberCount",
		"outputs": [
			{
				"name": "subscriberCount",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_subscriberAddress",
				"type": "address"
			}
		],
		"name": "isSubscriber",
		"outputs": [
			{
				"name": "isASubscriber",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "merchant",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "subscriberList",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "subscriptionPrice",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"name": "subscriptionRegistry",
		"outputs": [
			{
				"name": "timeOfFirstCharge",
				"type": "uint256"
			},
			{
				"name": "timesCharged",
				"type": "uint256"
			},
			{
				"name": "nonce",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
]

const subscriptionContractAddress = '0x23423423423...'
var subscriptionContract = new web3.eth.Contract(subscriptionContractABI, subscriptionContractAddress)

//*** Global Variables ***\\
const tokenType = 'DAI'
var subscriptionPrice
var subscriberAddresses = []
var nonceCounter
var startingBlock
var scriptHasBeenLoaded = false

//*** Functions ***\\
async function startScript() {

    await web3.eth.getBlockNumber().then((result) => {
        startingBlock = result
        console.log('*** Starting Block is', startingBlock, '***')
    })

 	await subscriptionContract.methods.subscriptionPrice().call().then((result) => {
                subscriptionPrice =  web3.utils.toBN(result)
                console.log('*** Subscription Price is', web3.utils.fromWei(subscriptionPrice.toString(), 'ether'), tokenType, '***')
            })

    await tokenContract.events.Approval({
                filter: { guy: subscriptionContractAddress },
                fromBlock: startingBlock, //startingBlock-10
                toBlock: 'latest'
            },
            (error, events) => {
                subscriberAddresses.push(events.returnValues.src)
                if (scriptHasBeenLoaded === true) {
                retrieveApprovals()
            }
            })
        .on('error', console.error)
        
    await web3.eth.getTransactionCount(account, 'pending').then((result) => {
        console.log('*** Initial Nonce is', result, '***')
        nonceCounter = result
        console.log('*** Listening for Approvals ***')
        //Timeout minimizes duplicate transactions submitted when script resets.
        setTimeout(retrieveApprovals, 20000)
        retrieveApprovals()
    })
    
}

startScript()

function deduplicateApprovalsList(value, index, self) { 
    return self.indexOf(value) === index;
}

function retrieveApprovals(){
	subscriberAddresses = subscriberAddresses.filter(deduplicateApprovalsList)
	let i
	for (i of subscriberAddresses) {
	  checkIfSubscriber(i)
	} 
    console.log('*** Past Events Parsed ***') 
	scriptHasBeenLoaded = true
}

function checkIfSubscriber(_subscriberAddress) {
    let subscriberAddress = _subscriberAddress

    subscriptionContract.methods.subscriptionRegistry(subscriberAddress).call().then((result) => {
		    lastCharge = result.timeOfFirstCharge.toNumber()

        if (lastCharge === 0) {
        	console.log('*** New approval from', subscriberAddress + '.', '***')
            console.log(subscriberAddress, 'is not listed as a subscriber.')
            console.log('*** Generating transaction to add', subscriberAddress, 'to contract ***')
            addSubscriber(subscriptionContract.methods.initiateSubscription(subscriberAddress).encodeABI(), subscriberAddress)
        } 
        if (lastCharge > 0) {
        	console.log('*** New approval from', subscriberAddress + '.', '***')
        	let chargeDate = new Date(result.timeOfFirstCharge.toNumber() * 1000);
            console.log(subscriberAddress, 'is listed as a subscriber already.', 'They were last billed on ' + chargeDate.toGMTString() + '.')
            //Delete address from array to prevents duplicate tx.
            subscriberAddresses = subscriberAddresses.filter(arrayItem => arrayItem !== subscriberAddress)
      	}
    })
    .catch(function(error){
    	 console.log(error)
	})
}

function addSubscriber(_subscriberData, _subscriberAddress) {
    console.log('*** Waiting for Nonce Return ***')
    let data = _subscriberData
    let subscriberAddress = _subscriberAddress
    sendTx(data, nonceCounter, subscriberAddress)
    nonceCounter++
}
 
async function sendTx(_data, _nonce, _subscriberAddress) {
	let balance
	let data = _data
	let nonce =_nonce
	let subscriberAddress = _subscriberAddress
	await tokenContract.methods.balanceOf(subscriberAddress).call().then((result) => {
                balance = web3.utils.toBN(result)
            })

if (Number(web3.utils.fromWei(balance, 'ether')) < Number(web3.utils.fromWei(subscriptionPrice, 'ether'))) {
	 console.log('*** Someone is busto! No tx was generated for', subscriberAddress + '. ***')
	 console.log('Their balance was', web3.utils.fromWei(balance.toString(), 'ether'), 'when checked.')
	return
}

if (Number(web3.utils.fromWei(balance, 'ether')) >= Number(web3.utils.fromWei(subscriptionPrice, 'ether'))) {
	 console.log('***', subscriberAddress, 'has enough', tokenType, 'to subscribe. ***')
	 console.log('Their balance was', web3.utils.fromWei(balance.toString(), 'ether'), 'when checked.')
   
    var rawTx = {
    to: subscriptionContractAddress,
    from: account,
    value: web3.utils.toHex(0),
    gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'gwei')),
    gas: web3.utils.toHex(300000),
    nonce: web3.utils.toHex(nonce),
    data: data
    }
    //console.log('*** Signing Transaction ***')
    var tx = new Tx(rawTx, {'chain':'ropsten'})
    tx.sign(key)
 
    var serializedTx = tx.serialize();
    console.log('*** Transaction Signed for', subscriberAddress, 'Tx Nonce:', nonce, '***')
    // console.log('*** Signed Transaction ***')
    // console.log('0x' + serializedTx.toString('hex'))
    // console.log('*** Submitting Transaction ***')
    web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
        // .on('transactionHash', function () {
        // 	console.log('*** Transaction Hash ***')
        // })
        // .on("transactionHash", console.log)
        // .on('transactionHash', function () {
        // 	console.log('*** Waiting for Confirmation ***')
        // })
        // .on('receipt', function () {
        // 	console.log('*** Transaction Submitted ***')
        // })
 	    .once("confirmation", function() {
 	      	console.log('*** Transaction confirmed.', subscriberAddress, 'has been added to the billing contract. ***')
 	    })
 	    .on("error", function() {
 	        console.log('*** Error adding', subscriberAddress, 'to the billing contract. ***')
 	    })
 	    // .on("error", console.error)
 	 //Delete address from array to prevents duplicate tx.   
 	 subscriberAddresses = subscriberAddresses.filter(arrayItem => arrayItem !== subscriberAddress)
	}
}
//Timestamp for Debugging
function timeStamp() {
	let date = new Date()
	console.log(date.toGMTString())
}
setInterval(timeStamp, 60000)