import UserDetailsForm from '@/components/UserDetailsForm';
import { useContextState } from '@/context';
import { useWeb3 } from '@3rdweb/hooks';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react'

const CreateProfile = () => {
    const [{ currentUserDetails }] = useContextState();
    const { address } = useWeb3();
    const router = useRouter()

    useEffect(() => {
        if (address && currentUserDetails?.currentUserDetails?.profileTokenId) {
            router.push('/browse');
        }
    }, [address]);
    
    return (
        <>
            <div className='bg-white grid justify-items-center h-full pb-4 mt-24'>
                <div className='h-120 border-l-indigo-950 w-3/5 -mt-20 block justify-self-center bg-white shadow-md'>
                    <div className='px-4 pt-6'></div>
                        <UserDetailsForm />
                    </div>
            </div>
        </>
    )
};

export default CreateProfile;