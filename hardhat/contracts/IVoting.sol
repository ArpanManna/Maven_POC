// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;


interface IVoting {
    function initializeVoting(uint, string memory, address[] calldata, uint) external; 
    function vote(uint, uint, uint) external;
}