pragma solidity ^0.8.0;

import "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract VET is ERC20 {

    constructor() ERC20("VeChain", "VET") {
        //mint to msg.sender(us)
        _mint(msg.sender, 100000);
    }

}  