import { Collapse, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import { useWeb3 } from '@3rdweb/hooks';
import { getProjectsByUser } from '@/utils/service';
import moment from 'moment';
import MilestoneTable from './UI/MilestoneTable';
import { useContextState } from '@/context';

const Accordion = () => {
    const { address, chainId, provider } = useWeb3();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [{dashboardProjects}, dispatch] = useContextState();

    useEffect(() => {
        if (address) getProjectByAddress()
    }, [address]);

    const getProjectByAddress = async () => {
        setLoading(true);
        const data = await getProjectsByUser(chainId, provider, address);
        setProjects(data);
        dispatch({
            type: 'DASHBOARD_UPDATE',
            payload: {
                dashboardProjects: data,
            },
        });
        setLoading(false);
    }

    const postStatusIdToLabel = {
        0: "Bidding",
        1: "In Progress",
        2: "Completed"
    };

    console.log(projects)
    return (
        <>
            {
                projects && projects.map(({ bid, post }) => (
                    <Collapse className='my-4'
                        collapsible="header"
                        defaultActiveKey={['1']}
                        items={[
                            {
                                key: '1',
                                label: <div className='grid grid-cols-4 gap-4'>
                                    <div className='col-span-3'>
                                        <p className='text-lg -mt-1'>{post.metadata.projectName}</p>
                                        <p>Created On: {moment.unix(post.createdOn).format("MM/DD/YYYY")}</p>
                                    </div>
                                    <div className='flex flex-wrap gap-4 col-span-1 justify-end'>
                                        <p>{`0x...${post.owner.slice(post.owner.length - 6)}`}</p>
                                        <p>{postStatusIdToLabel[post.status]}</p>
                                    </div>
                                </div>,
                                children: <div className='grid grid-cols-4' key={post.id}>
                                    <div className='my-2 p-8 col-span-1 '>
                                        <h2>Token Id: {post.id}</h2>
                                        <div className='flex flex-wrap gap-3'>
                                            <h2>IPFS: </h2>
                                            <a href={post.metadataURI} target='__blank' className='cursor-pointer font-light underline text-blue-600'>https:ipfs.io....</a>
                                        </div>
                                        <h2>Token Bound Address: 0x...78h</h2>
                                        {bid.freelancer && <h2>Freelancer: {'0x...'}
                                            {bid.freelancer.slice(bid.freelancer.length - 6)}</h2>}
                                        <h2>Published On: {moment.unix(post.createdOn).format("MM/DD/YYYY")}</h2>
                                        <h2>Deadline: {moment.unix(post.deadline).format("MM/DD/YYYY")}</h2>
                                    </div>
                                    <div className='col-span-3'>
                                        { post.status === 1 ? 
                                        <MilestoneTable milestones={bid.proposal.milestones } postStatusIdToLabel={postStatusIdToLabel} owner={post.owner} freelancer={bid.freelancer} projectId={post.id}/>
: <p className='text-center mt-16 font-mono text-lg'>No Bid selected.</p>
                                        }
                                    </div>
                                </div>,
                            },
                        ]}
                    />
                ))
            }
        </>
    )
};
export default Accordion;