import { selectBid } from '@/utils/service'
import { useWeb3 } from '@3rdweb/hooks'
import React, { useCallback, useState } from 'react'
import Spinner from './UI/Spinner'
import moment from 'moment'
import { TransactionToastMessage } from './UI/Toast'
import avatar2 from '../assets/imgs/avatar2.svg';
import Image from 'next/image'
import { useContextState } from '@/context'
import { useRouter } from 'next/router'
import { getAccountUrl } from '@/utils/explorer'

const ProposalsTab = ({ id, proposals, projectOwner }) => {
  const [loading, setLoading] = useState(false);
  const { address, chainId, provider } = useWeb3();
  const [{ }, dispatch] = useContextState();
  const router = useRouter();

  const handleBidSelection = async (proposalId, bidOwner, bidPrice) => {
    setLoading(true);
    await selectBid(chainId, provider, id, bidOwner, proposalId, bidPrice, txNotify, dispatch);
    setLoading(false);
    router.push("/dashboard");
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
                  <Image src={avatar2} height={100} width={100} />
                </div>
                <div className='col-span-3 text-left'>

                    <div className='flex flex-wrap gap-2 font-semibold text-lg'>
                  <p>Bid From: </p>
                  <a href={getAccountUrl(owner)} target='__blank' className='cursor-pointer hover:underline text-blue-600'>{`0x...${owner.slice(36)}`}</a>
                  {/* <RedirectIcon className="mt-1"/> */}
                  </div>

                  <h2 className='text-md'>Bid Price: {bidPrice} wei</h2>
                  <h2 className='text-md'>Deadline: {moment.unix(estimatedTimeline).format("MM/DD/YYYY")}</h2>
                  <h5 className="text-md">Milestones: {proposal.milestones.length}</h5>
                </div>
              </div>
              <h5 className="my-4  tracking-tight">{proposal.proposal}</h5>
              <div className='flex justify-between text-sm mb-4'>
              </div>
                {
                  address === projectOwner &&
                  <>
                  <div className='flex justify-between text-sm'>
                    <div className='text-xs grid grid-cols-1 divide-y font-mono border py-2 px-4 border-palatte4'>
                    <h2 className='font-bold'>Amount Breakdown</h2>
                      
                      <h2>Bid Amount: {bidPrice} wei</h2>
                      <h2>Stake Amount: {bidPrice * 0.04} wei</h2>
                      <h2>Platform Fee: {bidPrice * 0.01} wei</h2>
                    <h2 className='font-bold text-right'>Total:  {bidPrice * 1.05} wei</h2>

                    </div>
                    <div className='text-xs grid grid-cols-1 divide-y font-mono border py-2 px-4 border-palatte4'>
                    <h2 className='font-bold'>Milestones Breakdown</h2>
                    {
                      proposal.milestones && proposal.milestones.map(({title, price}) => (
                        <h2 className='text-right'>{title}: {price} wei</h2>

                      ))
                    }
                    <h2 className='font-bold text-right'>Total:  {bidPrice} wei</h2>

                    </div>
                    <div>

                    </div>
                    </div>
                     {loading ? <Spinner /> :
                      <button className='border float-right px-4 py-2 mt-4 rounded-md bg-gradient-to-r from-palatte4 to-palatte1 hover:bg-gradient-to-br text-white' onClick={() => handleBidSelection(index, owner, bidPrice * 1.05)}>Select Bid</button>
                    }
                  </>
                 
                }
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default ProposalsTab