import { useIsMounted } from '@/lib/hooks/us-is-mounted'
import { getJobProposalsByID, selectBid } from '@/utils/service'
import { useWeb3 } from '@3rdweb/hooks'
import React, { useEffect, useState } from 'react'
import Spinner from './UI/Spinner'
import moment from 'moment'

const ProposalsTab = ({ id, proposals, projectOwner }) => {
  const [loading, setLoading] = useState(false);
  const { address, chainId, provider } = useWeb3();

  const handleBidSelection = async (bidId, bidOwner, bidPrice) => {
    setLoading(true);
    const res = await selectBid(chainId, provider, id, bidOwner, bidId, bidPrice);
    setLoading(false);
  }

  return (
    <div className='container text-black p-4'>
      <>
        {
          proposals.map(({ proposalId, bidPrice, owner, estimatedTimeline, milestones, proposal }, index) => (
            <div key={index} className="block w-full p-6 mb-2 text-gray-800 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100">
              <div className='grid grid-cols-4 gap-2'>
                <div className='flex justify-center py-6 rounded-full'>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </div>

                <div className='col-span-3 text-left'>
                  <div className='flex flex-wrap gap-4'>
                    {/* <h2 className='font-bold text-2xl'>
                      Tek Raj Joshi
                    </h2> */}
                    <h2 className='font-medium text-2xl'>
                      {owner.slice(0, 6)}
                      {'...'}
                      {owner.slice(owner.length - 6)}
                    </h2>
                  </div>

                  <h2 className='text-md'>Bid Price: {bidPrice} wei</h2>
                  <h2 className='text-md'>Deadline: {moment.unix(estimatedTimeline).format("MM/DD/YYYY")}</h2>
                  <h5 className="text-md">Milestones: {proposal.milestones.length}</h5>

                </div>

              </div>
              <h5 className="my-4  tracking-tight">{proposal.proposal}</h5>
              <div className='flex justify-between text-sm mb-4'>
                {/* <p>Budget: {budget}</p> */}
                {/* <p>Deadline: {deadline}</p> */}
              </div>
              {/* <p className="font-normal text-gray-700">{"description"}</p> */}
              {/* <div className='flex flex-wrap gap-3'>
               {skillsRequired.map((skill) => (
              <p key={skill} className='text-palatte4 my-4'>{skill}</p>
            ))}
            </div> */}
              <div className='flex justify-between font-bold text-sm'>
                {/* <p>{totalBids} Bids</p> */}
                <p>2 Minutes ago</p>
                {
                  address === projectOwner &&
                  <>
                    {loading ? <Spinner /> :
                      <button className='border px-4 py-3 rounded-md bg-blue-500 text-white' onClick={() => handleBidSelection(index, owner, bidPrice * 1.05)}>Select Bid</button>
                    } <p className='text-sm'> Total amount to pay: {bidPrice * 1.05}</p>
                  </>
                }</div>
            </div>
          ))
        }
      </>
    </div>
  )
}

export default ProposalsTab