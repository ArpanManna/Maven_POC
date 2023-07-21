import { getJobProposalsByID, selectBid } from '@/utils/service'
import { useWeb3 } from '@3rdweb/hooks'
import React, { useCallback, useEffect, useState } from 'react'
import Spinner from './UI/Spinner'
import moment from 'moment'
import { TransactionToastMessage } from './UI/Toast'
import avatar2 from '../assets/imgs/avatar2.svg';
import Image from 'next/image'
import { useContextState } from '@/context'

const ProposalsTab = ({ id, proposals, projectOwner }) => {
  const [loading, setLoading] = useState(false);
  const { address, chainId, provider } = useWeb3();
  const [{}, dispatch] = useContextState();

  const handleBidSelection = async (bidId, bidOwner, bidPrice) => {
    setLoading(true);
    await selectBid(chainId, provider, id, bidOwner, bidId, bidPrice, txNotify, dispatch);
    setLoading(false);
  }

  const txNotify = useCallback((type, title, txHash) => {
    TransactionToastMessage({ type, title, txHash });
  }, []);

  return (
    <div className='container text-black p-4'>
      <div className="container mx-auto px-12 py-2 grid grid-cols-2 gap-6 items-center">
        {
          proposals && proposals.map(({ proposalId, bidPrice, owner, estimatedTimeline, milestones, proposal }, index) => (
            <div key={index} className="block w-full p-6 mb-2 text-gray-800 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100">
              <div className='grid grid-cols-4 gap-2'>
                <div className='flex justify-center'>
                  <Image src={avatar2} height={100} width={100}/>
                </div>

                <div className='col-span-3 text-left'>
                  <div className='flex flex-wrap gap-4'>
                    {/* <h2 className='font-bold text-2xl'>
                      Tek Raj Joshi
                    </h2> */}
                    <h2 className='font-medium text-xl'>
                      Bid From: {owner.slice(0, 6)}
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
              </div>
              <div className='flex justify-between font-bold text-sm'>
                {
                  address === projectOwner &&
                  <>
                     <p className='text-sm'> Total amount to pay: {bidPrice * 1.05}</p>

                    {loading ? <Spinner /> :
                      <button className='border px-4 py-2 -mt-1 rounded-md bg-gradient-to-r from-palatte4 to-palatte1 hover:bg-gradient-to-br text-white' onClick={() => handleBidSelection(index, owner, bidPrice * 1.05)}>Select Bid</button>
                    }
                  </>
                }</div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default ProposalsTab