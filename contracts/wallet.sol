pragma solidity ^0.8.0;

import "../node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../node_modules/@openzeppelin/contracts/utils/math/SafeMath.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";

contract Wallet is Ownable{
    using SafeMath for uint256;

    struct Token {
        bytes32 ticker;  
        address tokenAddress;
    }
    mapping(bytes32 => Token) public tokenMapping;
    bytes32[] public TokenList;
    mapping(address => mapping(bytes32 => uint256)) public balances;

    modifier tokenExists(bytes32 ticker) {
        require(tokenMapping[ticker].tokenAddress != address(0), "Token does not exist");
        _;
    }

    function addToken(bytes32 ticker, address tokenAddress) onlyOwner external {
        //save the ticker to our mapping, be equal to new token with a ticker and address
        tokenMapping[ticker] = Token(ticker, tokenAddress);
        //just want a list of all the ID's
        TokenList.push(ticker);
    }

    function deposit(uint amount, bytes32 ticker) tokenExists(ticker) external{
        //transfer from msg.sender to us
        IERC20(tokenMapping[ticker].tokenAddress).transferFrom(msg.sender, address(this), amount);
        balances[msg.sender][ticker] = balances[msg.sender][ticker].add(amount);
    }

    function withdraw(uint amount, bytes32 ticker) tokenExists(ticker) external{
        //make sure the token exists
        require(balances[msg.sender][ticker] >= amount, "Balance not sufficient");
        //adjust the balances before
        balances[msg.sender][ticker] = balances[msg.sender][ticker].sub(amount);
        //input the address (token address for the ticker) and transfer from us to the msg.sender 
        //msg.sender is the rightfull owner of the tokens
        IERC20(tokenMapping[ticker].tokenAddress).transfer(msg.sender, amount);
    }

    function depositEth() payable external {
        require(msg.value > 0, "depositEth: msg.value should be higher than zero");
        balances[msg.sender][bytes32("ETH")] = balances[msg.sender][bytes32("ETH")].add(msg.value);
    }
    
    function withdrawEth(uint amount) external {
        require(balances[msg.sender][bytes32("ETH")] >= amount,'Insufficient balance'); 
        balances[msg.sender][bytes32("ETH")] = balances[msg.sender][bytes32("ETH")].sub(amount);
        msg.sender.call{value:amount}("");
        
    }

}