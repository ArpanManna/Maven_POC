// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./VRFCoordinatorV2Interface.sol";
import "./VRFConsumerBaseV2.sol";
import "./ConfirmedOwner.sol";

contract Voting is VRFConsumerBaseV2, ConfirmedOwner{
    uint[] disputedProjectIds;
    address deployer;
    VRFCoordinatorV2Interface COORDINATOR;
    uint64 s_subscriptionId = 5476;           // Our subscription ID.
    uint256[] public requestIds;   // past requests Id.
    uint256 public lastRequestId;
    bytes32 keyHash = 0x4b09e658ed251bcafeebbc69400383d49f344ace09b9576fe248bb02c003fe9f; //change this based on the network chosen
    uint32 callbackGasLimit = 100000;
    uint16 requestConfirmations = 3;
    uint32 numWords = 1;       //setting it to 1 as we need only 1 random value per request

    /**
     * HARDCODED FOR SEPOLIA
     * COORDINATOR: 0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625
     */

    constructor() VRFConsumerBaseV2(0x7a1BaC17Ccc5b313516C5E16fb24f7659aA5ebed) ConfirmedOwner(msg.sender){
        deployer = msg.sender;
        COORDINATOR = VRFCoordinatorV2Interface(0x7a1BaC17Ccc5b313516C5E16fb24f7659aA5ebed);
        //s_subscriptionId = subscriptionId;
    }

    event RequestSent(uint256 requestId, uint32 numWords);
    event RequestFulfilled(uint256 requestId, uint256[] randomWords);

    // @dev - vote : 1 for freelancer, vote 2 for client
	struct Vote {
        address disputeRaiser;
		uint votesFreelancer;    
        uint votesClient;
		uint duration;
		mapping (address => uint) voting_ballot;
        address[] freelancers;
        address[] clients;
        uint randomness;   
	}
    struct RequestStatus {
        bool fulfilled; // whether the request has been successfully fulfilled
        bool exists; // whether a requestId exists
        uint256[] randomWords;
    }

	mapping (uint => Vote) public disputedProjects; // mapping of disputed project Id to Vote Details
    mapping(uint256 => RequestStatus) public s_requests;
	uint256 votingPeriodConstant = 30 minutes;

    // @dev - Initial setup: voting_ballot -> 0: not eligible, 3: eligible for voting
    function initializeVoting(uint projectId, address[] calldata toBeWhitelisted, uint _chainLinkVRFData) public {
        require(disputedProjects[projectId].duration == 0, "Already Initialized!");
        require(toBeWhitelisted.length !=0, "Cannot Initialize : Empty voters list!");
        for(uint i=0; i<toBeWhitelisted.length; i++){
            disputedProjects[projectId].voting_ballot[toBeWhitelisted[i]] = 3;
        }
        disputedProjects[projectId].disputeRaiser = msg.sender;
        disputedProjects[projectId].duration = block.timestamp + votingPeriodConstant;
        disputedProjects[projectId].randomness = _chainLinkVRFData;
        disputedProjectIds.push(projectId);
    }

    // @dev - to be called by whitelisted voters only
	function vote(uint projectId, uint _vote, uint _randomness) external {
        // to check if project Id is valid
        require(msg.sender != deployer, "This address not eligible for voting");
        require(disputedProjects[projectId].duration != 0, "Voting Not Started Yet!");
		require(disputedProjects[projectId].duration > block.timestamp, "Voting for this project is Over!");
        //require(projects[projectId].voting_ballot[msg.sender] == 0, "Not eligible for voting");
        require(disputedProjects[projectId].voting_ballot[msg.sender] == 3, "Either you are not eligible or You can vote only once");
        require(_randomness < disputedProjects[projectId].randomness, "You are not eligible for this round of voting");
		
		require(_vote == 1 || _vote == 2, "Invalid Voting");
        
        if(_vote == 1){
            disputedProjects[projectId].votesFreelancer += 1;   // add vote in favor of freelancer
            disputedProjects[projectId].freelancers.push(msg.sender);
        }
        else if(_vote == 2){
            disputedProjects[projectId].votesClient += 1;   // add vote in favor of client
            disputedProjects[projectId].clients.push(msg.sender);
        }
		disputedProjects[projectId].voting_ballot[msg.sender] = _vote;
	}

    // @dev - 0: unbiased, 1: freelancer, 2: client
	function getVotingResult(uint projectId) public view returns (uint) {
		require(disputedProjects[projectId].duration != 0, "Voting not started yet");
		require(disputedProjects[projectId].duration < block.timestamp, "Voting not over yet!");
        if(disputedProjects[projectId].votesFreelancer == disputedProjects[projectId].votesClient) return 0;
		return disputedProjects[projectId].votesFreelancer > disputedProjects[projectId].votesClient ? 1 : 2;    
	}

    // @dev - this functions returns list of voters address for(freelancers and clients)
    function getVotingDetails(uint projectId) public view returns(address[] memory, address[] memory){
        //Vote storage vote =  projects[projectId];
        return (disputedProjects[projectId].freelancers,disputedProjects[projectId].clients);
    }

    // function getAllVotingDetails() public view returns(Vote[] memory){
    //     uint count = disputedProjectIds.length;
    //     Vote[] memory allVotes = new Vote[](count);
    //     for(uint i=1;i<=count;i++){
    //         Vote storage curItem = projects[disputedProjectIds[i]];
    //         allVotes[i] = curItem;
    //     }
    // }

    // @dev - this function returns how many disputes has been resolved 
    function getResolvedDisputedCount() public view returns(uint){
        uint count = 0;
        for(uint i=0;i<disputedProjectIds.length;i++){
            if(disputedProjects[disputedProjectIds[i]].votesFreelancer != disputedProjects[disputedProjectIds[i]].votesClient){
                count += 1;
            }
        }
        return count;
    }

        // Assumes the subscription is funded sufficiently.
    function requestRandomWords() external returns (uint256 requestId){
        // Will revert if subscription is not set and funded.
        requestId = COORDINATOR.requestRandomWords(keyHash, s_subscriptionId, requestConfirmations, callbackGasLimit, numWords);
        s_requests[requestId] = RequestStatus({randomWords: new uint256[](0), exists: true, fulfilled: false});
        requestIds.push(requestId);
        lastRequestId = requestId;
        emit RequestSent(requestId, numWords);
        return requestId;
    }

    function fulfillRandomWords(uint256 _requestId, uint256[] memory _randomWords) internal override {
        require(s_requests[_requestId].exists, "request not found");
        s_requests[_requestId].fulfilled = true;
        s_requests[_requestId].randomWords = _randomWords;
        emit RequestFulfilled(_requestId, _randomWords);
    }

    function getRequestStatus(uint256 _requestId) external view returns (bool fulfilled, uint randomWords) {
        require(s_requests[_requestId].exists, "request not found");
        RequestStatus memory request = s_requests[_requestId];
        return (request.fulfilled, request.randomWords[0] % 100);
    }
}