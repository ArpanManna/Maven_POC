// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";
import "../node_modules/@openzeppelin/contracts/utils/math/SafeMath.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "./Registry.sol";
import "./ERC6551Account.sol";
import "./IVoting.sol";

contract Maven is ERC721URIStorage, Registry{
    using Counters for Counters.Counter;
    using SafeMath for uint256;
    Counters.Counter private _projectIds; // keep track of projects created
    Counters.Counter public _projectIdsInBidding; // keep track of projects in bidding
    Counters.Counter public _projectIdsInDisputed; // keep track of projects in bidding
    Counters.Counter private _tokenIds; // keep track of token Id
    uint stakePercentage = 4;
    address deployer;

    constructor(address _implementationContract) ERC721("Maven Protocol", "MVP") Registry(_implementationContract){
        deployer = msg.sender;
    }

    enum ProjectStatus{
        Bidding,
        InProgress,
        Completed,
        Disputed
    }

    enum ProfileType{
        Client,
        Freelancer
    }

    enum MilestoneStatus{
        InProgress,
        OwnerShipTransferred,
        PaymentProcessed,
        Disputed
    }

    struct Profile{
        address addr;  // profile address
        string uri;    // profile URI
        ProfileType _type;  // client or freelancer ( @notice - validators  be added in future)
        uint tokenId;  // NFT id
        address tba;  // Profile Token Bound Address
    }

    struct Project{
        uint projectId;  // project ID
        address client;  // client address
        address freelancer;  // winning freelancer address
        uint lbid;   // initial bid (range lower)
        uint ubid;   // initial bid (range upper)
        string projectUri;   // uri corresponding to project details (title, description)
        string jdUri;        // uri corresponding to JD (id file attached)
        uint creationTime;   // time of creation
        uint deadline;    // project deadline
        uint finalBidId;     // after bidding
        ProjectStatus status;
        uint tokenId;
        address tba;
    }

    struct Bid{
        uint projectId;   // corresponding project Id
        address freelancer;  // freelancer address
        uint bidPrice;       // bid price
        uint deliveryTime;   // expected delivery date
        string proposalUri;  // URI of bid proposal 
        uint[] milestonePrices;   // price breakdown milestone-wise
        uint[] tokens;           // NFT token Ids for milestones
        MilestoneStatus[] status;      
    }

    mapping(uint => Project) projectIdToProjectDetails;    // mapping of project Id to project details
    mapping(uint => Bid[]) projectIdToBids;   // mapping of projectId to bids
    mapping(address => mapping(uint => uint)) stakedAmount; // mapping of client Id to (project Id => staked amount)
    mapping(address => uint[]) projectProfiles;  // mapping of address to project Ids
    mapping(address => Profile) profile;        // mapping of address to Profiles
    mapping(uint => uint) public projectTokenId;   // mapping of project Id to nft token Id;
    mapping(uint => address) tokenIds;      // mapping of token id to tba

    modifier onlyProjectOwner(uint projectId) {
        require(msg.sender == projectIdToProjectDetails[projectId].client, "Only project owner can call");
        _;
    }

    modifier profileExists(address _addr) {
        require(profile[_addr].tokenId != 0, "First create profile");
        _;
    }

    modifier validProject(uint projectId){
        require(projectId <= _projectIds.current(), "Not a valid Project Id");
        _;
    }

    modifier notDisputed(uint projectId){
        require(projectIdToProjectDetails[projectId].status != ProjectStatus.Disputed, "Project is in disputed State");
        _;
    }

    event ProjectCreated(address client, uint indexed projectId, uint indexed tokenId, address indexed tba);
    event BidCreated(uint indexed projectId, uint indexed bidId, address indexed bidder);
    event FreeLancerSelected(uint indexed projectId, address indexed client, address indexed freelancer);
    event PaymentReleased(uint indexed projectId, uint indexed milestoneId, uint indexed amount, address freelancer);
    event ProfileCreated(address indexed owner, uint indexed tokenId, address indexed tba);
    event MilestoneOwnershipTransferred(uint indexed projectId, uint milestoneIndex, address indexed from, address indexed to);
    event StakeTransferred(uint projectId, address indexed from, address indexed to, uint indexed amount);

    function createProfile(string memory _type, string memory _uri) public {
        require(profile[msg.sender].addr == address(0), "Profile already created!");
        (uint newTokenId, address tba) = mintTokenAndTba(msg.sender, _uri);
        tokenIds[newTokenId] = tba;
        if(compare(_type, "client")) profile[msg.sender] = Profile(msg.sender, _uri, ProfileType.Client, newTokenId, tba);
        else if(compare(_type, "freelancer")) profile[msg.sender] = Profile(msg.sender, _uri, ProfileType.Freelancer, newTokenId, tba);
        emit ProfileCreated(msg.sender, newTokenId, tba);
    }

    function getProfile(address _addr) public view returns(Profile memory) {
        require(profile[_addr].addr != address(0), "No such Profile address exists!");
        return profile[_addr];
    }

    // @dev - this function mints a new NFT id and Token Bound address
    function mintTokenAndTba(address _to, string memory _uri) internal returns(uint, address){
        _tokenIds.increment();
        uint newTokenId = _tokenIds.current();
        _mint(_to, newTokenId);
        _setTokenURI(newTokenId, _uri);
        address tba = _createAccount(block.chainid, address(this), newTokenId);
        return (newTokenId, tba);
    }

    function mintToken(address _to, string memory _uri) internal returns(uint){
        _tokenIds.increment();
        uint newTokenId = _tokenIds.current();
        _mint(_to, newTokenId);
        _setTokenURI(newTokenId, _uri);
        return (newTokenId);
    }
    function updateProfile(address _addr, string memory _uri) public {
        require(profile[msg.sender].addr != address(0), "Profile do not exist");
        profile[_addr] = Profile(msg.sender, _uri, profile[msg.sender]._type, profile[msg.sender].tokenId, profile[msg.sender].tba);
    }

    function createProject(string memory _uri, uint lbid, uint ubid, string memory _JDuri, uint deadline) external profileExists(msg.sender) returns(uint){
        require(msg.sender != deployer, "Deployer Not eligible to create project");
        _projectIds.increment();
        uint newProjectId = _projectIds.current();
        // create Project NFT and TBA
        (uint newTokenId, address tba) = mintTokenAndTba(profile[msg.sender].tba, _uri);
        projectIdToProjectDetails[newProjectId] = Project(newProjectId, msg.sender, address(0), lbid, ubid, _uri, _JDuri, block.timestamp, deadline, 0, ProjectStatus.Bidding, newTokenId, tba);
        _projectIdsInBidding.increment();
        projectProfiles[msg.sender].push(newProjectId);
        projectTokenId[newProjectId] = newTokenId;
        tokenIds[newTokenId] = tba;
        emit ProjectCreated(msg.sender, newProjectId, newTokenId, tba);
        return newProjectId;
    }

    // @dev - returns all projects that are in bidding state
    function getAllProjectsBidding() public view returns(Project[] memory){
        uint projectCountInBid = _projectIdsInBidding.current();
        uint totalCount = _projectIds.current();
        Project[] memory allProjects = new Project[](projectCountInBid);
        uint curIndex = 0;
        for(uint i=1;i<=totalCount;++i){
            Project memory curItem = projectIdToProjectDetails[i];
            if(curItem.status == ProjectStatus.Bidding){
                allProjects[curIndex] = curItem;
                curIndex += 1;
            }
        }
        return allProjects;
    }
        // @dev - returns all projects that are in disputed state
    function getAllProjectsDisputed() public view returns(Project[] memory){
        uint projectCountInDisputed = _projectIdsInDisputed.current();
        uint totalCount = _projectIds.current();
        Project[] memory allProjects = new Project[](projectCountInDisputed);
        uint curIndex = 0;
        for(uint i=1;i<=totalCount;++i){
            Project memory curItem = projectIdToProjectDetails[i];
            if(curItem.status == ProjectStatus.Disputed){
                allProjects[curIndex] = curItem;
                curIndex += 1;
            }
        }
        return allProjects;
    }

    function getProjectDetails(uint projectId) public view returns(Project memory){
        return projectIdToProjectDetails[projectId];
    }

    function getBidDetails(uint projectId, uint bidId) public view returns(Bid memory){
        return projectIdToBids[projectId][bidId];
    }

    function showAllBidsProject(uint projectId) public view returns(Bid[] memory){
        return projectIdToBids[projectId];
    }
    function checkAlreadyBid(uint projectId, address freelancer) internal view returns(bool) {
        Bid[] memory bids = projectIdToBids[projectId];
        uint totalBid = bids.length;
        for(uint i=0; i< totalBid; ++i){
            if(bids[i].freelancer == freelancer){
                return true;
            }
        }
        return false;
    }

    // @dev - this returns returns total bids of a project
    function getTotalBid(uint projectId) public view returns(uint){
        return projectIdToBids[projectId].length;
    }

    function bid(uint _projectId, uint bidPrice, uint time, string memory proposalUri, uint[] memory milestonePrices) public profileExists(msg.sender) validProject(_projectId){
        require(projectIdToProjectDetails[_projectId].status != ProjectStatus.InProgress, "Bidding Completed");
        require(projectIdToProjectDetails[_projectId].status != ProjectStatus.Completed, "Project Completed");
        require(msg.sender != projectIdToProjectDetails[_projectId].client, "Client cannot bid for project");
        require(!checkAlreadyBid(_projectId, msg.sender), "Freelancer already bid for this project!");
        Bid memory newBid = Bid(_projectId, msg.sender, bidPrice, time, proposalUri, milestonePrices, new uint[](0), new MilestoneStatus[](0));
        projectIdToBids[_projectId].push(newBid);
        emit BidCreated(_projectId, projectIdToBids[_projectId].length-1, msg.sender);
    }


    function updateBid(uint _projectId, uint bidId, uint _bidPrice, uint time, uint[] memory _milestonePrices) public {
        require(msg.sender == projectIdToBids[_projectId][bidId].freelancer, "Only Bid owner can update");
        require(projectIdToProjectDetails[_projectId].status == ProjectStatus.Bidding, "Project not in bidding state");
        Bid storage _bid = projectIdToBids[_projectId][bidId];
        _bid.bidPrice = _bidPrice;
        _bid.deliveryTime = time;
        _bid.milestonePrices = _milestonePrices;
    }

    function selectBid(uint projectId, address winnerBidder, uint bidId) external payable onlyProjectOwner(projectId) validProject(projectId){
        require(checkAlreadyBid(projectId, winnerBidder), "This address is not a bidder");
        Project storage project = projectIdToProjectDetails[projectId];
        require(project.status != ProjectStatus.InProgress, "Project Already started");
        require(project.status != ProjectStatus.Completed, "Project Completed");
        uint bidPrice = projectIdToBids[projectId][bidId].bidPrice;
        uint staked = SafeMath.div(SafeMath.mul(bidPrice, stakePercentage), 100);
        require(msg.value >= bidPrice + staked, "Should stake equal to bid amount + staked amount");
        stakedAmount[msg.sender][projectId] = staked;
        project.freelancer = winnerBidder;
        project.finalBidId = bidId;
        project.status = ProjectStatus.InProgress;
        _projectIdsInBidding.decrement();
        uint jobTokenId = projectTokenId[projectId];
        //address tba = _account(block.chainid, address(this), jobTokenId);
        address tba = tokenIds[jobTokenId];
        // create Milestones NFT
        uint maxMilestoneCount = projectIdToBids[projectId][bidId].milestonePrices.length;
        for(uint i=0; i< maxMilestoneCount; ++i){
            uint newTokenId = mintToken(tba, "");
            projectIdToBids[projectId][bidId].tokens.push(newTokenId);
            projectIdToBids[projectId][bidId].status.push(MilestoneStatus.InProgress);
        }
        //safeTransferFrom(profile[msg.sender].tba, profile[winnerBidder].tba, jobTokenId);
        ERC6551Account ma = ERC6551Account(payable(profile[msg.sender].tba));
        ma.transferERC721Tokens(address(this), profile[winnerBidder].tba, jobTokenId);
        projectProfiles[winnerBidder].push(projectId);
        emit FreeLancerSelected(projectId, msg.sender, winnerBidder);
    }

    // only client can call to process payment 
    function processMilestoneCompletion(uint projectId, uint milestoneIndex) public onlyProjectOwner(projectId) notDisputed(projectId){
        uint bidId = projectIdToProjectDetails[projectId].finalBidId;
        Bid memory _bid = projectIdToBids[projectId][bidId];
        require(milestoneIndex < _bid.milestonePrices.length, "Milestone Index not valid");
        require(ownerOf(projectIdToBids[projectId][bidId].tokens[milestoneIndex]) == profile[msg.sender].tba, "Milestone ownership not transfered");
        uint amountToPay = _bid.milestonePrices[milestoneIndex];
        address freelancer = _bid.freelancer;
        payable(freelancer).transfer(amountToPay);
        if(milestoneIndex == _bid.milestonePrices.length - 1) {
            projectIdToProjectDetails[projectId].status = ProjectStatus.Completed;
            uint staked = stakedAmount[msg.sender][projectId];
            payable(msg.sender).transfer(staked);
            emit StakeTransferred(projectId, address(this), msg.sender, staked);
        }
        projectIdToBids[projectId][bidId].status[milestoneIndex] = MilestoneStatus.PaymentProcessed;
        emit PaymentReleased(projectId, milestoneIndex, amountToPay, freelancer);
    }

    function transferMilestoneOwnership(uint projectId, uint milestoneIndex) public notDisputed(projectId){
        uint bidId = projectIdToProjectDetails[projectId].finalBidId;
        require(msg.sender == projectIdToBids[projectId][bidId].freelancer, "Sender is not the worker");
        address client = projectIdToProjectDetails[projectId].client;
        uint jobTokenId = projectTokenId[projectId];
        //address payable tba = _account(block.chainid, address(this), tokenId);
        // get profile tba
        address payable tba = payable(tokenIds[jobTokenId]);
        ERC6551Account ma = ERC6551Account(tba);
        uint milestoneTokenId = projectIdToBids[projectId][bidId].tokens[milestoneIndex];
        ma.transferERC721Tokens(address(this), profile[client].tba, milestoneTokenId);
        projectIdToBids[projectId][bidId].status[milestoneIndex] = MilestoneStatus.OwnerShipTransferred;
        emit MilestoneOwnershipTransferred(projectId, milestoneIndex, tba, profile[client].tba);
    }


    // @dev returns the projects Ids corresponding to particular address
    // @dev client : projects, freelancers : projects working on
    function getProjectProfile(address _addr) public view returns(uint[] memory){
        require(projectProfiles[_addr].length != 0, "Not a valid Client or Freelancer Profile");
        return projectProfiles[_addr];
    }

    function getTBA(uint tokenId) public view returns(address) {
        return tokenIds[tokenId];
    }

    function initializeDispute(address _votingContract, uint projectId, string memory _disputeReasonUri, address[] calldata toBeWhitelisted, uint _chainLinkVRFData) public {
        _projectIdsInDisputed.increment();
        uint jobTokenId = projectTokenId[projectId];
        address payable tba = payable(ownerOf(jobTokenId));
        ERC6551Account ma = ERC6551Account(tba);
        ma.transferERC721Tokens(address(this), _votingContract, jobTokenId);
        IVoting(_votingContract).initializeVoting(projectId, _disputeReasonUri, toBeWhitelisted, _chainLinkVRFData, jobTokenId, tba);
        projectIdToProjectDetails[projectId].status = ProjectStatus.Disputed;
    }

    // function resolveDispute(address _votingContract, uint projectId, uint milestoneIndex) public {
    //     uint jobTokenId = projectTokenId[projectId];
    //     address payable tba = payable(tokenIds[jobTokenId]);
    //     ERC6551Account ma = ERC6551Account(tba);
    //     uint bidId = projectIdToProjectDetails[projectId].finalBidId;
    //     uint milestoneTokenId = projectIdToBids[projectId][bidId].tokens[milestoneIndex];
    //     ma.transferERC721Tokens(address(this), , milestoneTokenId);
    //     //projectIdToBids[projectId][bidId].status[milestoneIndex] = MilestoneStatus.Completed;
    //     projectIdToProjectDetails[projectId].status = ProjectStatus.Completed;
    //     _projectIdsInDisputed.decrement();
    // }

    function transferToken(address from, address to, uint tokenId) public payable{
        //address payable tba = payable(ownerOf(jobTokenId));
        ERC6551Account ma = ERC6551Account(payable(from));
        ma.transferERC721Tokens(from, to, tokenId);
    }

    // internal string matching function
    function compare(string memory str1, string memory str2) internal pure returns (bool) {
        return keccak256(abi.encodePacked(str1)) == keccak256(abi.encodePacked(str2));
    }

    fallback() external payable{}
    receive() external payable{}

    // get balance of this contract
    function getBalance() public view returns(uint) {
        return address(this).balance;
    }

    // transfer contract balance to arbitrary address
    function transferToArbitaryAddress(address _addr, uint amount) public{
        payable(_addr).transfer(amount);
    }

}