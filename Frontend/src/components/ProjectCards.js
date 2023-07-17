import { useIsMounted } from '@/lib/hooks/us-is-mounted';
import { getAllJobPosts, getTotalBids } from '@/utils/service';
import { useWeb3 } from '@3rdweb/hooks';
import moment from 'moment';
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import avatar1 from "../assets/imgs/avatar1.svg"
import avatar2 from "../assets/imgs/avatar2.svg"
import avatar3 from "../assets/imgs/avatar3.svg"
import avatar4 from "../assets/imgs/avatar4.svg"
import Image from 'next/image';


const ProjectCards = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { chainId, provider } = useWeb3()
  const isMounted = useIsMounted()

  useEffect(() => {
    if (chainId && isMounted) getProjects()
  }, [chainId, isMounted])

  const getProjects = async () => {
    setLoading(true)
    const res = await getAllJobPosts(chainId, provider);
    setPosts(res);
    setLoading(false);
  }

  // const fetchTotalBids = async(projectId) => {
  //   const res = await getTotalBids(chainId, provider, projectId);
  //   console.log(res)
  //   return res.toNumber();
  // }
  if (loading) return (<p className='text-center py-12'>Loading...</p>)
  if (posts && posts.length === 0) return (<div className='text-center my-8'>
  <p className='font-mono font-lg'>No projects to show!</p>
</div>)
  return (
    <>
      <div className="container mx-auto px-12 py-2 grid grid-cols-2 gap-6 z-0 items-center">
        {
          posts && posts.map(({ id, owner, createdOn, deadline, bidCount, metadata: { projectName, projectDescription, priceFrom, priceTo, skillsRequired } }) => (
            <div key={id} className="border bg-blue-100 shadow-sm rounded-lg p-8 items-center text-center h-xl w-xl z-0">
              <div className='grid grid-cols-6 gap-2'>
                <Image src={avatar1} alt="avatar" className='col-span-1' height={55} width={55} />
                <div className='text-start col-span-5 '>
                  <h1 className="title-font sm:text-lg text-xl font-medium text-gray-900">{projectName && (projectName.length > 60 ? projectName.slice(0, 60) : projectName)}</h1>
                  <p>0x...{owner.slice(owner.length - 6)}</p>
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
              <div className='flex justify-between mt-4'>
                  <p className='text-lg mt-1'>{bidCount} Bids</p>
                 <p className='font-mono mt-2'>Budget: {priceFrom} wei - {priceTo} wei</p>
                   <Link href={{ pathname: `/project/${id}`, query: { post: JSON.stringify({ id, projectName, projectDescription, owner, priceFrom, priceTo, skillsRequired }) } }} as={`/project/${id}`} className='bg-gradient-to-r from-palatte4 to-palatte1 hover:bg-gradient-to-br text-white hover:text-white cursor-pointer px-4 rounded-2xl py-2'>More Info</Link>
              </div>
            </div>
          ))
        }
      </div>
    </>
  )
}

export default ProjectCards