// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.2;

import '../libraries/safemath.sol';
import './MerkleTreeWithHistory.sol';
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/* This exchange is based off of Uniswap V1. The original whitepaper for the constant product rule
 * can be found here:
 * https://github.com/runtimeverification/verified-smart-contracts/blob/uniswap/uniswap/x-y-k.pdf
 */

interface IVerifier {
  function verifyProof(
            uint[2] memory a,
            uint[2][2] memory b,
            uint[2] memory c,
            uint[7] memory input
        ) external returns (bool r) ;
}

contract CreditOracle is MerkleTreeWithHistory, ReentrancyGuard {
    using SafeMath for uint256;
     mapping(uint256 => bool) public nullifierHashes;
  // we store all commitments just to prevent accidental deposits with the same commitment
    mapping(string => bool) public commitments;

    mapping(string => bool) public commitments_chose;

    IVerifier public immutable verifier;

    event Deposit(string commitment,address sender, uint32 leafIndex, uint256 timestamp);
    event Withdrawal(address to);

    constructor (
        IVerifier _verifier,
        IHasher _hasher,
        uint32 _merkleTreeHeight
    ) 
    MerkleTreeWithHistory(_merkleTreeHeight, _hasher)
    {
        verifier = _verifier;
    }

     function deposit(string memory _commitment) external payable returns(uint256) {
    require(!commitments[_commitment], "The commitment has been submitted");

    uint256 commitment = StringToUint(_commitment);

    uint32 insertedIndex = _insert(commitment);
    commitments[_commitment] = true;

    emit Deposit(_commitment, msg.sender,insertedIndex, block.timestamp);
    return commitment;
  }

    function haveCommitment(string memory commitment) public view returns (bool) {
        return commitments[commitment];
    }



    function withdraw(uint256[] memory p,string memory digest,string memory amount, string memory balance,string memory liquidition 
    ,uint[] memory op,string memory commitment )
        payable
        external
    {   
        //require(nullifierHashes[nullifier] == false, "The note has been already spent");
       
        //payable(_recipient).transfer(amount_eth_permanent.sub(amount_eth_permanent.mul(swap_fee_numerator).div(swap_fee_denominator)));
       require (!commitments_chose[commitment],"Confirmed");
       require(haveCommitment(commitment),"does not exist in the tree");
       uint[2] memory a ;
       uint[2][2] memory b ;
       uint[2] memory c;
       uint[7] memory input;

      commitments_chose[commitment] = true;

       a = [p[0],p[1]];b = [[p[2],p[3]],[p[4],p[5]]];c = [p[6],p[7]];
       
     
      input[0] = StringToUint(digest);input[1] = StringToUint(amount);input[2] = StringToUint(balance);
      input[3] = StringToUint(liquidition);input[4] = op[0];input[5] = op[1];
      input[6] = op[2];
         require(verifier.verifyProof(a,b,c,input),   
            "Invalid withdraw proof"
         );
         emit Withdrawal(msg.sender);
    }

    function StringToUint(string memory s) public pure returns (uint256) {
        bytes memory b = bytes(s);
        uint256 result = 0;
        for (uint256 i = 0; i < b.length; i++) {
            uint256 c = uint256(uint8(b[i]));
            if (c >= 48 && c <= 57) {
                result = result * 10 + (c - 48);
            }
        }
        return result;
    }
}