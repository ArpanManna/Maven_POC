// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract Voting {
    uint[] disputedProjectIds;
    address deployer;

    constructor() {
        deployer = msg.sender;
    }

    // @dev - vote : 1 for freelancer, vote 2 for client
	struct Vote {
		uint votesFreelancer;    
        uint votesClient;
		uint duration;
		mapping (address => uint) voting_ballot;
        address[] freelancers;
        address[] clients;
	}

	mapping (uint => Vote) public projects;
	uint256 votingPeriodConstant = 60 seconds;

    function initializeVoting(uint projectId) public {
        require(projects[projectId].duration == 0, "Already Initialized!");
        projects[projectId].duration = block.timestamp + votingPeriodConstant;
        disputedProjectIds.push(projectId);
    }

    // @dev - to be called by whitelisted voters only
	function vote(uint projectId, uint _vote) external {
        // to check if project Id is valid
        require(msg.sender != deployer, "This address not eligible for voting");
        require(projects[projectId].duration != 0, "Voting Not Started Yet!");
		require(projects[projectId].duration > block.timestamp, "Voting for this project is Over!");
		require(projects[projectId].voting_ballot[msg.sender] == 0, "You can vote only once");
		require(_vote == 1 || _vote == 2, "Invalid Voting");
        
        if(_vote == 1){
            projects[projectId].votesFreelancer += 1;   // add vote in favor of freelancer
            projects[projectId].freelancers.push(msg.sender);
        }
        else if(_vote == 2){
            projects[projectId].votesClient += 1;   // add vote in favor of client
            projects[projectId].clients.push(msg.sender);
        }
		projects[projectId].voting_ballot[msg.sender] = _vote;
	}

    // @dev - 0: unbiased, 1: freelancer, 2: client
	function getVotingResult(uint projectId) public view returns (uint) {
		require(projects[projectId].duration != 0, "Voting not started yet");
		require(projects[projectId].duration < block.timestamp, "Voting not over yet!");
        if(projects[projectId].votesFreelancer == projects[projectId].votesClient) return 0;
		return projects[projectId].votesFreelancer > projects[projectId].votesClient ? 1 : 2;    
	}

    // @dev - this functions returns list of voters address for(freelancers and clients)
    function getVotingDetails(uint projectId) public view returns(address[] memory, address[] memory){
        //Vote storage vote =  projects[projectId];
        return (projects[projectId].freelancers,projects[projectId].clients);
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
            if(projects[disputedProjectIds[i]].votesFreelancer != projects[disputedProjectIds[i]].votesClient){
                count += 1;
            }
        }
        return count;
    }
}