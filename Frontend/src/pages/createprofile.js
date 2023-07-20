import { ToastMessage } from '@/components/UI/Toast';
import UserDetailsForm from '@/components/UserDetailsForm';
import { useContextState } from '@/context';
import { useWeb3 } from '@3rdweb/hooks';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react'

const CreateProfile = () => {
    const [{ currentUserDetails }] = useContextState();
    const { address } = useWeb3();
    const [open, setOpen] = useState(false);
    const router = useRouter()

    useEffect(() => {
        setTimeout(redirectToBrowse, 2000)
    }, [address]);

    const redirectToBrowse = () => {
        if (address && currentUserDetails?.profileTokenId) {
            router.push('/browse');
        }
    }
    
    useEffect(() => {
        setOpen(true);
        if(open){
            simpleNotify("info", "Profile Required", "Create a profile first!");
        }
        setOpen(false);
    }, [])

    const simpleNotify = useCallback((type, title, body) => {
        ToastMessage({ type, title, body });
    }, []);

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