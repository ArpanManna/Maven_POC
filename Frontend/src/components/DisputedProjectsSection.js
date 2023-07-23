import { useIsMounted } from '@/lib/hooks/us-is-mounted'
import { getAllDisputedProjects } from '@/utils/service'
import { useWeb3 } from '@3rdweb/hooks';
import React, { useEffect, useState } from 'react'
import Avatar from "../assets/imgs/avatar1.svg";
import { getAccountUrl } from '@/utils/explorer';
import RedirectIcon from '@/assets/imgs/RedirectIcon';
import moment from 'moment';
import Link from 'next/link';
import Image from 'next/image';

const DisputedProjectsSection = () => {
  const isMounted = useIsMounted();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { chainId, provider } = useWeb3();

  useEffect(() => {
    if (chainId && isMounted) getProjects()
  }, [chainId, isMounted])

  const getProjects = async () => {
    setLoading(true)
    let res = await getAllDisputedProjects(chainId, provider);
    res = res.sort((x, y) => (parseInt(x.id) < parseInt(y.id)) ? 1 : -1)
    setPosts(res);
    setLoading(false);
  }
  if (loading) return (<p className='text-center py-12'>Loading...</p>)
  if (posts && posts.length === 0) return (<div className='text-center my-8'>
    <p className='font-mono font-lg'>No projects to show!</p>
  </div>)
  return (
    <div className="container mx-auto px-12 py-2 grid grid-cols-2 gap-6 z-0 items-center">
      {
        posts && posts.map(({ id, owner, createdOn, deadline, bidCount, tokenId, tba, metadata: { projectName, projectDescription, priceFrom, priceTo, skillsRequired } }) => (
          <div key={id} className="bg-gradient-to-b from-blue-200 to-sky-100 shadow-sm rounded-lg p-8 items-center text-center h-xl w-xl z-0">
            <div className='grid grid-cols-6 gap-2'>
              <Image src={Avatar} alt="avatar" className='col-span-1' height={55} width={55} />
              <div className='text-start col-span-5 '>
                <h1 className="title-font sm:text-lg text-xl font-medium text-gray-900">{projectName && (projectName.length > 60 ? projectName.slice(0, 60) : projectName)}</h1>
                <div className='flex flex-wrap gap-2'>
                  <p className='font-semibold'>
                    Owner:
                  </p>
                  <a href={getAccountUrl(owner)} target='__blank' className='cursor-pointer hover:underline text-blue-600'>{`0x...${owner.slice(36)}`}</a>
                  <RedirectIcon />
                </div>
                <div className='flex justify-between'>
                  <h2 className='font-mono font-semibold my-1'>Published On: {moment.unix(createdOn).format("MM/DD/YYYY")}</h2>
                  <h2 className='font-mono font-semibold '>Deadline: {moment.unix(deadline).format("MM/DD/YYYY")}</h2>
                </div>
                <p className="my-4 leading-relaxed">{projectDescription && (projectDescription.length > 160 ? projectDescription.slice(0, 160) : projectDescription)}...</p>
                <div className='flex flex-wrap gap-3'>
                  {skillsRequired && skillsRequired.map((skill) => (
                    <button key={skill} className='text-palatte4 border text-xs rounded-xl border-gray-700 px-3 py-1'>{skill}</button>
                  ))}
                </div>
              </div>
            </div>
            <div className='flex font-mono flex-wrap gap-4 my-4 p-4 rounded-lg bg-blue-200 shadow-md'>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-blue-800">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" />
              </svg>

              <h2 className='font-semibold'>Token Id: {tokenId}</h2>
              <div className='flex flex-wrap gap-2 font-semibold'>
                <p>Token Bound Address: </p>
                <a href={getAccountUrl(tba)} target='__blank' className='cursor-pointer hover:underline text-blue-600'>{`0x...${tba.slice(36)}`}</a>
                <RedirectIcon />
              </div>
            </div>
            <div className='flex justify-between mt-4'>
              <p className='text-lg mt-1'>{bidCount} Bids</p>
              <p className='font-mono mt-2'>Budget: {priceFrom} wei - {priceTo} wei</p>
              <Link href={`/dispute/${id}`} className='bg-gradient-to-r from-palatte4 to-palatte1 hover:bg-gradient-to-br text-white hover:text-white cursor-pointer px-4 rounded-2xl py-2'>More Info</Link>
            </div>
          </div>
        ))
      }
    </div>
  )
}

export default DisputedProjectsSection