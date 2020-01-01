pragma solidity ^0.5.8;

import "./Verifier.sol";
import "./ERC721Mintable.sol";

// TODO define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>
contract TrustedSquareVerifier is Verifier {}

// TODO define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class
contract SolnSquareVerifier is ERC721Metadata {
    // TODO define a solutions struct that can hold an index & an address
    struct Solution {
        uint256 index;
        address addr;
    }

    // TODO define an array of the above struct
    Solution[] private solutions;

    // TODO define a mapping to store unique solutions submitted
    mapping(bytes32 => bool) private uniqueSolutions;

    // TODO Create an event to emit when a solution is added
    event SolutionAdded(uint256 index, address addr);

    TrustedSquareVerifier private verifier;

    constructor(address verifierAddress)
        public
        ERC721Metadata(
            "Capstone",
            "CAP",
            "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/"
        )
    {
        verifier = TrustedSquareVerifier(verifierAddress);
    }

    // TODO Create a function to add the solutions to the array and emit the event
    function addSolution(uint256 index, address addr) internal {
        Solution memory solution = Solution({index: index, addr: addr});
        solutions.push(solution);
        emit SolutionAdded(index, addr);
    }

    // TODO Create a function to mint new NFT only after the solution has been verified
    //  - make sure the solution is unique (has not been used before)
    //  - make sure you handle metadata as well as tokenSuplly
    function mintToken(
        uint256[2] calldata a,
        uint256[2][2] calldata b,
        uint256[2] calldata c,
        uint256[2] calldata input,
        address to,
        uint256 tokenId
    ) external {
        bytes32 solutionKey = bytes32(
            keccak256(abi.encodePacked(a, b, c, input))
        );
        require(
            !uniqueSolutions[solutionKey],
            "This solution is already registered"
        );
        require(
            verifier.verifyTx(a, b, c, input),
            "This solution is incorrect"
        );
        uniqueSolutions[solutionKey] = true;
        addSolution(tokenId, to);
        super.setTokenURI(tokenId);
        super._mint(to, tokenId);
    }
}
