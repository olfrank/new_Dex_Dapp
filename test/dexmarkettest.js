const Dex = artifacts.require("Dex");
const ADA = artifacts.require("ADA");
const truffleAssert = require("truffle-assertions");

// --> createMarketOrder(Side side, bytes32 ticker, uint amount) public {


contract ("Dex", accounts => {
    // the user must have eth deposited such that deposited eth is >= to buy order value
    it("Seller should have tokens for the trade", async () => {
        let dex = await Dex.deployed()
        let balance = await dex.balances(accounts[0], web3.utils.fromUtf8("ADA") )
        assert.equal( balance.toNumber(), 0, "ADA balance is not 0" )
        await truffleAssert.reverts( //sell will not be cleared due to not enough tokens
            dex.createMarketOrder(1, web3.utils.fromUtf8("ADA"), 10)
        )
       
    })

    it("Market order to be submitted despite no matching orders", async () => {
        let dex = await Dex.deployed()
        await dex.depositEth({value: 10000})
        let orderbook = await dex.getOrderBook(web3.utils.fromUtf8("ADA"), 0)
        assert(orderbook.length == 0, "Buy orders are not 0")
        await truffleAssert.passes( //Buy will not be cleared due to not enough ETH
            dex.createMarketOrder(0, web3.utils.fromUtf8("ADA"), 0)
        )

    })


    it("Market orders should not fill more limit orders than the market order amount", async () => {
        let dex = await Dex.deployed()
        let ada = await ADA.deployed()

        let orderbook = await dex.getOrderBook(web3.utils.fromUtf8("ADA"), 1)
        assert(orderbook.length == 0, "Sell side Orderbook should be empty at start of test")
        
        await dex.addToken(web3.utils.fromUtf8("ADA"), ada.address)

        //send ada tokens to account 1, 2, 3 from account 0
        await ada.transfer(accounts[1], 150);
        await ada.transfer(accounts[2], 150);
        await ada.transfer(accounts[3], 150);

        //approve DEX for accounts 1, 2, 3
        await ada.approve(dex.address, 50, {from: accounts[1]});
        await ada.approve(dex.address, 50, {from: accounts[2]});
        await ada.approve(dex.address, 50, {from: accounts[3]});

        //deposit ADA into DEX for accounts 1, 2, 3
        await dex.deposit(50, web3.utils.fromUtf8("ADA"), {from: accounts[1]});
        await dex.deposit(50, web3.utils.fromUtf8("ADA"), {from: accounts[2]});
        await dex.deposit(50, web3.utils.fromUtf8("ADA"), {from: accounts[3]});

        //fill up the sell order book
        await dex.createLimitOrder(1, web3.utils.fromUtf8("ADA"), 5, 300, {from: accounts[1]});
        await dex.createLimitOrder(1, web3.utils.fromUtf8("ADA"), 5, 300, {from: accounts[2]});
        await dex.createLimitOrder(1, web3.utils.fromUtf8("ADA"), 5, 300, {from: accounts[3]});

        //create market order that should fill 2/3 orders in the book
        await dex.createMarketOrder(0, web3.utils.fromUtf8("ADA"), 10);

        orderbook = await dex.getOrderBook(web3.utils.fromUtf8("ADA"), 1); //get sell side orderbook
        assert(orderbook.length == 1, "Sell side orderbook should only have 1 order left");
        assert(orderbook[0].filled == 0, "Sell side order should have0 filled");
    })


    it("Market order should be filled until the order book is empty", async () => {
        let dex = await Dex.deployed();

        let orderbook = await dex.getOrderBook(web3.utils.fromUtf8("ADA"), 1); //get sell side orderbook
        assert(orderbook.length == 1, "Sell side orderbook should have 1 order left");

        //fill up the sell order book again
        await dex.createLimitOrder(1, web3.utils.fromUtf8("ADA"), 5, 400, {from: accounts[1]});
        await dex.createLimitOrder(1, web3.utils.fromUtf8("ADA"), 5, 500, {from: accounts[2]});

        //check buyer ada balance before ada purchase
        let balanceBefore = await dex.balances(accounts[0], web3.utils.fromUtf8("ADA"));

        //create market order that could fill more than the entire orderbook (15 ada)
        await dex.createMarketOrder(0, web3.utils.fromUtf8("ADA"), 50);

        //check buyer ada balance after the ada purchase
        let balanceAfter = await dex.balances(accounts[0], web3.utils.fromUtf8("ADA"));

        //buyer should have 15 more ada after, even though over was for 50
        assert.equal(balanceBefore.toNumber() +15, balanceAfter.toNumber());
    })


    it("the eth balance of the buyer should decrease with the filled amount", async () => {
        let dex = await Dex.deployed();
        let ada = await ADA.deployed();

        //seller deposits ada and creates a sell limit order for 1 ada for 300 wei
        await ada.approve(dex.address, 500, {from: accounts[1]});
        await dex.createLimitOrder(1, web3.utils.fromUtf8("ADA"), 1, 300, {from: accounts[1]});

        //check buyer ETH balance before trade
        let balanceBefore = await dex.balances(accounts[0], web3.utils.fromUtf8("ADA"));
        await dex.createMarketOrder(0, web3.utils.fromUtf8("ADA"), 1);
        let balanceAfter = await dex.balances(accounts[0], web3.utils.fromUtf8("ADA"));

        assert.equal(balanceBefore.toNumber() -300, balanceAfter.toNumber());
    })


    it("the token balance of the limit order sellers should decrease with the filled amounts", async() => {
        let dex = await Dex.deployed();
        let ada = await ADA.deployed();

        let orderbook = await dex.getOrderBook( web3.utils.fromUtf8("ADA"), 1);
        assert(orderbook.length == 0, "sell side orderbook should be empty at start of test");

        //seller account[2] deposits ada
        await ada.approve(dex.address, 500, {from: accounts[2]});
        await dex.deposit(100, web3.utils.fromUtf8("ADA"), {from: accounts[2]});

        await dex.createLimitOrder(1, web3.utils.fromUtf8("ADA"), 1, 300, {from: accounts[1]});
        await dex.createLimitOrder(1, web3.utils.fromUtf8("ADA"), 1, 400, {from: accounts[2]});

        //check sellers ada balances before trade
        let acc1BalanceBefore = await dex.balances(accounts[1], web3.utils.fromUtf8("ADA"));
        let acc2BalanceBefore = await dex.balances(accounts[2], web3.utils.fromUtf8("ADA"));
        
        //account[0] created market order to buy up both sell orders
        await dex.createMarketOrder(0, web3.utils.fromUtf8("ADA"), 2);

        //check sellers ada balances after trade 
        acc1BalanceAfter = await dex.balances(accounts[1], web3.utils.fromUtf8("ADA"));
        acc2BalanceAfter = await dex.balances(accounts[2], web3.utils.fromUtf8("ADA"));
        
        assert.equal(acc1BalanceAfter.toNumber(), -1, acc1BalanceBefore.toNumber());
        assert.equal(acc2BalanceAfter.toNumber(), -1, acc2BalanceBefore.toNumber());
    })

    
    it("filled limit orders should be removed from the orderbook", async () => {
        let dex = await Dex.deployed();
        let ada = await ADA.deployed();
        await dex.addToken(web3.utils.fromUtf8("ADA"), ada.address);

        //seller deposits ada and creates a sell limit order for 1 ada for 300 wei
        await ada.approve(dex.address, 500);
        await dex.deposit(50, web3.utils.fromUtf8("ADA"));

        await dex.depositEth({value: 10000});

        let orderbook = await dex.getOrderBook(web3.utils.fromUtf8("ADA"), 1); //get sell side orderbook

        await dex.createLimitOrder(1, web3.utils.fromUtf8("ADA"), 1, 300);
        await dex.createMarketOrder(0, web3.utils.fromUtf8("ADA"), 1);
        
        orderbook = await dex.getOrderBook(web3.utils.fromUtf8("ADA"), 1);
        assert(orderbook.length == 0, "sell side orderbook should be empty after trade");
    })

    
    it("limit orders filled properly should be set correctly after trade", async ()=>{
        let dex = await Dex.deployed();

        let orderbook = await dex.getOrderBook(web3.utils.fromUtf8("ADA"), 1); //sell side orderbook
        assert(orderbook.length == 0, "sell side orderbook should be empty at start of test");

        await dex.createLimitOrder(1, web3.utils.fromUtf8("ADA"), 5, 300, {from: accounts[1]});
        await dex.createMarketOrder(0, web3.utils.fromUtf8("ADA"), 2);

        orderbook = await dex.getOrderBook(web3.utils.fromUtf8("ADA"), 1);//sell side orderbook
        assert.equal(orderbook[0].filled, 2);
        assert.equal(orderbook[0].amount, 5);
    })


    it("should throw an error when creating a buy market order without adequate ETH balance", async () => {
        let dex = await Dex.deployed();

        let balance = await dex.balances(accounts[4], web3.utils.fromUtf8("ETH"))
        assert.equal( balance.toNumber(), 0, "initial eth balance is not 0");

        await dex.createLimitOrder(1, web3.utils.fromUtf8("ADA"), 5, 300, {from: accounts[1]});

        await truffleAssert.reverts(dex.createMarketOrder(0, web3.utils.fromUtf8("ADA"), 5, {from: accounts[4]}));
    })

 })