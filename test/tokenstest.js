const ERC20 = {
    link: artifacts.require("LINK"),
    ada: artifacts.require("ADA"),
    vet: artifacts.require("VET")
}

const Wallet = artifacts.require("Wallet");

const {
    BN,           // Big Number support
    constants,    // Common constants, like the zero address and largest integers
    expectEvent,  // Assertions for emitted events
    expectRevert, // Assertions for transactions that should fail
  } = require('@openzeppelin/test-helpers');
  
  //track balance
  const balance = require('@openzeppelin/test-helpers/src/balance');
  
  // Main function that is executed during the test
  contract.skip("ERC20", ([owner, alfa, beta, charlie]) => {
    // Global variable declarations
    let linkInstance;
    let adaInstance;
    let vetInstance;
    let walletInstance;
    let _ticker;

    //set contracts instances
    before(async function() {
        // Deploy tokens to testnet
        linkInstance = await ERC20.link.new();
        adaInstance = await ERC20.ada.new();
        vetInstance = await ERC20.vet.new();
        walletInstance = await Wallet.new();

        console.log("LINK ",linkInstance.address);
        console.log("ADA ",adaInstance.address);
        console.log("VET ", vetInstance.address)
        console.log("WALLET ",walletInstance.address);
    });

    describe("ERC20", () => {

        it("1. get totalSupply", async function (){
            await linkInstance.totalSupply();
            await adaInstance.totalSupply();
            await vetInstance.totalSupply();
          });
        
        it("2. addTokens to wallet, show link contract address", async function (){
            _ticker = await linkInstance.symbol();
            _ticker = web3.utils.fromUtf8( _ticker);
            await walletInstance.addToken( _ticker, linkInstance.address);

            _ticker = await adaInstance.symbol();
            _ticker = web3.utils.fromUtf8( _ticker);
            await walletInstance.addToken( _ticker, adaInstance.address);

            _ticker = await vetInstance.symbol();
            _ticker = web3.utils.fromUtf8( _ticker);
            await walletInstance.addToken( _ticker, vetInstance.address);


        });

        it("3. approve token", async function (){
            _ticker = await linkInstance.symbol();
            _ticker = web3.utils.fromUtf8( _ticker);
            await linkInstance.approve( walletInstance.address , 1000 ,{from: owner});

            _ticker = await adaInstance.symbol();
            _ticker = web3.utils.fromUtf8( _ticker);
            await adaInstance.approve( walletInstance.address , 1000 ,{from: owner});

            _ticker = await vetInstance.symbol();
            _ticker = web3.utils.fromUtf8( _ticker);
            await vetInstance.approve( walletInstance.address , 1000 ,{from: owner});

        });

        it("4. deposit tokens to Wallet from owner", async function (){
            _ticker = await linkInstance.symbol();
            _ticker = web3.utils.fromUtf8( _ticker);
            await walletInstance.depositToken( 100 ,_ticker ,{from: owner});
        });

    })// end describe

  })//end contract