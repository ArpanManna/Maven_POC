import { Contract, ethers } from "ethers";
import addresses from "../constants/Contracts.json"
import mavenABI from "../assets/abis/maven.json"
import axios from 'axios';
import async from 'async';
import { sendNotification } from "@/lib/Notify";

const rpc = "https://polygon-mumbai.g.alchemy.com/v2/-a6_POS01b0lSBGeNnfc25nTbElQneFq";

const initializeContract = (ContractAddress, ABI, auth) => {
    return new Contract(ContractAddress, ABI, auth)
}

const getTransactionStatus = async(txHash) => {
    const provider = new ethers.providers.JsonRpcProvider(rpc);
    try{
        const txReceipt = await provider.waitForTransaction(txHash);
        return txReceipt.status;
    } catch {
        return 0;
    }
};

const getIPFSResponse = async (uri) => {
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: uri,
        headers: {}
    };
    try {
        const response = await axios.request(config)
        return (response.data)
    } catch (err) {
        console.log(err)
    }
}

export const createJobPost = async (chainId, provider, metaDataURI, priceFrom, priceTO, fileURI, deadline, txNotify) => {
    const mavenContract = initializeContract(addresses[chainId].maven, mavenABI, provider.getSigner())
    try {
        const tx = await mavenContract.createProject(metaDataURI, priceFrom, priceTO, fileURI, deadline)
        txNotify("success", "Sent", tx.hash);
        const txStatus = await getTransactionStatus(tx.hash);
        if (txStatus === 1) txNotify("success", "Successful", tx.hash);
        else txNotify("error", "Failed", tx.hash);
    } catch (err) {
        console.log(err)
    }
}

export const getAllJobPosts = async (chainId, provider) => {
    const mavenContract = initializeContract(addresses[chainId].maven, mavenABI, provider)
    try {
        const data = await mavenContract.getAllProjectsBidding();
        let posts = []

        await async.eachLimit(data, 100, async (_data) => {
            let post = ({ id: _data[0].toString(), owner: _data[1], freelancer: _data[2], lowestBid: _data[3].toString(), highestBid: _data[4].toString(), createdOn: _data[7].toString(), deadline: _data[8].toString(), finalBid: _data[9].toString(), status: _data[10] })
            const metadataRes = await getIPFSResponse(_data[5])
            const JDRes = await getIPFSResponse(_data[6])
            const bidCount = await getTotalBids(chainId, provider, _data[0].toString());
            post = ({ ...post, metadata: metadataRes, fileURI: JDRes, bidCount })
            posts.push(post)
        });
        return posts;
    } catch (err) {
        console.log(err)
    }
}

export const placeBid = async (chainId, provider, projectId, bidPrice, expectedTimeline, proposalURI, milestones, projectOwner, txNotify) => {
    const mavenContract = initializeContract(addresses[chainId].maven, mavenABI, provider.getSigner())
    try {
        const tx = await mavenContract.bid(projectId, bidPrice, expectedTimeline, proposalURI, milestones);
        txNotify("success", "Sent", tx.hash);
        const txStatus = await getTransactionStatus(tx.hash);
        if (txStatus === 1) {
            txNotify("success", "Successful", tx.hash);
            const freelancer = await provider.getSigner().getAddress();
            await sendNotification(`New Bid Placed`, `You have got a new bid in your project from ${freelancer}`, projectOwner);
        } else txNotify("error", "Failed", tx.hash);       
    } catch (err) {
        console.log(err)
    }
}

export const getJobProposalsByID = async (chainId, provider, projectId) => {
    const mavenContract = initializeContract(addresses[chainId].maven, mavenABI, provider)
    try {
        const data = await mavenContract.showAllBidsProject(projectId);
        let proposals = []

        await async.eachLimit(data, 100, async (_data) => {
            let proposalDetail = ({ proposalId: _data[0].toString(), owner: _data[1], bidPrice: _data[2].toString(), estimatedTimeline: _data[3].toString() })
            const proposal = await getIPFSResponse(_data[4])
            proposalDetail = ({ ...proposalDetail, proposal: proposal, milestones: _data[5] })
            proposals.push(proposalDetail)
        });
        return proposals;
    } catch (err) {
        console.log(err)
    }
}

