
// var web3 = new Web3(givenProvider);
var web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");


var contractAddress = "0x66B3D3dc9c94f1344DD60684D541CDb81a89532A";

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
    console.log(web3.utils.fromWei(currentETHBalance));
    $("<span />").text(" " + web3.utils.fromWei(currentETHBalance)).appendTo("#eth-balance");
    $("<span />").text(" " + currentETHBalance).appendTo("#wei-balance");

}

async function showTokenList(){ 
    let list = await dex.methods.getTokenList().call();
    for(let i=0; i < list.length; i++){
        let tokenList = await dex.methods.TokenList(i).call();
        console.log(tokenList);
        $('<p />').text("Ticker: " + web3.utils.toUtf8(tokenList) + ", ").appendTo('.listOfTokens');
    }
}

async function showOrderbookBuy(){ 
    let orderbook = dex.methods.getOrderBook(web3.utils.fromUtf8("ADA"), 0).call();
    console.log(orderbook);

    for(let i = 0; i < orderbook.length; i++){
        let ticker = orderbook[i]["ticker"];
        let amount = orderbook[i]["amount"];
        let price = web3.utils.fromWei(orderbook[i]["price"]);
        console.log(ticker);
        console.log(amount);
        console.log(price);

        $("<tr />").appendTo("#BuyOrders");
        $("<td />").text("Ticker: " + web3.utils.fromUtf8(ticker).toString()).appendTo("#BuyOrders");
        $("<td />").text("Amount: " + amount).appendTo("#BuyOrders");
        $("<td />").text("Price (in Wei): " + web3.utils.fromWei(price).toString()).appendTo("#BuyOrders");
    }
}

async function showOrderbookSell(){
    let orderbook = dex.methods.getOrderBook(web3.utils.fromUtf8("ADA"), 1).call();
    for(let i = 0; i<orderbook.length; i++){
        let ticker = orderbook[i]["ticker"];
        let amount = orderbook[i]["amount"];
        let price = web3.utils.fromWei(orderbook[i]["price"]);
        $("<tr >").appendTo("#SellOrders");
        $("<td />").text("Ticker: " + web3.utils.fromUtf8(ticker).toString()).appendTo("#SellOrders");
        $("<td />").text("Amount: " + amount).appendTo("#SellOrders");
        $("<td />").text("Price (in Wei): " + web3.utils.fromWei(price).toString()).appendTo("#SellOrders");
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