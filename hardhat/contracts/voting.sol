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

	mapping (uint => Vote) public disputedProjects; // mapping of disputed project Id to Vote Details
	uint256 votingPeriodConstant = 60 seconds;

    // @dev - Initial setup: voting_ballot -> 0: not eligible, 3: eligible for voting
    function initializeVoting(uint projectId, address[] calldata toBeWhitelisted) public {
        require(disputedProjects[projectId].duration == 0, "Already Initialized!");
        require(toBeWhitelisted.length !=0, "Cannot Initialize : Empty voters list!");
        for(uint i=0; i<toBeWhitelisted.length; i++){
            disputedProjects[projectId].voting_ballot[toBeWhitelisted[i]] = 3;
        }
        disputedProjects[projectId].duration = block.timestamp + votingPeriodConstant;
        disputedProjectIds.push(projectId);
    }

    // @dev - to be called by whitelisted voters only
	function vote(uint projectId, uint _vote) external {
        // to check if project Id is valid
        require(msg.sender != deployer, "This address not eligible for voting");
        require(disputedProjects[projectId].duration != 0, "Voting Not Started Yet!");
		require(disputedProjects[projectId].duration > block.timestamp, "Voting for this project is Over!");
        //require(projects[projectId].voting_ballot[msg.sender] == 0, "Not eligible for voting");
        require(disputedProjects[projectId].voting_ballot[msg.sender] == 3, "Either you are not eligible or You can vote only once");
		
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
}