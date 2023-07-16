import Nav from '@/components/Nav';
import { fetchNotifications } from '@/lib/pushProtocol'
import { useWeb3 } from '@3rdweb/hooks'
import React, { useEffect, useState } from 'react'

const Notifications = () => {
    const [allNotifications, setAllNotifications] = useState([]);
    const { address } = useWeb3();

    useEffect(() => {
        if (address) getNotifications();
    }, [address])

    const getNotifications = async () => {
        const res = await fetchNotifications(address);
        setAllNotifications(res)
    }
    return (
        <>
            <Nav />
            <div className='m-12 bg-white'>
                <h2 className=' p-4 text-center font-bold text-2xl'>Notifications</h2>
                <hr />

                {allNotifications && allNotifications.map(({ notification }, index) => (
                    <div className='mx-4 my-6 p-4 border border-gray-300 rounded-md' key={index}>
                        <h2 className='text-lg font-semibold'>{notification.title}</h2>
                        <h2 className='text-md font-light'>{notification.body}</h2>
                    </div>
                ))}
            </div>
        </>

    )
}

export default Notifications;