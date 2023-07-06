// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";
import "../node_modules/@openzeppelin/contracts/utils/math/SafeMath.sol";


contract Maven {
    using Counters for Counters.Counter;
    using SafeMath for uint256;
    Counters.Counter private _projectIds; // keep track of projects created
    Counters.Counter private _projectIdsInBidding; // keep track of projects in bidding
    uint stakePercentage = 5;

    enum ProjectStatus{
        Bidding,
        InProgress,
        Completed
    }

    struct Project{
        uint projectId;  // project ID
        address client;  // client address
        address freelancer;  // winning freelancer address
        uint lbid;   // initial bid (range lower)
        uint ubid;   // initial bid (range upper)
        string projectUri;   // uri corresponding to project details (title, description)
        string jdUri;        // uri corresponding to JD (id file attached)
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
    }

    mapping(uint => Project) projectIdToProjectDetails;    // mapping of project Id to project details
    mapping(uint => Bid[]) projectIdToBids;   // mapping of projectId to bids
    mapping(address => mapping(uint => uint)) stakedAmount; // mapping of client Id to (project Id => staked amount)

    modifier onlyProjectOwner(uint projectId) {
        require(msg.sender == projectIdToProjectDetails[projectId].client, "Only project owner can call");
        _;
    }

    event ProjectCreated(uint projectId, address client);
    event FreeLancerSelected(uint projectId, address client, address freelancer);
    event PaymentReleased(uint projectId, uint milestoneId, uint amount, address freelancer);

    function createProject(string memory _uri, uint lbid, uint ubid, string memory _JDuri) external returns(uint){
        _projectIds.increment();
        uint newProjectId = _projectIds.current();
        projectIdToProjectDetails[newProjectId] = Project(newProjectId, msg.sender, address(0), lbid, ubid, _uri, _JDuri, 0, ProjectStatus.Bidding);
        _projectIdsInBidding.increment();
        emit ProjectCreated(newProjectId, msg.sender);
        return newProjectId;
    }

    function getAllProjects() public view returns(Project[] memory){
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
        Bid memory newBid = Bid(_projectId, msg.sender, bidPrice, time, proposalUri, milestonePrices);
        projectIdToBids[_projectId].push(newBid);
    }


    function updateBid(uint _projectId, uint bidId, uint _bidPrice, uint time, uint[] memory _milestonePrices) public {
        require(msg.sender == projectIdToBids[_projectId][bidId].freelancer, "Only Bid owner can update");
        projectIdToBids[_projectId][bidId].bidPrice = _bidPrice;
        projectIdToBids[_projectId][bidId].deliveryTime = time;
        projectIdToBids[_projectId][bidId].milestonePrices = _milestonePrices;
    }

    function selectBid(uint projectId, address winnerBidder, uint bidId) external payable onlyProjectOwner(projectId){
        require(projectId <= _projectIds.current(), "Not a valid Project Id");
        require(checkInBidderList(projectId, winnerBidder), "This address is not a bidder");
        require(projectIdToProjectDetails[projectId].status != ProjectStatus.InProgress, "Project Already started");
        require(projectIdToProjectDetails[projectId].status != ProjectStatus.Completed, "Project Completed");
        //require(msg.value >= projectIdToBids[projectId][bidId].bidPrice, "Should stake equal to bid amount + staked amount");
        uint bidPrice = projectIdToBids[projectId][bidId].bidPrice;
        uint staked = SafeMath.div(SafeMath.mul(bidPrice, stakePercentage), 100);
        //uint staked = msg.value - projectIdToBids[projectId][bidId].bidPrice;
        require(msg.value >= bidPrice + staked, "Should stake equal to bid amount + staked amount");
        stakedAmount[msg.sender][projectId] = staked;
        projectIdToProjectDetails[projectId].freelancer = winnerBidder;
        projectIdToProjectDetails[projectId].finalBidId = bidId;
        projectIdToProjectDetails[projectId].status = ProjectStatus.InProgress;
        _projectIdsInBidding.decrement();
        emit FreeLancerSelected(projectId, msg.sender, winnerBidder);
    }

    // only client can call to process payment 
    function processMilestoneCompletion(uint projectId, uint milestoneIndex) public onlyProjectOwner(projectId){
        uint bidId = projectIdToProjectDetails[projectId].finalBidId;
        uint amountToPay = projectIdToBids[projectId][bidId].milestonePrices[milestoneIndex];
        address freelancer = projectIdToBids[projectId][bidId].freelancer;
        payable(freelancer).transfer(amountToPay);
        if(milestoneIndex == projectIdToBids[projectId][bidId].milestonePrices.length - 1) {
            projectIdToProjectDetails[projectId].status = ProjectStatus.Completed;
        }
        emit PaymentReleased(projectId, milestoneIndex, amountToPay, freelancer);
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