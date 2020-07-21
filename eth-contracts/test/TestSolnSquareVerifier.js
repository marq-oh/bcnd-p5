var SquareVerifier = artifacts.require("./verifier.sol");
var SolnSquareVerifier = artifacts.require("./SolnSquareVerifier.sol");

// - use the contents from proof.json generated from zokrates steps
const proof = require("../../zokrates/code/square/proof.json");

contract('SolnSquareVerifier', accounts => {

    const owner = accounts[0];
    const account_one = accounts[1];
    const account_two = accounts[2];

    // console.log(proof.proof.a);

    describe('Tests for SolnSquareVerifier', function () {
        beforeEach(async function () {
            this.verifier = await SquareVerifier.new({ from: owner });
            this.contract = await SolnSquareVerifier.new(this.verifier.address, { from: owner });
        })

        // Test if a new solution can be added for contract - SolnSquareVerifier
        it('Test if a new solution can be added for contract ', async function () {
            let eventEmitted = false;

            let verifierKey = await this.contract.getVerifierKey.call(proof.proof.a, proof.proof.b, proof.proof.c, proof.inputs);
            let addedEvent = await this.contract.addSolution(account_two, 99, verifierKey);

            if(addedEvent)
            {
                eventEmitted = true;
            }

            assert.equal(eventEmitted, true, "Solution not added");
        })

        // Test if an ERC721 token can be minted for contract - SolnSquareVerifier
        it('Test if an ERC721 token can be minted for contract', async function () {
            let eventEmitted = false;

            let mintingResultEvent = await this.contract.mintToken(account_two, 69, proof.proof.a, proof.proof.b, proof.proof.c, proof.inputs);           

            if(mintingResultEvent)
            {
                eventEmitted = true;
            }

            assert.equal(eventEmitted, true, "Minting unsuccessful");
        })

    });
})


