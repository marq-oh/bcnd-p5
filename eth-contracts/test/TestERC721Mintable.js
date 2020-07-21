var CustomERC721Token = artifacts.require('CustomERC721Token');

contract('TestERC721Mintable', accounts => {

    const owner = accounts[0];
    const account_one = accounts[1];
    const account_two = accounts[2];

    // MSJ: Setting counts for test accounts
    const tokenCount1 = 5;
    const tokenCount2 = 10;

    describe('match erc721 spec', function () {
        beforeEach(async function () { 
            this.contract = await CustomERC721Token.new({from: owner});

            // TODO: mint multiple tokens
            for(let i = 0; i < tokenCount1; i++){
                await this.contract.mint(account_one, i + tokenCount1, {from: owner});
                // console.log(account_one + ': ' + i + tokenCount1);
            }
            
            for(let i = 0; i < tokenCount2; i++){
                await this.contract.mint(account_two, i + tokenCount2, {from: owner});
                // console.log(account_two + ': ' + i + tokenCount2);
            }
            
        })

        it('should return total supply', async function () { 
            const testTotalSupplyCount = tokenCount1 + tokenCount2;
            
            let totalSupply = await this.contract.totalSupply();
            
            assert.equal(Number(totalSupply), testTotalSupplyCount, "Total Supply incorrect");
        })

        it('should get token balance', async function () { 

            let bal_account_one = await this.contract.balanceOf.call(account_one);
            let bal_account_two = await this.contract.balanceOf.call(account_two);

            assert.equal(Number(bal_account_one), tokenCount1, "Incorrect token balance for test account one");
            assert.equal(Number(bal_account_two), tokenCount2, "Incorrect token balance for test account two");
        })

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () { 
            let testTokenId = 5;
            let expectedTokenURI =  "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/" + testTokenId;

            //_tokenURIs[tokenId] = strConcat(_baseTokenURI, strTokenID);

            let baseTokenURI = await this.contract.getBaseTokenURI.call({from: owner});
            let checkTokenURI = await this.contract.tokenURI.call(testTokenId, {from: owner});

            assert.equal(checkTokenURI, expectedTokenURI, "Incorrect Token URI");
        })

        it('should transfer token from one owner to another', async function () { 
            let testTokenId = 5;
            await this.contract.safeTransferFrom(account_one, account_two, testTokenId, {from: account_one});
            
            let checkOwner = await this.contract.ownerOf(testTokenId);

            assert.equal(checkOwner, account_two, "Token not transferred");                      
        })
    });

    describe('have ownership properties', function () {
        beforeEach(async function () { 
            this.contract = await CustomERC721Token.new({from: owner});
        })

        it('should fail when minting when address is not contract owner', async function () { 
            let result = true;
            
            try
            {
                await this.contract.mint(account_one, 999, {from: account_two});
            }
            catch
            {
                result = false;
            }
            
            assert.equal(result, false, "Non contract owner is able to mint");
        })

        it('should return contract owner', async function () { 
            let result = await this.contract.getOwner.call();

            assert.equal(result, owner, "Not contract owner");           
        })

    });
})