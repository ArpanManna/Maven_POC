// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

interface IRegistry {
    event AccountCreated(
        address account,
        address indexed tokenContract,
        uint256 indexed tokenId
    );

    function createAccount(address tokenContract, uint256 tokenId)
        external
        returns (address);

    function account(address tokenContract, uint256 tokenId)
        external
        view
        returns (address);
}