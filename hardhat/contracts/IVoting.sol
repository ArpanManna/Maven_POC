// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;


interface IVoting {
    function initializeVoting(uint, string memory, address[] calldata, uint, uint, address) external; 
    function vote(uint, uint, uint) external;
}