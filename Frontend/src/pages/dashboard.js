import Nav from '@/components/Nav'
import Modal from '@/components/UI/Modal';
import { OptInChannel, sendNotifications } from '@/lib/pushProtocol';
import { getProjectsByUser, processPayment, transferMilestone } from '@/utils/service';
import { useWeb3 } from '@3rdweb/hooks'
import moment from 'moment';
import React, { useEffect, useState } from 'react'

const Dashboard = () => {
  const { address, chainId, provider } = useWeb3();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalStatus, setModalStatus] = useState(false)
  const [user, setUser] = useState('');
  const [milestoneId, setMilestoneId] = useState('');

  useEffect(() => {
    if (chainId) getProjectByAddress()
  }, [chainId]);

  const getProjectByAddress = async () => {
    setLoading(true);
    const data = await getProjectsByUser(chainId, provider, address);
    setProjects(data);
    setLoading(false);
  }

  // const handleOpenModel = (user, id) => {
  //   setModalStatus(true);
  //   setUser(user)
  //   setMilestoneId(id)
  // }

  const handleProcessPayment = async(projectId, milestoneId, owner) => {
    const res = await processPayment(chainId, provider, projectId, milestoneId, owner);
  }

  const handleTransferOwnership = async(projectId, milestoneId, freelancer) => {
    const res = await transferMilestone(chainId, provider, projectId, milestoneId, freelancer);
  }

  const handleDispute = async(projectId, milestoneId) => {

  }



  const Milestones = [
    {
      "NFTId": "1",
      "milestoneAmount": "200",
      "title": "Milestone1",
      "milOwner": "0x...hdh8",
      "status": "In Progress",
    },
    {
      "NFTId": "2",
      "milestoneAmount": "200",
      "title": "Milestone2",
      "milOwner": "0x...hdh8",
      "status": "In Progress",
    },
    {
      "NFTId": "3",
      "milestoneAmount": "200",
      "title": "Milestone3",
      "milOwner": "0x...hdh8",
      "status": "In Progress",
    }
  ]

  console.log(projects)
  return (
    <>
      <Nav />
      {loading && <p className='text-center py-12'>Loading...</p>}
      <div className='px-8 py-4 '>
        {
          projects && projects.map(({ post: {id, createdOn, owner, fileURI, status, metadata: { projectName, projectDescription }, deadline, finalBid, lowestBid, highestBid}, bid: {freelancer, deliveryTime, bidPrice, milestones, proposal}}) => (
            <div key={id} className='p-8'>
                  <h2 className='text-xl font-bold text-center my-4'>{projectName}</h2>
              <div className='grid grid-cols-3 gap-4 '>
                <div className='col-span-1 '>
                  <div className='my-2 border shadow-md p-20'>
                    <h2 className='font-mono font-semibold'>Owner: {'0x...'}{owner.slice(owner.length - 6)}</h2>
                    {freelancer && <h2 className='font-mono font-semibold'>Freelancer: {'0x...'}{freelancer.slice(freelancer.length - 6)}</h2>}
                    <h2 className='font-mono font-semibold my-1'>Published On: {moment.unix(createdOn).format("MM/DD/YYYY")}</h2>
                    <h2 className='font-mono font-semibold '>Deadline: {moment.unix(deadline).format("MM/DD/YYYY")}</h2>
                  </div>                  
                </div>
                <div className=' border col-span-2 p-2'>
                  <h2 className='my-2 font-semibold text-lg text-center'>Minestones</h2>

                  <hr />
                  {/* {Milestones.map(({ title, milestoneAmount, NFTId, milOwner, status }) => (
                    <div key={NFTId} className='flex justify-between gap-4 p-3 border shadow-md rounded-md'>
                      <h2 className='text-md font-mono py-2'>{title}</h2>
                      <h2 className='text-md font-mono py-2'>{NFTId}</h2>
                      <h2 className='text-md font-mono py-2'>{milOwner}</h2>
                      <h2 className='text-md font-mono py-2'>{milestoneAmount}</h2>
                      <h2 className='text-md font-mono py-2'>{status}</h2>
                      {
                        address === owner ?
                          <button onClick={() => handleOpenModel(owner, NFTId)} className='text-md font-mono bg-blue-200 px-4 py-2'>Process Payment</button> :
                          <button onClick={() => handleOpenModel(owner, NFTId)} className='text-md font-mono bg-blue-200 px-4 py-2'>Transfer Ownership</button>
                      }
                      <button onClick={() => handleOpenModel(owner, NFTId)} className='text-md font-mono bg-blue-200 px-4 py-2'>Raise Dispute</button>
                    </div>

                  ))} */}
                  {/* <div className='flex justify-between gap-4 p-3 border shadow-md rounded-md'>
                    <h2 className='text-md font-mono py-2'>Milestone</h2>
                    <h2 className='text-md font-mono py-2'>NFTId</h2>
                    <h2 className='text-md font-mono py-2'>Owner</h2>
                    <h2 className='text-md font-mono py-2'>Milestone Amount</h2>
                    <h2 className='text-md font-mono py-2'>status</h2>
                  </div> */}
                  {milestones && milestones.map((milestone, index) => (
                    <div key={index} className='flex justify-between gap-4 p-3 border shadow-md rounded-md'>
                    <h2 className='text-md font-mono py-2'>{"title"}</h2>
                    <h2 className='text-md font-mono py-2'>{"NFTId"}</h2>
                    <h2 className='text-md font-mono py-2'>{"milOwner"}</h2>
                    <h2 className='text-md font-mono py-2'>{milestone.toNumber()}</h2>
                    <h2 className='text-md font-mono py-2'>{status}</h2>
                    <h2 className='text-md font-mono py-2'>{" "}</h2>
                    <h2 className='text-md font-mono py-2'>{" "}</h2>
                    {
                      address === owner ?
                        <button onClick={() => handleProcessPayment(id, index, freelancer)} className='text-md font-mono bg-blue-200 px-4 py-2'>Process Payment</button> :
                        <button onClick={() => handleTransferOwnership(id, index, owner)} className='text-md font-mono bg-blue-200 px-4 py-2'>Transfer Ownership</button>
                    }
                    <button onClick={() => handleOpenModel(owner, index)} className='text-md font-mono bg-blue-200 px-4 py-2'>Raise Dispute</button>
                  </div>
                  ))}
                </div>

              </div>
              <h2 className='text-xl font-bold mt-8 mb-4'>Project Description</h2>
              <hr />
              <h2 className='text-md font-normal mt-4'>{projectDescription}</h2>
              <h2 className='text-md font-normal mt-12'>{fileURI}</h2>

            </div>
          ))
        }
      </div>
      {modalStatus && <Modal modalStatus={modalStatus} setModalStatus={setModalStatus} user={user} milestoneId={milestoneId} />}
    </>
  )
}

export default Dashboard