export const selectBid = async (chainId, provider, projectId, bidOwner, bidId, bidPrice, txNotify) => {
    const mavenContract = initializeContract(addresses[chainId].maven, mavenABI, provider.getSigner())
    try {
        const tx = await mavenContract.selectBid(projectId, bidOwner, bidId, { value: parseInt(bidPrice) });
        txNotify("success", "Sent", tx.hash);
        const txStatus = await getTransactionStatus(tx.hash);
        if (txStatus === 1) {
            txNotify("success", "Successful", tx.hash);
            const client = await provider.getSigner().getAddress();
            await sendNotification(`Bid Selected`, `Your bid has been selected by ${client}`, bidOwner);
        } else txNotify("error", "Failed", tx.hash);    
    } catch (err) {
        console.log(err)
    }
}

const getProjectById = async (chainId, provider, projectId) => {
    const mavenContract = initializeContract(addresses[chainId].maven, mavenABI, provider)
    try {
        const data = await mavenContract.getProjectDetails(projectId.toNumber());
        let post = ({ id: data[0].toString(), metadataURI: data[5], owner: data[1], freelancer: data[2], lowestBid: data[3].toString(), highestBid: data[4].toString(), createdOn: data[7].toString(), deadline: data[8].toString(), finalBid: data[9].toString(), status: data[10] })
        const metadataRes = await getIPFSResponse(data[5])
        const JDRes = await getIPFSResponse(data[6])
        post = ({ ...post, metadata: metadataRes, file: JDRes })
        return post
    } catch (err) {
        console.log(err)
    }
};

export const getBidByBidId = async (chainId, provider, projectId, bidId) => {
    const mavenContract = initializeContract(addresses[chainId].maven, mavenABI, provider)
    try {
        const data = await mavenContract.getBidDetails(projectId.toNumber(), bidId);
        let bid = ({ projectId: data[0].toString(), freelancer: data[1], bidPrice: data[2].toString(), deliveryTime: data[3].toString()})
        let proposal = await getIPFSResponse(data[4])
        console.log(data[6])
        data[6].forEach((tokenId, index) => {
            proposal.milestones[index].tokenId = tokenId.toNumber() ;
        })
        bid = ({ ...bid, proposal});
        return bid;
    } catch (err) {
        return  {}
    }
};

export const getProjectsByUser = async (chainId, provider, address) => {
    const mavenContract = initializeContract(addresses[chainId].maven, mavenABI, provider)
    try {
        const projects = await mavenContract.getProjectProfile(address);
        const posts = []

        await async.eachLimit(projects, 100, async (projectId) => {
            let data = {}
            const post = await getProjectById(chainId, provider, projectId);
            data.post = post;
            const bidDetail = await getBidByBidId(chainId, provider, projectId, post.finalBid)
            data.bid = bidDetail
            posts.push(data)
        });
        return (posts)
    } catch (err) {
        console.log(err)
    }
}

export const transferMilestone = async (chainId, provider, projectId, milestoneId, projectOwner, txNotify) => {
    const mavenContract = initializeContract(addresses[chainId].maven, mavenABI, provider.getSigner())
    try {
        const tx = await mavenContract.transferMilestoneOwnership(projectId, milestoneId);
        txNotify("success", "Sent", tx.hash);
        const txStatus = await getTransactionStatus(tx.hash);
        if (txStatus === 1) {
            txNotify("success", "Successful", tx.hash);
            const freelancer = await provider.getSigner().getAddress();
            await sendNotification(`Milestone ${milestoneId} Completed`, `Milestone ${milestoneId} has been transfered by ${freelancer}!`, projectOwner);
        } else txNotify("error", "Failed", tx.hash); 
    } catch (err) {
        console.log(err)
    }
}

export const processPayment = async (chainId, provider, projectId, milestoneId, freelancer, txNotify) => {
    const mavenContract = initializeContract(addresses[chainId].maven, mavenABI, provider.getSigner())
    try {
        const tx = await mavenContract.processMilestoneCompletion(projectId, milestoneId);
        txNotify("success", "Sent", tx.hash);
        const txStatus = await getTransactionStatus(tx.hash);
        if (txStatus === 1) {
            txNotify("success", "Successful", tx.hash);
            const client = await provider.getSigner().getAddress();
            await sendNotification(`Payment Credited`,  `You got the payment of milestone ${milestoneId} from ${client}!`, freelancer);
        } else txNotify("error", "Failed", tx.hash); 
    } catch (err) {
        console.log(err)
    }
}

export const getTotalBids = async (chainId, provider, projectId) => {
    const mavenContract = initializeContract(addresses[chainId].maven, mavenABI, provider)
    try {
        const data = await mavenContract.getTotalBid(projectId);
        return data.toNumber();
    } catch (err) {
        console.log(err)
    }
}