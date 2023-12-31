import { ToastMessage } from '@/components/UI/Toast';
import UserDetailsForm from '@/components/UserDetailsForm';
import { useContextState } from '@/context';
import { useIsMounted } from '@/lib/hooks/us-is-mounted';
import { useWeb3 } from '@3rdweb/hooks';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react'

const CreateProfile = () => {
    const [{ currentUserDetails }] = useContextState();
    const router = useRouter();
    const isMounted = useIsMounted();

    useEffect(() => {
        if (isMounted) {
            simpleNotify("info", "Profile Required", "Create a profile first!");
        }
    }, [isMounted])

    if (currentUserDetails?.profileTokenId) {
        router.push('/browse');
    }

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