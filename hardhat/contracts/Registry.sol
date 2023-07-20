// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./IRegistry.sol";
import "./MinimalProxyStore.sol";
import "./ERC6551Account.sol";

contract Registry is IRegistry {
    /**
     * @dev Address of the account implementation
     */
    address public immutable implementation;
    event AddressCreated(address indexed newAddress);

    constructor(address _implementation) {
        implementation = _implementation;
    }


    function createAccount(
        uint256 chainId,
        address tokenCollection,
        uint256 tokenId
    ) external returns (address) {
        return _createAccount(chainId, tokenCollection, tokenId);
    }


    function createAccount(
        address tokenCollection,
        uint256 tokenId
    ) external returns (address) {
        return _createAccount(block.chainid, tokenCollection, tokenId);
    }

    function account(
        uint256 chainId,
        address tokenCollection,
        uint256 tokenId
    ) external view returns (address) {
        return _account(chainId, tokenCollection, tokenId);
    }

    function account(
        address tokenCollection,
        uint256 tokenId
    ) external view returns (address) {
        return _account(block.chainid, tokenCollection, tokenId);
    }

    function _createAccount(
        uint256 chainId,
        address tokenCollection,
        uint256 tokenId
    ) internal returns (address) {
        bytes memory encodedTokenData = abi.encode(
            chainId,
            tokenCollection,
            tokenId
        );
        bytes32 salt = keccak256(encodedTokenData);
        address accountProxy = MinimalProxyStore.cloneDeterministic(
            implementation,
            encodedTokenData,
            salt
        );

        emit AccountCreated(accountProxy, tokenCollection, tokenId);

        return accountProxy;
    }

    function _account(
        uint256 chainId,
        address tokenCollection,
        uint256 tokenId
    ) internal view returns (address) {
        bytes memory encodedTokenData = abi.encode(
            chainId,
            tokenCollection,
            tokenId
        );
        bytes32 salt = keccak256(encodedTokenData);

        address accountProxy = MinimalProxyStore.predictDeterministicAddress(
            implementation,
            encodedTokenData,
            salt
        );

        return accountProxy;
    }
}