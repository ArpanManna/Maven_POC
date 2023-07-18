import React, { useCallback, useEffect, useState } from 'react'
import PlaceBidForm from './PlaceBidForm'
import { useWeb3 } from '@3rdweb/hooks'
import { useContextState } from '@/context';
import { useRouter } from 'next/router';
import { ToastMessage } from './UI/Toast';

const ProjectDetailTab = ({ id, projectDescription, projectOwner, skillsRequired, priceFrom, priceTo }) => {
    const [{ currentUserDetails }] = useContextState();
    const [pop, setPop] = useState(false);
    const { address } = useWeb3();
    const router = useRouter()

    useEffect(() => {
        if (address && !currentUserDetails?.currentUserDetails?.profileTokenId) {
            setPop(true)
            router.push('/createprofile');
        }
    }, [address]);

    useEffect(() => {
        if (pop) simpleNotify("info", "Profile Required", "Create a profile first!")
    },[pop])

    const simpleNotify = useCallback((type, title, body) => {
        ToastMessage({ type, title, body });
    }, []);

    return (
        <div className='container text-black p-4 shadow-md rounded-md'>
            <div className='p-4'>
                <div className='flex justify-between'>
                    <h2 className='text-xl mt-3 font-semibold font-mono'> Project Details </h2>
                    <div>
                        <h2 className='text-sm'>{priceFrom} - {priceTo}</h2>
                        <h2 className='text-sm'>Bidding ends in 6 hours, 2 days</h2>
                    </div>
                </div>
                <p className='my-8'>
                    {projectDescription}
                </p>
                <h2 className='text-lg font-semibold'> Skills:</h2>
                <div className='flex flex-wrap gap-4'>
                    {skillsRequired && skillsRequired.map((skill) => (
                        <p key={skill} className='font-semibold my-4 border-2 rounded-lg px-3 py-1'>{skill}</p>
                    ))}
                </div>

            </div>
            {address !== projectOwner &&
                <PlaceBidForm id={id} projectOwner={projectOwner} />}
        </div>
    )
}

export default ProjectDetailTab