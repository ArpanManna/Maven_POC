// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "../node_modules/@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "../node_modules/@openzeppelin/contracts/interfaces/IERC1271.sol";
import "../node_modules/@openzeppelin/contracts/utils/cryptography/SignatureChecker.sol";
import "../node_modules/@openzeppelin/contracts/utils/introspection/IERC165.sol";
import "./MinimalReceiver.sol";
import "./IAccount.sol";
import "./MinimalProxyStore.sol";


contract ERC6551Account is IERC165, IERC1271, IAccount, MinimalReceiver {
    error NotAuthorized();
    error AccountLocked();
    error ExceedsMaxLockTime();

    uint256 public unlockTimestamp;
    mapping(address => address) public executor;

    event LockUpdated(uint256 timestamp);
    event NFTTransferred(address from, address to, uint256 tokenId);
    event ERC2OTokenTransferred(address from, address to, uint256 tokenId);
    event ERC20Approval(address indexed owner, address indexed spender,uint256 value);
    event ERC721Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);


    modifier onlyUnlocked() {
        if (unlockTimestamp > block.timestamp) revert AccountLocked();
        _;
    }

    modifier onlyOwner() {
        _checkOwner();
        _;
    }

    function _checkOwner() internal view virtual {
        address _owner = owner();
        if (msg.sender != _owner) revert NotAuthorized();
    }

    fallback(bytes calldata data) external payable onlyUnlocked returns (bytes memory result) {
        address _owner = owner();
        address _executor = executor[_owner];
        // accept funds if executor is undefined or cannot be called
        if (_executor.code.length == 0) return "";
        return _call(_executor, 0, data);
    }

    function executeCall(address to, uint256 value, bytes calldata data) external payable onlyUnlocked returns (bytes memory result) {
        address _owner = owner();
        if (msg.sender != _owner) revert NotAuthorized();
        return _call(to, value, data);
    }

    // Transfer an NFT from this contract to another address
    function transferERC721Tokens(address tokenCollection, address to, uint256 tokenId) external onlyUnlocked {
        IERC721 nftContract = IERC721(tokenCollection);
        require(nftContract.ownerOf(tokenId) == address(this), "NFTHandler: Sender is not the owner");
        nftContract.safeTransferFrom(address(this), to, tokenId);
        emit NFTTransferred(address(this), to, tokenId);
    }

    // Approve spender for your nft
    function ApproveERC721Tokens(address tokenCollection, address spender, uint256 tokenId) external onlyUnlocked onlyOwner {
        IERC721 nftContract = IERC721(tokenCollection);
        require(nftContract.ownerOf(tokenId) == address(this), "NFTHandler: Sender is not the owner");
        // Transfer the NFT to the specified address
        nftContract.approve(spender, tokenId);
        // Emit the ERC721Approval event
        emit ERC721Approval(address(this), spender, tokenId);
    }

    // Transfer an NFT from on behalf ofowner to another address
    function transferERC721TokensFrom(address tokenCollection, address from, address to, uint256 tokenId) external onlyUnlocked onlyOwner {
        IERC721 nftContract = IERC721(tokenCollection);
        require(nftContract.getApproved(tokenId) == address(this), "NFTHandler: Sender is not approved");
        nftContract.safeTransferFrom(from, to, tokenId);
        // Emit the NFTTransferred event
        emit NFTTransferred(from, to, tokenId);
    }


    function executeTrustedCall(address to, uint256 value, bytes calldata data) external payable onlyUnlocked returns (bytes memory result) {
        address _executor = executor[owner()];
        if (msg.sender != _executor) revert NotAuthorized();
        return _call(to, value, data);
    }

    function executeCrossChainCall(address to, uint256 value, bytes calldata data) external payable onlyUnlocked returns (bytes memory result) {
        (uint256 chainId, , ) = context();
        if (chainId == block.chainid) {
            revert NotAuthorized();
        }
        return _call(to, value, data);
    }


    function setExecutor(address _executionModule) external onlyUnlocked {
        address _owner = owner();
        if (_owner != msg.sender) revert NotAuthorized();
        executor[_owner] = _executionModule;
    }


    function lock(uint256 _unlockTimestamp) external onlyUnlocked {
        if (_unlockTimestamp > block.timestamp + 365 days)
            revert ExceedsMaxLockTime();
        address _owner = owner();
        if (_owner != msg.sender) revert NotAuthorized();
        unlockTimestamp = _unlockTimestamp;
        emit LockUpdated(_unlockTimestamp);
    }

    function isLocked() external view returns (bool) {
        return unlockTimestamp > block.timestamp;
    }


    function isAuthorized(address caller) external view returns (bool) {
        (, address tokenCollection, uint256 tokenId) = context();
        address _owner = IERC721(tokenCollection).ownerOf(tokenId);
        if (caller == _owner) return true;
        address _executor = executor[_owner];
        if (caller == _executor) return true;
        return false;
    }

    function isValidSignature(bytes32 hash, bytes memory signature) external view returns (bytes4 magicValue) {
        if (unlockTimestamp > block.timestamp) return "";
        address _owner = owner();
        address _executor = executor[_owner];
        if (_executor != address(0) && SignatureChecker.isValidSignatureNow(_executor, hash, signature)) {
            return IERC1271.isValidSignature.selector;
        }
        // Default - check if signature is valid for account owner
        if (SignatureChecker.isValidSignatureNow(_owner, hash, signature)) {
            return IERC1271.isValidSignature.selector;
        }

        return "";
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(IERC165, ERC1155Receiver) returns (bool) {
        // default interface support
        if (interfaceId == type(IAccount).interfaceId ||
            interfaceId == type(IERC1155Receiver).interfaceId ||
            interfaceId == type(IERC165).interfaceId) {
            return true;
        }
        address _executor = executor[owner()];
        if (_executor == address(0) || _executor.code.length == 0) {
            return false;
        }

        // if interface is not supported by default, check executor
        try IERC165(_executor).supportsInterface(interfaceId) returns (bool _supportsInterface) {
            return _supportsInterface;
        } catch {
            return false;
        }
    }


    function owner() public view returns (address) {
        (uint256 chainId, address tokenCollection, uint256 tokenId) = context();
        if (chainId != block.chainid) {
            return address(0);
        }
        return IERC721(tokenCollection).ownerOf(tokenId);
    }


    function token() public view returns (address tokenCollection, uint256 tokenId){
        (, tokenCollection, tokenId) = context();
    }

    function context() internal view returns (uint256, address, uint256) {
        bytes memory rawContext = MinimalProxyStore.getContext(address(this));
        if (rawContext.length == 0) return (0, address(0), 0);
        return abi.decode(rawContext, (uint256, address, uint256));
    }

    function _call(address to, uint256 value, bytes calldata data) internal returns (bytes memory result) {
        bool success;
        (success, result) = to.call{value: value}(data);
        if (!success) {
            assembly {
                revert(add(result, 32), mload(result))
            }
        }
    }
}