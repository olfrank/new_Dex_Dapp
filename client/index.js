
// var web3 = new Web3(givenProvider);
var web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");


var contractAddress = "0x5C12969D58a7312Cf8660aDD748DB0B62E793283";

$(document).ready(function (){
    window.ethereum.enable().then(async function(accounts){
        dex = await new web3.eth.Contract(abi, contractAddress, {from: accounts[0]})
        showTokenList();
        showETHBalance();
        showTokenBalance();
        showOrderbookBuy();
        showOrderbookSell();
    })




$("#btndepositEth").click(depositEth);
$("#btnwithdrawEth").click(withdrawEth);
$("#btnLimitOrder").click(placeLimitOrder);
$("#btnMarketOrder").click(placeMarketOrder);
$("#btnOrderbook").click(reloadPage);
$("#btnTokenDeposit").click(depositTokens);
$("#btnTokenWithdraw").click(withdrawTokens);

async function depositTokens(){
    let amount = $("#depositTokens").val();
    await dex.methods.deposit(amount, web3.utils.fromUtf8("LINK")).send();
}
async function withdrawTokens(){
    let amount = $("#withdrawTokens").val();
    await dex.methods.withdraw(amount, web3.utils.fromUtf8("LINK")).send();
}

async function showTokenBalance(){
    let tokenList = await dex.methods.getTokenList().call();

    for(let i =0; i< tokenList.length; i++){
        let token = await dex.methods.TokenList(i).call();
        let balance = await dex.methods.balances(ethereum.selectedAddress, token).call();
        console.log("Balance of " + web3.utils.toUtf8(token) + " is: " + balance);
        $('<span />').text(web3.utils.toUtf8(token) + ": "+ balance).appendTo("#tokenBal");
    }
}

async function showETHBalance(){
    let address = ethereum.selectedAddress;
    let currentETHBalance = await dex.methods.balances(address, web3.utils.fromUtf8("ETH")).call();
    console.log("current eth balance: " +web3.utils.fromWei(currentETHBalance));
    $("<span />").text(" " + web3.utils.fromWei(currentETHBalance)).appendTo("#eth-balance");
    $("<span />").text(" " + currentETHBalance).appendTo("#wei-balance");

}

async function showTokenList(){ 
    let list = await dex.methods.getTokenList().call();
    console.log("token list length is: "+list);
    for(let i=0; i < list; i++){
        let tokenList = await dex.methods.TokenList(i).call();
        console.log(web3.utils.toUtf8(tokenList));
        $('<p />').text(web3.utils.toUtf8(tokenList)).appendTo('.listOfTokens');
    }
}

async function showOrderbookBuy(){ 
    let orderbookBuy = await dex.methods.getOrderBook(web3.utils.fromAscii("ADA"), 0).call();
    console.log("orderbook buy side: "+orderbookBuy);

    for(let i = 0; i < orderbookBuy.length; i++){
        let ticker = orderbookBuy[i]["ticker"];
        let amount = orderbookBuy[i]["amount"];
        let price = web3.utils.toWei(orderbookBuy[i]["price"]);
        console.log("orderbook buy ticker: "+web3.utils.toUtf8(ticker));
        console.log("orderbook buy amount: "+amount);
        console.log("orderbook buy price: "+price);

        $("<tr />").appendTo(".buy-orders-side");
        $("<td />").text(web3.utils.toUtf8(ticker)).appendTo(".buy-orders-side");
        $("<td />").text(amount).appendTo(".buy-orders-side");
        $("<td />").text(web3.utils.fromWei(price).toString()).appendTo(".buy-orders-side");
    }
}

async function showOrderbookSell(){
    let orderbookSell = await dex.methods.getOrderBook(web3.utils.fromAscii("ADA"), 1).call();
    console.log("orderbook sell side: "+orderbookSell);

    for(let i = 0; i < orderbookSell.length; i++){
        let ticker = orderbookSell[i]["ticker"];
        let amount = orderbookSell[i]["amount"];
        let price = web3.utils.toWei(orderbookSell[i]["price"]);
        console.log("orderbook sell ticker: "+web3.utils.toUtf8(ticker));
        console.log("orderbook sell amount: "+amount);
        console.log("orderbook sell price: "+price);

        $("<tr />").appendTo(".sell-orders-side").addClass("new-row")
        $("<td />").text(web3.utils.toUtf8(ticker)).appendTo(".new-row");
        $("<td />").text(amount).appendTo(".new-row");
        $("<td />").text(web3.utils.fromWei(price).toString()).appendTo(".new-row");
    }
}

function reloadPage(){
    location.reload();
}


async function placeLimitOrder(){
    let side = $("#typeL").val();
    console.log(side);
    let ticker = $("#tickerL").val();
    console.log(ticker);

    let amount = $("#amountL").val();
    console.log(amount);

    let price = $("#priceL").val();
    console.log(price);

    await dex.methods.createLimitOrder(side, web3.utils.fromUtf8(ticker), amount, price).send();
    reloadPage();
}

async function placeMarketOrder(){
    let side = $("#typeM").val();
    console.log(side)
    let ticker = $("#tickerM").val();
    console.log(ticker);
    let amount = $("#amountM").val();
    console.log(amount);
    await dex.methods.createMarketOrder(side, web3.utils.fromUtf8(ticker), amount).send();
    alert("Your Market Order Has Been Placed");
    reloadPage()
}


async function withdrawEth(){
    let amount = $("#withdrawEther").val();
    console.log(amount);
    let address = ethereum.selectedAddress;
    console.log(address);
    let balanceBefore = await dex.methods.balances(address, web3.utils.fromUtf8("ETH")).call();
    console.log(balanceBefore);
    await dex.methods.withdrawEth(amount).send({from: ethereum.selectedAddress});
    let balanceAfter = await dex.methods.balances(ethereum.selectedAddress, web3.utils.fromUtf8("ETH")).call();
    console.log(balanceAfter);
    
    reloadPage()
    
}

async function depositEth (){
    let amount = $("#depositEther").val();
    console.log(amount);
    let address = ethereum.selectedAddress;
    console.log(address);
    let balance = await dex.methods.balances(address, web3.utils.fromUtf8("ETH")).call();
    console.log(balance);
    await dex.methods.depositEth().send({value: web3.utils.toWei(amount, "ether")});
    balance = await dex.methods.balances(address, web3.utils.fromUtf8("ETH")).call();
    console.log(balance);
    
    reloadPage();
    
}













});