pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;

import "../contracts/wallet.sol";

contract Dex is Wallet {
using SafeMath for uint256;
    
    enum Side {
        Buy, 
        Sell 
    }

    //order.side = Side.Buy

    struct Order {
        uint256 id;
        address trader;
        Side side;
        bytes32 ticker;
        uint256 amount;
        uint256 price; //limit orders
        uint256 filled;
    }

    uint256 public nextOrderID = 0;

    mapping(bytes32 => mapping(uint256 => Order[])) orderBook;

    function getTokenList() public view returns(uint256){
        return TokenList.length;
    }

    function getOrderBook(bytes32 ticker, Side side) view public returns(Order[] memory){
        return orderBook[ticker][uint256(side)];
    }

    function createLimitOrder( Side side, bytes32 ticker, uint256 amount, uint256 price) public {

        if(side == Side.Buy){
            require(balances[msg.sender]["ETH"] >= amount.mul(price));
        }
        else if(side == Side.Sell){
            require(balances[msg.sender][ticker] >= amount);
        }
        Order[] storage orders = orderBook[ticker][uint256(side)];
        orders.push( Order(nextOrderID, msg.sender, side, ticker, amount, price, 0) );

        //Bubble Loop Algorithm to sort Buy and Sell orders
        uint256 i = orders.length > 0 ? orders.length -1 : 0;

        if(side == Side.Buy){
           while(i > 0){
               if(orders[i-1].price > orders[i].price){
                   break;
               }
               Order memory orderToMove = orders[i-1];
               orders[i - 1] = orders[i];
               orders[i] = orderToMove;
               i--;
           }
        }

        else if(side == Side.Sell){
            while(i > 0){
               if(orders[i - 1].price < orders[i].price){
                   break;
               }
               Order memory orderToMove = orders[i-1];
               orders[i - 1] = orders[i];
               orders[i] = orderToMove;
               i--;
           }
        }
        nextOrderID++;
}

     function createMarketOrder( Side side, bytes32 ticker, uint256 amount)public {
         if(side == Side.Sell){
            require(balances[msg.sender][ticker] >= amount, "insufficient balance");
         }
        
        uint256 orderBookSide;
        if(side == Side.Buy){
            orderBookSide = 1;
        }else{
            orderBookSide = 0;
        }

        Order[] storage orders = orderBook[ticker][orderBookSide];

        uint256 totalFilled = 0;

        //this loop will take us into the orderbook
        for(uint256 i = 0; i < orders.length && totalFilled < amount; i++){
            //how many existing orders can we fill with our new market order
            uint256 leftToFill = amount.sub(totalFilled);//amount minus totalFilled
            uint256 availableToFill = orders[i].amount.sub(orders[i].filled); // how much is available in this current order
            uint256 filled = 0;
            if( availableToFill > leftToFill  ){
                filled = leftToFill; // fill the entire market order
            }else{
                filled = availableToFill; // fill whats available in order[i]
            }
            totalFilled = totalFilled.add(filled);//update totalFilled
            orders[i].filled = orders[i].filled.add(filled);
            uint256 cost = filled.mul(orders[i].price);

            if(side == Side.Buy){
                //verfiy the buyer has enough eth to cover trade
                require(balances[msg.sender]["ETH"] >= cost, "You do not have enough ETH to cover trade");
                //transfer Eth from buyer to seller
                balances[msg.sender][ticker] = balances[msg.sender][ticker].add(filled);
                balances[msg.sender]["ETH"] = balances[msg.sender]["ETH"].sub(cost);
                //transfer tokens from seller to buyer
                balances[orders[i].trader][ticker] = balances[orders[i].trader][ticker].sub(filled);
                balances[orders[i].trader]["ETH"] = balances[orders[i].trader]["ETH"].add(cost);

            }else if(side == Side.Sell){
                //execute the trade
                balances[msg.sender][ticker] = balances[msg.sender][ticker].sub(filled);
                balances[msg.sender]["ETH"] = balances[msg.sender]["ETH"].add(cost);
    
                balances[orders[i].trader][ticker] = balances[orders[i].trader][ticker].add(filled);
                balances[orders[i].trader]["ETH"] = balances[orders[i].trader]["ETH"].sub(cost);
            }            

        }

            //Loop through order book and remove 100% filled orders
            while( orders.length > 0 && orders[0].filled == orders[0].amount ){
                //removing the top element by overwriting every element with the next element in the list
                for(uint256 i = 0; i < orders.length -1; i++){
                    orders[i] = orders[i +1];
                }
                orders.pop();
        }
     }

}