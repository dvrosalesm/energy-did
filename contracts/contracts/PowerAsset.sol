// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract PowerAsset is ERC721 {

  address private _owner;
  uint256 public tokensCount;

  constructor() ERC721("PowerAsset", "PA") {
    _owner = address(msg.sender);
    tokensCount = 0;
  }

  function mintPowerAsset(address to) external  {
    require(_owner == address(msg.sender), "Unauthorized");
    tokensCount += 1;
    _safeMint(to, tokensCount);
  }

}
