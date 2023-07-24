import React, { useEffect } from 'react'
import PlaceBidForm from './PlaceBidForm'
import { useWeb3 } from '@3rdweb/hooks'
import { useContextState } from '@/context';
import { useRouter } from 'next/router';
import { getAccountUrl } from '@/utils/explorer';
import RedirectIcon from '@/assets/imgs/RedirectIcon';

const ProjectDetailTab = ({ id, projectDescription, projectOwner, skillsRequired, priceFrom, priceTo, bidCount, tokenId, tba }) => {
    const [{ currentUserDetails }] = useContextState();
    const { address } = useWeb3();
    const router = useRouter();


    useEffect(() => {
        if (address && !currentUserDetails?.profileTokenId) {
            router.push('/createprofile');
        }
    }, [address, currentUserDetails]);

    return (
        <div className='container text-black p-4 shadow-md rounded-md'>
            <div className='p-4'>
                <div className='flex justify-between'>
                    <h2 className='text-xl mt-3 font-semibold font-mono'> Project Details </h2>
                    <div className='flex font-mono flex-wrap gap-4 w-2/4 px-4 py-3 rounded-lg bg-blue-200 shadow-md'>
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
                </div>
                <p className='my-8'>
                    {projectDescription}
                </p>
                <h2 className='text-lg font-semibold'> Skills:</h2>
                <div className='flex flex-wrap gap-4'>
                    {skillsRequired && skillsRequired.map((skill, i) => (
                        <p key={`${skill}${i}`} className='font-semibold my-4 border-palatte4 border rounded-lg px-3 py-1'>{skill}</p>
                    ))}
                </div>
                
            </div>
            {address !== projectOwner && currentUserDetails.userType === 1 &&
                <PlaceBidForm id={id} projectOwner={projectOwner} />}
        </div>
    )
}

export default ProjectDetailTab