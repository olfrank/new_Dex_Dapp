//import Web3, { givenProvider } from 'web3';
// Web3 = require('web3');
var web3 = new Web3(givenProvider);


var contractAddress = "0x7C852b0A1Fb041bB8772C75f9fBd2d41c6c964c0"

$(document).ready(function(){
    window.ethereum.enable().then(async function(accounts){
        dex = await new web3.eth.Contract(abi.window, contractAddress, {from: accounts[0]})
        showETHBalance();
        showOrderbookBuy();
        showOrderbookSell();
        showTokenList();
        showTokenBalance();
       
    })


function reloadPage(){
    location.reload();
}

$("#btndepositEth").on(click, depositEth);
$("#btnwithdrawEth").on(click, withdrawEth);
$("#btnLimitOrder").on(click, placeLimitOrder);
$("#btnMarketOrder").on(click, placeMarketOrder);
$("#btnOrderbook").on(click, reloadPage);
$("#btnTokenDeposit").on(click, depositTokens);
$("#btnTokenWithdraw").co(click, withdrawTokens);


async function depositEth (){
    let amount = $("#deposit-amount");
    let address = ethereum.selectedAddress;
    let balance = await dex.methods.balances(address, web3.utils.fromAscii("ETH")).call();
    await dex.methods.depositEth().send({value: web3.utils.toWei(amount, "ether")});
    balance = await dex.methods.balances(addr, web3.utils.fromAscii("ETH")).call();
    reloadPage();
}

async function withdrawEth(){
    let amount = $("#withdraw-amount");
    let address = ethereum.selectedAddress;
    let balance = await dex.methods.balances(address, web3.utils.fromAscii("ETH")).call;
    await dex.methods.withdrawEth(amount).send({from: ethereum.selectedAddress});
    reloadPage()
}

async function placeMarketOrder(){
    let side = $("#type-of-order").val();
    let ticker = $("#ticker").val();
    let amount = $("#amount").val();
    await dex.methods.createMarketOrder(side, ticker, amount).send();
    alert("Your Market Order Has Been Placed");
    reloadPage()
}

async function placeLimitOrder(){
    let side = $("#type-of-order").val();
    let ticker = $("#ticker").val();
    let amount = $("#amount").val();
    let price = $("#price").val();
    await dex.methods.createLimitOrder(side, ticker, amount, price).send();
    reloadPage();
}

async function showETHBalance(){
    let currentETHBalance = wallet.methods.balances(ethereum.selectedAddress, web3.utils.fromAscii("ETH")).call();
    document.getElementById("eth-balance").textContent = web3.utils.fromWei(currentETHBalance);
    document.getElementById("wei-balance").textContent = currentETHBalance;

}

async function showOrderbookBuy(){ 
    let orderbook = dex.methods.getOrderBook(web3.utils.fromAscii("ADA"), 0).call();
    for(let i = 0; i<orderbook.length; i++){
        let ticker = orderbook[i]["ticker"];
        let amount = orderbook[i]["amount"];
        let price = web3.utils.fromWei(orderbook[i]["price"]);
        $("<tr/>").appendTo("#BuyOrders");
        $("<td/>").text("Ticker: " + web3.utils.fromAscii(ticker).toString()).appendTo("#BuyOrders");
        $("<td/>").text("Amount: " + amount).appendTo("#BuyOrders");
        $("<td/>").text("Price (in Wei): " + web3.utils.fromWei(price).toString()).appendTo("#BuyOrders");
    }

}

async function showOrderbookSell(){
    let orderbook = dex.methods.getOrderBook(web3.utils.fromAscii("ADA"), 1).call();
    for(let i = 0; i<orderbook.length; i++){
        let ticker = orderbook[i]["ticker"];
        let amount = orderbook[i]["amount"];
        let price = web3.utils.fromWei(orderbook[i]["price"]);
        $("<tr/>").appendTo("#SellOrders");
        $("<td/>").text("Ticker: " + web3.utils.fromAscii(ticker).toString()).appendTo("#SellOrders");
        $("<td/>").text("Amount: " + amount).appendTo("#SellOrders");
        $("<td/>").text("Price (in Wei): " + web3.utils.fromWei(price).toString()).appendTo("#SellOrders");
    }
}

async function showTokenList(){
    let list = await dex.methods.getTokenList().call();
    for(let i=0; i < list.length; i++){
        let token = await dex.methods.TokenList(i).call();
        $('<p />').text("Ticker: " + web3.utils.toUtf8(tokenList)).appendTo('.listOfTokens');
    }
}

async function showTokenBalance(){
    let tokenList = await dex.methods.getTokenList().call();
    for(let i =0; i< tokenList.length; i++){
        let token = await dex.methods.TokenList(i).call();
        let balance = await dex.methods.balances(ethereum.selectedAddress, token).call();
        $('<p />').text(web3.utils.toUtf8(token) + ": "+ balance).appendTo("#tokenBal");
    }
}

async function depositTokens(){
    let amount = $("#depositTokens").val();
    await dex.methods.deposit(amount, web3.utils.fromUtf8("LINK")).send();
}
async function withdrawTokens(){
    let amount = $("#withdrawTokens").val();
    await dex.methods.withdraw(amount, web3.utils.fromUtf8("LINK")).send();
}

});
