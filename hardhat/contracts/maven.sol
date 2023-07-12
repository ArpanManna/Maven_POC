// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";
import "../node_modules/@openzeppelin/contracts/utils/math/SafeMath.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "./Registry.sol";
import "./ERC6551Account.sol";

contract Maven is ERC721URIStorage, Registry{
    using Counters for Counters.Counter;
    using SafeMath for uint256;
    Counters.Counter private _projectIds; // keep track of projects created
    Counters.Counter private _projectIdsInBidding; // keep track of projects in bidding
    Counters.Counter private _tokenIds; // keep track of token Id
    uint stakePercentage = 5;
    address deployer;

    constructor(address _implementationContract) ERC721("Maven Protocol", "MVP") Registry(_implementationContract){
        deployer = msg.sender;
    }

    enum ProjectStatus{
        Bidding,
        InProgress,
        Completed
    }

    enum ProfileType{
        Client,
        Freelancer
    }

    struct Profile{
        address addr;
        string uri;
        ProfileType _type;
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
    }

    struct Bid{
        uint projectId;   // corresponding project Id
        address freelancer;  // freelancer address
        uint bidPrice;       // bid price
        uint deliveryTime;   // expected delivery date
        string proposalUri;  // URI of bid proposal 
        uint[] milestonePrices;   // price breakdown milestone-wise
        uint[] tokens;           // NFT token Ids for milestones
    }

    mapping(uint => Project) projectIdToProjectDetails;    // mapping of project Id to project details
    mapping(uint => Bid[]) projectIdToBids;   // mapping of projectId to bids
    mapping(address => mapping(uint => uint)) stakedAmount; // mapping of client Id to (project Id => staked amount)
    mapping(address => uint[]) projectProfiles;  // mapping of address to project Ids
    mapping(address => Profile) profile;
    mapping(uint => uint) public projectTokenId;   // mapping of project Id to nft token Id;
    mapping(uint => address) public tokenIds;      // mapping of token id to tba

    modifier onlyProjectOwner(uint projectId) {
        require(msg.sender == projectIdToProjectDetails[projectId].client, "Only project owner can call");
        _;
    }

    event ProjectCreated(uint projectId, address client);
    event FreeLancerSelected(uint projectId, address client, address freelancer);
    event PaymentReleased(uint projectId, uint milestoneId, uint amount, address freelancer);

    function createProfile(string memory _type, string memory _uri) public {
        require(profile[msg.sender].addr == address(0), "Profile already created!");
        if(compare(_type, "client")) profile[msg.sender] = Profile(msg.sender, _uri, ProfileType.Client);
        else if(compare(_type, "freelancer")) profile[msg.sender] = Profile(msg.sender, _uri, ProfileType.Freelancer);
    }

    function getProfile() public view returns(Profile memory) {
        require(profile[msg.sender].addr != address(0), "No such Profile address exists!");
        return profile[msg.sender];
    }

    function updateProfile(address _addr, string memory _uri) public {
        require(profile[msg.sender].addr != address(0), "Profile do not exist");
        profile[_addr] = Profile(msg.sender, _uri, profile[msg.sender]._type);
    }

    function createProject(string memory _uri, uint lbid, uint ubid, string memory _JDuri, uint deadline) external returns(uint){
        require(msg.sender != deployer, "Deployer Not eligible to create project");
        _projectIds.increment();
        uint newProjectId = _projectIds.current();
        projectIdToProjectDetails[newProjectId] = Project(newProjectId, msg.sender, address(0), lbid, ubid, _uri, _JDuri, block.timestamp, deadline + block.timestamp, 0, ProjectStatus.Bidding);
        _projectIdsInBidding.increment();
        projectProfiles[msg.sender].push(newProjectId);
        emit ProjectCreated(newProjectId, msg.sender);
        _tokenIds.increment();
        uint newTokenId = _tokenIds.current();
        _mint(msg.sender, newTokenId);
        projectTokenId[newProjectId] = newTokenId;
        _setTokenURI(newTokenId, _uri);
        address tba = _createAccount(block.chainid, address(this), newTokenId);
        tokenIds[newTokenId] = tba;
        return newProjectId;
    }

    // @dev - returns all projects that are in bidding state
    function getAllProjectsBidding() public view returns(Project[] memory){
        uint projectCount = _projectIdsInBidding.current();
        Project[] memory allProjects = new Project[](projectCount);
        uint curIndex = 0;
        for(uint i=1;i<=projectCount;i++){
            Project storage curItem = projectIdToProjectDetails[i];
            if(curItem.status == ProjectStatus.Bidding){
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
        for(uint i=0; i< bids.length; i++){
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

    function checkInBidderList(uint projectId, address freelancer) internal view returns(bool) {
        Bid[] memory bids = projectIdToBids[projectId];
        for(uint i=0; i< bids.length; i++){
            if(bids[i].freelancer == freelancer){
                return true;
            }
        }
        return false;
    }

    function bid(uint _projectId, uint bidPrice, uint time, string memory proposalUri, uint[] memory milestonePrices) public {
        require(_projectId <= _projectIds.current(), "Not a valid Project Id");
        require(projectIdToProjectDetails[_projectId].status != ProjectStatus.InProgress, "Bidding Completed");
        require(projectIdToProjectDetails[_projectId].status != ProjectStatus.Completed, "Project Completed");
        require(msg.sender != projectIdToProjectDetails[_projectId].client, "Client cannot bid for project");
        require(!checkAlreadyBid(_projectId, msg.sender), "Freelancer already bid for this project!");
        Bid memory newBid = Bid(_projectId, msg.sender, bidPrice, time, proposalUri, milestonePrices, new uint[](0));
        projectIdToBids[_projectId].push(newBid);
    }


    function updateBid(uint _projectId, uint bidId, uint _bidPrice, uint time, uint[] memory _milestonePrices) public {
        require(msg.sender == projectIdToBids[_projectId][bidId].freelancer, "Only Bid owner can update");
        require(projectIdToProjectDetails[_projectId].status == ProjectStatus.Bidding, "Project not in bidding state");
        Bid storage _bid = projectIdToBids[_projectId][bidId];
        _bid.bidPrice = _bidPrice;
        _bid.deliveryTime = time;
        _bid.milestonePrices = _milestonePrices;
    }

    function selectBid(uint projectId, address winnerBidder, uint bidId) external payable onlyProjectOwner(projectId){
        require(projectId <= _projectIds.current(), "Not a valid Project Id");
        require(checkInBidderList(projectId, winnerBidder), "This address is not a bidder");
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
        // transfer NFT ownership
        uint jobTokenId = projectTokenId[projectId];
        address tba = _account(block.chainid, address(this), jobTokenId);
        // create Milestones NFT
        uint maxMilestoneCount = projectIdToBids[projectId][bidId].milestonePrices.length;
        for(uint i=0; i< maxMilestoneCount; i++){
            _tokenIds.increment();
            uint newTokenId = _tokenIds.current();
            _mint(tba, newTokenId);
            projectIdToBids[projectId][bidId].tokens.push(newTokenId);
        }
        safeTransferFrom(msg.sender, winnerBidder, jobTokenId);
        projectProfiles[winnerBidder].push(projectId);
        emit FreeLancerSelected(projectId, msg.sender, winnerBidder);
    }

    // only client can call to process payment 
    function processMilestoneCompletion(uint projectId, uint milestoneIndex) public onlyProjectOwner(projectId){
        uint bidId = projectIdToProjectDetails[projectId].finalBidId;
        Bid memory _bid = projectIdToBids[projectId][bidId];
        require(milestoneIndex < _bid.milestonePrices.length, "Milestone Index not valid");
        uint amountToPay = _bid.milestonePrices[milestoneIndex];
        address freelancer = _bid.freelancer;
        payable(freelancer).transfer(amountToPay);
        if(milestoneIndex == _bid.milestonePrices.length - 1) {
            projectIdToProjectDetails[projectId].status = ProjectStatus.Completed;
        }
        emit PaymentReleased(projectId, milestoneIndex, amountToPay, freelancer);
    }

    function transferMilestoneOwnership(uint projectId, uint milestoneIndex) public {
        uint bidId = projectIdToProjectDetails[projectId].finalBidId;
        require(msg.sender == projectIdToBids[projectId][bidId].freelancer, "Sender is not the worker");
        address client = projectIdToProjectDetails[projectId].client;
        uint jobTokenId = projectTokenId[projectId];
        //address payable tba = _account(block.chainid, address(this), tokenId);
        address payable tba = payable(tokenIds[jobTokenId]);
        ERC6551Account ma = ERC6551Account(tba);
        uint milestoneTokenId = projectIdToBids[projectId][bidId].tokens[milestoneIndex];
        ma.transferERC721Tokens(address(this), client, milestoneTokenId);
    }


    // @dev returns the projects Ids corresponding to particular address
    // @dev client : projects, freelancers : projects working on
    function getProjectProfile() public view returns(uint[] memory){
        require(projectProfiles[msg.sender].length != 0, "Not a valid Client or Freelancer Profile");
        return projectProfiles[msg.sender];
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


    // transfer contract balance to contract address

}