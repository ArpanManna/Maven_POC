import { Collapse, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import { useWeb3 } from '@3rdweb/hooks';
import { getProjectsByUser } from '@/utils/service';
import moment from 'moment';
import MilestoneTable from './UI/MilestoneTable';
import { useContextState } from '@/context';
import Modal from './UI/Modal';

const Accordion = () => {
    const { address, chainId, provider } = useWeb3();
    const [loading, setLoading] = useState(false);
    const [projects, setProjects] = useState([]);
    const [modalStatus, setModalStatus] = useState(false);

    const [{ dashboardProjects }, dispatch] = useContextState();

    useEffect(() => {
        if (address) getProjectByAddress()
    }, [address]);

    const getProjectByAddress = async () => {
        setLoading(true);
        const data = await getProjectsByUser(chainId, provider, address);
        if (data) {
            setProjects(data);
            dispatch({
                type: 'DASHBOARD_UPDATE',
                payload: {
                    dashboardProjects: data,
                },
            });
        }
        setLoading(false);
    }


    const handleDispute = async () => {
        setModalStatus(true);
    }

    const postStatusIdToLabel = {
        0: "Bidding",
        1: "In Progress",
        2: "Completed"
    };

    if (loading) return (<p className='text-center py-12'>Loading...</p>)
    if (projects.length === 0) return (<div className='text-center my-8'>
        <p className='font-mono font-lg'>No projects to show!</p>
    </div>)
    return (
        <>
            {
                projects && projects.map(({ bid, post }) => (
                    <Collapse className='my-4'
                        key={post.id}
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
                                        <button className='px-4 py-2 rounded-md text-white font-mono text-sm bg-palatte4' onClick={() => handleDispute()}>Dispute</button>
                                    </div>
                                    {modalStatus && <Modal modalStatus={modalStatus} setModalStatus={setModalStatus} projectId={post.id} />}

                                    <div className='col-span-3'>
                                        {post.status === 1 ?
                                            <MilestoneTable milestones={bid.proposal.milestones} postStatusIdToLabel={postStatusIdToLabel} owner={post.owner} freelancer={bid.freelancer} projectId={post.id} />
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