import { useIsMounted } from '@/lib/hooks/us-is-mounted';
import { getAllJobPosts } from '@/utils/service';
import { useWeb3 } from '@3rdweb/hooks';
import moment from 'moment';
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

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

  return (
    <>
      {loading && <p className='text-center py-12'>Loading...</p>}

      {
        posts && posts.map(({ id, owner, createdOn, deadline, metadata: { projectName, projectDescription, priceFrom, priceTo, skillsRequired } }) => (
          <Link key={id} href={{ pathname: `/project/${id}`, query: { post: JSON.stringify({ id, projectName, projectDescription, owner, priceFrom, priceTo, skillsRequired }) } }} as={`/project/${id}`} class="block w-full p-6 mb-2 text-gray-800 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100">
            <h5 class="mb-1 text-xl font-bold tracking-tight">{projectName}</h5>
            <div className='flex justify-between text-sm mb-4'>
              <div>
                <h2 className='font-mono font-semibold my-1'>Published On: {moment.unix(createdOn).format("MM/DD/YYYY")}</h2>
                <h2 className='font-mono font-semibold '>Deadline: {moment.unix(deadline).format("MM/DD/YYYY")}</h2>
              </div>
              <p>Budget: {priceFrom} - {priceTo}</p>
            </div>
            <p class="font-normal text-gray-700">{projectDescription}</p>
            <div className='flex flex-wrap gap-3'>
              {skillsRequired && skillsRequired.map((skill) => (
                <p key={skill} className='text-palatte4 my-4'>{skill}</p>
              ))}
            </div>
            <div className='flex justify-between font-bold text-sm'>
              <p>20 Bids</p>
              <p>2 Minutes ago</p>
            </div>
          </Link>
        ))
      }
    </>
  )
}

export default ProjectCards