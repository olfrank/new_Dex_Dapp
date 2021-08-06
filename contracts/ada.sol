pragma solidity ^0.8.0;

import "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ADA is ERC20 {

    constructor() ERC20("Cardano", "ADA") {
        //mint to msg.sender(us)
        _mint(msg.sender, 100000);
    }

}  