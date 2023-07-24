// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "../node_modules/@openzeppelin/contracts/utils/Create2.sol";
import "./Bytecode.sol";


library MinimalProxyStore {
    error CreateError();
    error ContextOverflow();


    function getBytecode(address implementation, bytes memory context)
        internal
        pure
        returns (bytes memory)
    {
        return
            abi.encodePacked(
                hex"3d61", // RETURNDATASIZE, PUSH2
                uint16(0x2d + context.length + 1), // size of minimal proxy (45 bytes) + size of context + stop byte
                hex"8060", // DUP1, PUSH1
                uint8(0x0a + 1), // default offset (0x0a) + 1 byte because we increased size from uint8 to uint16
                hex"3d3981f3363d3d373d3d3d363d73", // standard EIP1167 implementation
                implementation, // implementation address
                hex"5af43d82803e903d91602b57fd5bf3", // standard EIP1167 implementation
                hex"00", // stop byte (prevents context from executing as code)
                context // appended context data
            );
    }


    function getContext(address instance) internal view returns (bytes memory) {
        uint256 instanceCodeLength = instance.code.length;

        return Bytecode.codeAt(instance, 46, instanceCodeLength);
    }


    function clone(address implementation, bytes memory context)
        internal
        returns (address instance)
    {
        // Generate bytecode for proxy
        bytes memory code = getBytecode(implementation, context);

        // Deploy contract using create
        assembly {
            instance := create(0, add(code, 32), mload(code))
        }

        // If address is zero, deployment failed
        if (instance == address(0)) revert CreateError();
    }


    function cloneDeterministic(
        address implementation,
        bytes memory context,
        bytes32 salt
    ) internal returns (address instance) {
        bytes memory code = getBytecode(implementation, context);

        // Deploy contract using create2
        assembly {
            instance := create2(0, add(code, 32), mload(code), salt)
        }

        // If address is zero, deployment failed
        if (instance == address(0)) revert CreateError();
    }
 
    /**
     * @dev Computes the address of a clone deployed using {MinimalProxyStore-cloneDeterministic}.
     */
    function predictDeterministicAddress(
        address implementation,
        bytes memory context,
        bytes32 salt,
        address deployer
    ) internal pure returns (address predicted) {
        bytes memory code = getBytecode(implementation, context);

        return Create2.computeAddress(salt, keccak256(code), deployer);
    }

    /**
     * @dev Computes the address of a clone deployed using {MinimalProxyStore-cloneDeterministic}.
     */
    function predictDeterministicAddress(
        address implementation,
        bytes memory context,
        bytes32 salt
    ) internal view returns (address predicted) {
        return
            predictDeterministicAddress(
                implementation,
                context,
                salt,
                address(this)
            );
    }
}