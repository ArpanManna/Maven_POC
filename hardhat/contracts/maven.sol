// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";
import "../node_modules/@openzeppelin/contracts/utils/math/SafeMath.sol";


contract Maven {
    using Counters for Counters.Counter;
    using SafeMath for uint256;
    Counters.Counter private _projectIds; // keep track of projects created
    uint stakePercentage = 5;

    struct Project{
        uint projectId;  // project ID
        address client;  // client address
        address freelancer;  // winning freelancer address
        uint lbid;   // initial bid (range lower)
        uint ubid;   // initial bid (range upper)
        string projectUri;   // uri corresponding to project details (title, description)
        string jdUri;        // uri corresponding to JD (id file attached)
        uint finalBidId;     // after bidding
    }

    struct Bid{
        uint projectId;   // corresponding project Id
        address freelancer;  // freelancer address
        uint bidPrice;       // bid price
        uint deliveryTime;   // expected delivery date
        string proposalUri;  // URI of bid proposal 
        uint[] milestonePrices;   // price breakdown milestone-wise
    }

    mapping(uint => Project) projectIdToProjectDetails;    // mapping of project Id to project details
    mapping(uint => Bid[]) projectIdToBids;   // mapping of projectId to bids
    mapping(address => mapping(uint => uint)) stakedAmount; // mapping of client Id to (project Id => staked amount)

    modifier onlyProjectOwner(uint projectId) {
        require(msg.sender == projectIdToProjectDetails[projectId].client, "Only project owner can call");
        _;
    }

    event ProjectCreated(uint projectId, address client);

    function createProject(string memory _uri, uint lbid, uint ubid, string memory _JDuri) external returns(uint){
        _projectIds.increment();
        uint newProjectId = _projectIds.current();
        projectIdToProjectDetails[newProjectId] = Project(newProjectId, msg.sender, address(0), lbid, ubid, _uri, _JDuri, 0);
        emit ProjectCreated(newProjectId, msg.sender);
        return newProjectId;
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

    function bid(uint _projectId, uint bidPrice, uint time, string memory proposalUri, uint[] memory milestonePrices) public {
        require(msg.sender != projectIdToProjectDetails[_projectId].client, "Client cannot bid for project");
        Bid memory newBid = Bid(_projectId, msg.sender, bidPrice, time, proposalUri, milestonePrices);
        projectIdToBids[_projectId].push(newBid);
    }


    function updateBid(uint _projectId, uint bidId, uint _bidPrice, uint time, uint[] memory _milestonePrices) public {
        require(msg.sender == projectIdToBids[_projectId][bidId].freelancer, "Only Bid owner can update");
        projectIdToBids[_projectId][bidId].bidPrice = _bidPrice;
        projectIdToBids[_projectId][bidId].deliveryTime = time;
        projectIdToBids[_projectId][bidId].milestonePrices = _milestonePrices;
    }

    function selectBid(uint projectId, address winnerBidder, uint bidId) public payable onlyProjectOwner(projectId){
        //require(msg.value >= projectIdToBids[projectId][bidId].bidPrice, "Should stake equal to bid amount + staked amount");
        uint bidPrice = projectIdToBids[projectId][bidId].bidPrice;
        uint staked = bidPrice.mul(stakePercentage).div(100);
        //uint staked = msg.value - projectIdToBids[projectId][bidId].bidPrice;
        require(msg.value >= bidPrice + staked, "Should stake equal to bid amount + staked amount");
        stakedAmount[msg.sender][projectId] = staked;
        projectIdToProjectDetails[projectId].freelancer = winnerBidder;
        projectIdToProjectDetails[projectId].finalBidId = bidId;
    }

    // only client can call to process payment 
    function processMilestoneCompletion(uint projectId, uint milestoneIndex) public onlyProjectOwner(projectId){
        uint bidId = projectIdToProjectDetails[projectId].finalBidId;
        uint amountToPay = projectIdToBids[projectId][bidId].milestonePrices[milestoneIndex];
        payable(msg.sender).transfer(amountToPay);
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