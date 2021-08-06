pragma solidity ^0.8.0;

import "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract LINK is ERC20 {

    constructor() ERC20("Chainlink", "LINK") {
        //mint to msg.sender(us)
        _mint(msg.sender, 100000);
    }

}  