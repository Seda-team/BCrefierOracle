// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

interface IHasher {
  function mimc2(uint256 in0,uint256 in1) external returns(uint256);
}



contract MerkleTreeWithHistory {
  uint256 public constant FIELD_SIZE = 21888242871839275222246405745257275088548364400416034343698204186575808495617;
  uint256 public constant ZERO_VALUE = 21663839004416932945382355908790599225266501822907911457504978515578255421292; // = keccak256("tornado") % FIELD_SIZE
  IHasher public immutable hasher;

  uint32 public levels;

  // the following variables are made public for easier testing and debugging and
  // are not supposed to be accessed in regular code

  // filledSubtrees and roots could be bytes32[size], but using mappings makes it cheaper because
  // it removes index range check on every interaction
  mapping(uint256 => uint256) public filledSubtrees;
  mapping(uint256 => uint256) public roots;
  uint32 public constant ROOT_HISTORY_SIZE = 30;
  uint32 public currentRootIndex = 0;
  uint32 public nextIndex = 0;

  constructor(uint32 _levels, IHasher _hasher) {
    require(_levels > 0, "_levels should be greater than zero");
    require(_levels < 32, "_levels should be less than 32");
    levels = _levels;
    hasher = _hasher;

    for (uint32 i = 0; i < _levels; i++) {
      filledSubtrees[i] = zeros(i);
    }

    roots[0] = zeros(_levels - 1);
  }

  function _insert(uint256 _leaf) internal returns (uint32 index) {
    uint32 _nextIndex = nextIndex;
    require(_nextIndex != uint32(2)**levels, "Merkle tree is full. No more leaves can be added");
    uint32 currentIndex = _nextIndex;
    uint256 currentLevelHash = _leaf;
    uint256 left;
    uint256 right;

    for (uint32 i = 0; i < levels; i++) {
      if (currentIndex % 2 == 0) {
        left = currentLevelHash;
        right = zeros(i);
        filledSubtrees[i] = currentLevelHash;
      } else {
        left = filledSubtrees[i];
        right = currentLevelHash;
      }
      currentLevelHash = hasher.mimc2(left, right);
      currentIndex /= 2;
    }

    uint32 newRootIndex = (currentRootIndex + 1) % ROOT_HISTORY_SIZE;
    currentRootIndex = newRootIndex;
    roots[newRootIndex] = currentLevelHash;
    nextIndex = _nextIndex + 1;
    return _nextIndex;
  }

  /**
    @dev Whether the root is present in the root history
  */
  function isKnownRoot(uint256 _root) public view returns (bool) {
    if (_root == 0) {
      return false;
    }
    uint32 _currentRootIndex = currentRootIndex;
    uint32 i = _currentRootIndex;
    do {
      if (_root == roots[i]) {
        return true;
      }
      if (i == 0) {
        i = ROOT_HISTORY_SIZE;
      }
      i--;
    } while (i != _currentRootIndex);
    return false;
  }

  /**
    @dev Returns the last root
  */
  function getLastRoot() public view returns (uint256) {
    return roots[currentRootIndex];
  }

  /// @dev provides Zero (Empty) elements for a MiMC MerkleTree. Up to 32 levels
  function zeros(uint256 i) public pure returns (uint256) {
    if (i == 0) return 0;
    else if (i == 1) return 1;
    else if (i == 2) return 2;
    else if (i == 3) return 3;
    else if (i == 4) return 4;
    else if (i == 5) return 5;
    else if (i == 6) return 6;
    else if (i == 7) return 7;
    else if (i == 8) return 8;
    else if (i == 9) return 9;
    else if (i == 10) return 10;
    else if (i == 11) return 11;
    else if (i == 12) return 12;
    else if (i == 13) return 13;
    else if (i == 14) return 14;
    else if (i == 15) return 15;
    else if (i == 16) return 16;
    else if (i == 17) return 17;
    else if (i == 18) return 18;
    else if (i == 19) return 19;
    else if (i == 20) return 20;
    else if (i == 21) return 21;
    else if (i == 22) return 22;
    else if (i == 23) return 23;
    else if (i == 24) return 24;
    else if (i == 25) return 25;
    else if (i == 26) return 26;
    else if (i == 27) return 27;
    else if (i == 28) return 28;
    else if (i == 29) return 29;
    else if (i == 30) return 30;
    else if (i == 31) return 31;
    else revert("Index out of bounds");
  }
}