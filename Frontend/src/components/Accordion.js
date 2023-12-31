import { Collapse, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import { useWeb3 } from '@3rdweb/hooks';
import { getProjectsByUser } from '@/utils/service';
import moment from 'moment';
import MilestoneTable from './UI/MilestoneTable';
import { useContextState } from '@/context';
import Modal from './UI/Modal';
import { getAccountUrl } from '@/utils/explorer';
import RedirectIcon from '@/assets/imgs/RedirectIcon';
import Spinner from './UI/Spinner';

const postStatusIdToLabel = {
    0: "Bidding",
    1: "In Progress",
    2: "Completed",
    3: "Disputed"
};

const postStatusIdToHeading = {
    0: "Project is not selected yet.",
    2: "Project is completed.",
    3: "Dispute arised in the contract."
};


const Accordion = () => {
    const { address, chainId, provider } = useWeb3();
    const [loading, setLoading] = useState(false);

    const [{ dashboardProjects }, dispatch] = useContextState();

    useEffect(() => {
        if (address) getProjectByAddress()
    }, [address]);

    const getProjectByAddress = async () => {
        setLoading(true);
        await getProjectsByUser(chainId, provider, address, dispatch);
        setLoading(false);
    }

    if (loading) return (<p className='text-center py-12'>Loading...</p>)
    if (dashboardProjects.length === 0)
        return (
            <div className='text-center my-8'>
                <p className='font-mono font-lg'>No projects to show!</p>
            </div>
        )
    return (
        <>
            {
                dashboardProjects && dashboardProjects.map(({ bid, post }) => (
                    <Collapse className='my-4 flex'
                        key={post.id}
                        collapsible="header"
                        defaultActiveKey={['0']}
                        items={[
                            {
                                key: '1',
                                label: <AccordionTitle post={post} bid={bid} />,
                                children: <AccordionBody post={post} bid={bid} />,
                            },
                        ]}
                    />
                ))
            }
        </>
    )
};
export default Accordion;


const AccordionTitle = ({ post, bid }) => {
    return (
        <div className='flex-1 grid grid-cols-8 w-full gap-4'>
            <div className='col-span-4'>
                <p className='text-lg -mt-1'>{post.metadata.projectName}</p>
                <p>Created On: {moment.unix(post.createdOn).format("MM/DD/YYYY")}</p>
            </div>
            <div className='col-span-3'>
                <div className='flex flex-wrap gap-2 font-semibold'>
                <p>Client: </p>
                <a href={getAccountUrl(post.owner)} target='__blank' className='cursor-pointer hover:underline text-blue-600'>{`0x...${post.owner.slice(post.owner.length - 6)}`}</a>
                <RedirectIcon />
                </div>
                <div className='flex flex-wrap gap-2 font-semibold'>
                <p>TBA: </p>
                <a href={getAccountUrl(post.tba)} target='__blank' className='cursor-pointer hover:underline text-blue-600'>{`0x...${post.tba.slice(post.tba.length - 6)}`}</a>
                <RedirectIcon />
                </div>
           
                <p>Assets (Milestones): {post.assetsHolding}</p>
            </div>
            <div className='col-span-1'>
                <p>{postStatusIdToLabel[post.status]}</p>
            </div>
        </div>
    )
}

const AccordionBody = ({ post, bid }) => {
    const [disputeProject, setDisputeProject] = useState();
    const [modalStatus, setModalStatus] = useState(false);

    const handleDispute = async (projectId) => {
        setDisputeProject(projectId)
        setModalStatus(true);
    }

    return (
        <div className='grid grid-cols-4' key={post.id}>
            <div className='my-2 p-8 col-span-1 '>
                <h2>Token Id: {post.tokenId}</h2>

                <div className='flex flex-wrap gap-2 font-semibold'>
                <p>IPFS: </p>
                <a href={post.metadataURI} target='__blank' className='cursor-pointer hover:underline text-blue-600'>https:ipfs.io...</a>
                <RedirectIcon />
                </div>
                

                {bid.freelancer &&
                    <div className='flex flex-wrap gap-2 font-semibold'>
                    <p>Freelancer: </p>
                    <a href={getAccountUrl(bid.freelancer)} target='__blank' className='cursor-pointer hover:underline text-blue-600'>0x...{bid.freelancer.slice(36)}</a>
                    <RedirectIcon />
                    </div>
                }
                <h2>Published On: {moment.unix(post.createdOn).format("L")}</h2>
                <h2>Deadline: {moment.unix(post.deadline).format("L")}</h2>
                {post.status === 1 &&
                    <button className='px-4 py-2 mt-4 rounded-md text-white font-mono text-sm bg-palatte4' onClick={() => handleDispute(post.id)}>Raise Dispute</button>
                }
            </div>
            <div className='col-span-3'>
                {post.status === 1 ?
                    <MilestoneTable milestones={bid.proposal.milestones} postStatusIdToLabel={postStatusIdToLabel} owner={post.owner} freelancer={bid.freelancer} projectId={post.id} />
                    : <p className='text-center mt-16 font-mono text-lg'>{postStatusIdToHeading[post.status]}</p> 
                     
                }
            </div>
            {modalStatus && <Modal modalStatus={modalStatus} setModalStatus={setModalStatus} projectId={disputeProject} client={post.owner} freelancer={bid.freelancer}/>}

        </div>
    )
}