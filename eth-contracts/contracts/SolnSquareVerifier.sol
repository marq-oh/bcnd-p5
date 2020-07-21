// pragma solidity >=0.4.21 <0.6.0;
pragma solidity ^0.5.11;

import './ERC721Mintable.sol';
import './verifier.sol';
import "openzeppelin-solidity/contracts/utils/Address.sol";

// TODO define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>
contract SquareVerifier is Verifier {
}

// TODO define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class
contract SolnSquareVerifier is CustomERC721Token{

    SquareVerifier public verifier;

    constructor(address verifierAddress) CustomERC721Token() public{
        verifier = SquareVerifier(verifierAddress);
    }

    // TODO define a solutions struct that can hold an index & an address
    struct Solutions{
        address user;
        uint256 index;
        bytes32 key;
    }

    // TODO define a mapping to store unique solutions submitted
    mapping(bytes32 => address) public uniqueSolutions;

    // TODO define an array of the above struct
    Solutions[] solutionsArr;

    // TODO Create an event to emit when a solution is added
    event solutionAdded(address user, uint256 tokenId, bytes32 verifierKey);

    function getVerifierKey(uint[2] memory a, uint[2][2] memory b, uint[2] memory c, uint[2] memory input) pure public returns(bytes32) 
    {
        return keccak256(abi.encodePacked(a, b, c, input));
    }

    // TODO Create a function to add the solutions to the array and emit the event
    function addSolution(address user, uint256 tokenId, bytes32 key) public{
        solutionsArr.push(Solutions(user, tokenId, key));
        uniqueSolutions[key] = user;

        emit solutionAdded(user, tokenId, key);
    }

    // TODO Create a function to mint new NFT only after the solution has been verified
    //  - make sure the solution is unique (has not been used before)
    //  - make sure you handle metadata as well as tokenSupply
    event tokenMinted(address user, uint256 tokenId);

    function mintToken(address to, uint256 tokenId, uint[2] memory a, uint[2][2] memory b, uint[2] memory c, uint[2] memory input) public whenNotPaused
    {
        bytes32 verifierKey = getVerifierKey(a, b, c, input);
        require(verifier.verifyTx(a,b,c,input), "Solution incorrect.");
        require(uniqueSolutions[verifierKey] == address(0), "Solution not unique.");
        addSolution(to, tokenId, verifierKey);
        super.mint(to, tokenId);

        emit tokenMinted(to, tokenId);
    }
}