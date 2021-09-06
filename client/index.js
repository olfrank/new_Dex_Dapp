
// var web3 = new Web3(givenProvider);
var web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");


var contractAddress = "0x907EcC1E7732ba1397CF01E16eD7DaBf2483811d";

$(document).ready(function (){
    window.ethereum.enable().then(async function(accounts){
        dex = await new web3.eth.Contract(abi, contractAddress, {from: accounts[0]})
        showTokenList();
        showETHBalance();
        showTokenBalance();
        // showOrderbookBuy();
        // showOrderbookSell();

        // let list = await dex.methods.getTokenList().call();
        // console.log("token list length is: "+list);
        // for(let i=0; i < list; i++){
        // let tokenList = await dex.methods.TokenList(i).call();
        // console.log(web3.utils.toUtf8(tokenList));
        // }

        loadLimitOrderTable("ADA", 0)
        loadLimitOrderTable("ADA", 1)
        loadLimitOrderTable("VET", 0)
        loadLimitOrderTable("VET", 1)
        loadLimitOrderTable("LINK", 0)
        loadLimitOrderTable("LINK", 1)
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
        console.log(web3.utils.toUtf8(token));
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

// async function showOrderbookBuy(){ 
//     let orderbookBuy = await dex.methods.getOrderBook(web3.utils.fromAscii("ADA"), 0).call();
//     console.log("orderbook buy side: "+orderbookBuy);

//     for(let i = 0; i < orderbookBuy.length; i++){
//         let ticker = orderbookBuy[i]["ticker"];
//         let amount = orderbookBuy[i]["amount"];
//         let price = web3.utils.toWei(orderbookBuy[i]["price"]);
//         console.log("orderbook buy ticker: "+web3.utils.toUtf8(ticker));
//         console.log("orderbook buy amount: "+amount);
//         console.log("orderbook buy price: "+price);

//         $("<tr />").appendTo(".buy-orders-side");
//         $("<td />").text(web3.utils.toUtf8(ticker)).appendTo(".buy-orders-side");
//         $("<td />").text(amount).appendTo(".buy-orders-side");
//         $("<td />").text(web3.utils.fromWei(price).toString()).appendTo(".buy-orders-side");
//     }
// }

// async function showOrderbookSell(){
//     let orderbookSell = await dex.methods.getOrderBook(web3.utils.fromAscii("ADA"), 1).call();
//     console.log("orderbook sell side: "+orderbookSell);

//     for(let i = 0; i < orderbookSell.length; i++){
//         let ticker = orderbookSell[i]["ticker"];
//         let amount = orderbookSell[i]["amount"];
//         let price = web3.utils.toWei(orderbookSell[i]["price"]);
//         console.log("orderbook sell ticker: "+web3.utils.toUtf8(ticker));
//         console.log("orderbook sell amount: "+amount);
//         console.log("orderbook sell price: "+price);

//         $("<tr />").appendTo(".sell-orders-side").addClass("new-row")
//         $("<td />").text(web3.utils.toUtf8(ticker)).appendTo(".new-row");
//         $("<td />").text(amount).appendTo(".new-row");
//         $("<td />").text(web3.utils.fromWei(price).toString()).appendTo(".new-row");
//     }
// }

function reloadPage(){
    location.reload();
}




//likewise we acess your sell order table like so
const limitOrderBuyTable = document.getElementById("BuyOrders")
const limitOrderSellTable = document.getElementById("SellOrders")

//this is your function which lets the user place a limit order
//each time we call this function we will updte the latest row in your table
async function placeLimitOrder(){

  //here i make a table which depending on the side that the user inputs will
  //take the value of one our tables defined above
  var table;
  let side = $("#typeL").val();
  console.log(side)
  let ticker = $("#tickerL").val();
  console.log(ticker)
  let amount = $("#amountL").val();
  console.log(amount)
  let price = $("#priceL").val();
  console.log(price)
  var priceInWei = web3.utils.toWei(price.toString(), "ether")

  //here we use an if statement to let our table var from above decide what table we are appending to
  //if side == 2 then we append to the sell table
  if(side == 1) {
    table = limitOrderSellTable
  }
  //if side == 0 then we append to the buy table
  else if(side == 0) {
    table = limitOrderBuyTable
  }
  await dex.methods.createLimitOrder(side, web3.utils.fromUtf8(ticker), amount, price).send().on("receipt", function(receipt) {

    //here we simple just apend a new row to our table using this notation
    table.innerHTML += `
    <tr>
        <td>${ticker}</td>
        <td>${amount}</td>
        <td >${priceInWei}</td>
    </tr>`

  }).on("error", function(error) {
      console.log("user denied transaction");
  })

}

//this function is called on page load and will loop through the order book and populate 
//our table per each elemnt in the orderbook
async function loadLimitOrderTable(ticker, side) {
    // var buy = side == 0;
    // var sell = side == 1;
    //what we do here is we call the getOrderBook function twice and populate both tables for each side
  
    //here i hardcode the ticker to be ETH to make things easier for you but you should pass 
    //in ticker into the get orderBook function
    const orderBookBuy = await dex.methods.getOrderBook(web3.utils.fromAscii(ticker), 0).call().then(function(result) {
      for (let i = 0; i < result.length; i++) {
        let priceInWei = web3.utils.toWei(result[i].price.toString(), "ether")
        console.log(result[i].price);
        
        limitOrderBuyTable.innerHTML += `
            <tr class="table-row">
                <td>${web3.utils.toUtf8(result[i].ticker)}</td>
                <td>${result[i].amount}</td>
                <td>${priceInWei}</td>
                <td>${result[i].price}</td>
            </tr>`  
      }
    })
  
    //populate sell side
    const orderBookSell = await dex.methods.getOrderBook(web3.utils.fromAscii(ticker), 1).call().then(function(result) {
      for (let i = 0; i < result.length; i++) {
        let priceInWei = web3.utils.toWei(result[i].amount.toString(), "ether")
        limitOrderSellTable.innerHTML += `
            <tr class="table-row">
                <td>${web3.utils.toUtf8(result[i].ticker)}</td>
                <td>${result[i].amount}</td>
                <td>${priceInWei}</td>
                <td>${result[i].price}</td>
            </tr>`  
      }
    })
  }









// async function placeLimitOrder(){
//     let side = $("#typeL").val();
//     console.log(side);
//     let ticker = $("#tickerL").val();
//     console.log(ticker);

//     let amount = $("#amountL").val();
//     console.log(amount);

//     let price = $("#priceL").val();
//     console.log(price);

//     await dex.methods.createLimitOrder(side, web3.utils.fromUtf8(ticker), amount, price).send();
//     reloadPage();
// }

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