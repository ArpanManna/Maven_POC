import ProjectForm from '@/components/ProjectForm';
import { useContextState } from '@/context';
import { useWeb3 } from '@3rdweb/hooks';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

const CreatePost = () => {
    const [{ currentUserDetails }] = useContextState();
    const { address } = useWeb3();
    const router = useRouter();

    useEffect(() => {
        if (address && !currentUserDetails?.profileTokenId) {
            router.push('/createprofile');
        }
    }, [address, currentUserDetails]);

    console.log(currentUserDetails)

    return (
        <>
        <div className='min-h-screen'>
            <div className='bg-palatte1 h-80 content-center'>
                <div className='px-20 pt-40 grid justify-items-start lg:ml-44 w-3/5 ml-4'>
                    <h1 className='text-3xl font-mono'>Tell us what you need done</h1>
                    <p className='leading-normal pb-4 font-mono'>Contact skilled freelancers within minutes. </p>
                </div>
            </div>
            <div className='bg-white grid justify-items-center h-full pb-4'>
                <div className='h-120 border-l-indigo-950 w-3/5 -mt-20 block justify-self-center bg-white shadow-md'>
                    <div className='px-4 pt-6'>
                       <ProjectForm />
                    </div>
                </div>
            </div>

        </div>
        </>
    )
}

export default CreatePost