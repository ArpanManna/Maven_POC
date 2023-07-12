import { Contract, ethers } from "ethers";
import addresses from "../constants/Contracts.json"
import mavenABI from "../assets/abis/maven.json"
import axios from 'axios';
import async from 'async';

const initializeContract = (ContractAddress, ABI, auth) => {
    return new Contract(ContractAddress, ABI, auth)
}

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

export const createJobPost = async (chainId, provider, metaDataURI, priceFrom, priceTO, fileURI, deadline) => {
    const mavenContract = initializeContract(addresses[chainId].maven, mavenABI, provider.getSigner())
    try {
        const data = await mavenContract.createProject(metaDataURI, priceFrom, priceTO, fileURI, deadline)
        return (data)
    } catch (err) {
        console.log(err)
    }
}

export const getAllJobPosts = async (chainId, provider) => {
    const mavenContract = initializeContract(addresses[chainId].maven, mavenABI, provider)
    try {
        const data = await mavenContract.getAllProjectsBidding();
        console.log(data)
        let posts = []

        await async.eachLimit(data, 100, async (_data) => {
            let post = ({ id: _data[0].toString(), owner: _data[1], freelancer: _data[2], lowestBid: _data[3].toString(), highestBid: _data[4].toString(), createdOn: _data[7].toString(), deadline: _data[8].toString(), finalBid: _data[9].toString(), status: _data[10] })
            const metadataRes = await getIPFSResponse(_data[5])
            const JDRes = await getIPFSResponse(_data[6])
            post = ({...post, metadata: metadataRes, fileURI: JDRes })
            posts.push(post)
        });
        return posts;
    } catch (err) {
        console.log(err)
    }
}

export const placeBid = async (chainId, provider, projectId, bidPrice, expectedTimeline, proposalURI, milestones) => {
    const mavenContract = initializeContract(addresses[chainId].maven, mavenABI, provider.getSigner())
    try {
        const data = await mavenContract.bid(projectId, bidPrice, expectedTimeline, proposalURI, milestones);
        return (data)
    } catch (err) {
        console.log(err)
    }
}

export const getJobProposalsByID = async (chainId, provider, projectId) => {
    const mavenContract = initializeContract(addresses[chainId].maven, mavenABI, provider)
    try {
        const data = await mavenContract.showAllBidsProject(projectId);
        console.log(data)
        let proposals = []

        await async.eachLimit(data, 100, async (_data) => {
            let proposalDetail = ({ proposalId: _data[0].toString(), owner: _data[1], bidPrice: _data[2].toString(), estimatedTimeline: _data[3].toString()})
            const proposal = await getIPFSResponse(_data[4])
            proposalDetail = ({...proposalDetail, proposal: proposal, milestones: _data[5] })
            proposals.push(proposalDetail)
        });
        return proposals;
    } catch (err) {
        console.log(err)
    }
}

export const selectBid = async (chainId, provider, projectId, bidOwner, bidId, bidPrice) => {
    const mavenContract = initializeContract(addresses[chainId].maven, mavenABI, provider.getSigner())
    try {
        const data = await mavenContract.selectBid(projectId, bidOwner, bidId, {value: parseInt(bidPrice)});
        return (data)
    } catch (err) {
        console.log(err)
    }
}

const getProjectById = async (chainId, provider, projectId) => {
    const mavenContract = initializeContract(addresses[chainId].maven, mavenABI, provider)
    try {
        const data = await mavenContract.getProjectDetails(projectId.toNumber());
            let post = ({ id: data[0].toString(), owner: data[1], freelancer: data[2], lowestBid: data[3].toString(), highestBid: data[4].toString(), createdOn: data[7].toString(), deadline: data[8].toString(), finalBid: data[9].toString(), status: data[10] })
            const metadataRes = await getIPFSResponse(data[5])
            const JDRes = await getIPFSResponse(data[6])
            post = ({...post, metadata: metadataRes, fileURI: JDRes })
        return post
    } catch (err) {
        console.log(err)
    }
}
export const getProjectsByUser = async (chainId, provider, address) => {
    const mavenContract = initializeContract(addresses[chainId].maven, mavenABI, provider)
    try {
        const projects = await mavenContract.getProjectProfile(address);
        const posts = []

        await async.eachLimit(projects, 100, async (_data) => {
            const post = await getProjectById(chainId, provider, _data);
            posts.push(post)
        });
        console.log(posts)
        return (posts)
    } catch (err) {
        console.log(err)
    }
}