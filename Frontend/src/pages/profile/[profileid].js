import { ToastMessage } from '@/components/UI/Toast';
import { useContextState } from '@/context';
import { useWeb3 } from '@3rdweb/hooks';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react'

const ProfileDetail = () => {
    const [{currentUserDetails}] = useContextState();
    const {address} = useWeb3();
    const router = useRouter()
    const [profile, setProfile] = useState({
        address: '', pofileTokenId: '', tba: '', userType:'', profileInfo:''
    });
    const [pop, setPop] = useState(false)

    useEffect(() => {
        if (address && !currentUserDetails?.currentUserDetails?.profileTokenId) {
            setPop(true)
            router.push('/createprofile');
        }
    }, [address, currentUserDetails]);

    // useEffect(() => {
    //     if (pop) simpleNotify("info", "Profile Required", "Create a profile first!")
    // },[pop])

    // // const simpleNotify = useCallback((type, title, body) => {
    // //     ToastMessage({ type, title, body });
    // // }, []);

    useEffect(() => {
        setProfile(currentUserDetails.currentUserDetails);
    },[currentUserDetails, address])
    
    return (
        <>
            <div className="bg-palatte5 flex flex-wrap items-center justify-center">
                <div className="container max-full bg-white rounded shadow-lg transform duration-200 easy-in-out m-8">
                    <div className="h-2/4 sm:h-64 overflow-hidden">
                        <img className="w-full rounded-t"
                            src="https://images.unsplash.com/photo-1638803040283-7a5ffd48dad5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80"
                            alt="Photo by aldi sigun on Unsplash" />
                    </div>
                    <div className="flex justify-start px-5 -mt-12 mb-5">
                        <span clspanss="block relative h-32 w-32">
                            <img alt="Photo by aldi sigun on Unsplash"
                                src="https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTJ8fHByb2ZpbGUlMjBwaWN0dXJlfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60"
                                className="mx-auto object-cover rounded-full h-24 w-24 bg-white p-1" />
                        </span>
                    </div>
                    <div className="">
                        <div className="px-7 mb-8">
                            {/* <button className='py-2 px-4 float-right font-mono text-white bg-palatte1 rounded-md'>Edit Profiile</button> */}
                            <div className='flex flex-wrap gap-2 sm:gap-4'>
                                <h2 className="text-3xl font-bold text-palatte4 ">{profile?.profileInfo?.metadata?.fullName}</h2>
                                <h2 className="text-sm font-semibold mt-3 text-palatte2 ">0x...{profile?.address && profile.address.slice(profile.address.length -5)}</h2>

                            </div>
                            <p className="text-palatte5 mt-2">{profile?.profileInfo?.metadata?.headline}</p>
                            <div className='grid grid-cols-3 gap-4'>
                                <div className='my-4'>
                                    <div className='flex flex-wrap gap-2'>
                                        <h2 className="text-md font-semibold mt-1 text-palatte1 ">Profile NFT Id: {profile?.profileTokenId && profile.profileTokenId}</h2>
                                    </div>
                                        <h2 className="text-md font-bold font-mono mt-1 text-palatte1 ">Token Bound Address: 0x...{profile?.tba && profile.tba.slice(profile.tba.length -5)}</h2>
                                    <h2 className='font-semibold mt-4'>Skills</h2>
                                    <div className='flex flex-wrap gap-2 mt-2'>
                                        <p className='border px-4 py-2 w-auto rounded-md'>Javascript</p>
                                        <p className='border px-4 py-2 w-auto rounded-md'>Solidity</p>
                                    </div>
                                </div>
                                <div className='col-span-2 mt-4'>
                                    <h2 className='text-lg font-semibold text-palatte4'>Summary</h2>
                                    <p className="mt-2 text-gray-600 ">
                                    {profile?.profileInfo?.metadata?.summary}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProfileDetail;