// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

interface OwnableInterface {
  function owner() external returns (address);

  function transferOwnership(address recipient) external;

  function acceptOwnership() external;
}