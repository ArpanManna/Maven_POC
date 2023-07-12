import Nav from '@/components/Nav'
import { OptInChannel, sendNotifications } from '@/lib/pushProtocol';
import { getProjectsByUser } from '@/utils/service';
import { useWeb3 } from '@3rdweb/hooks'
import React, { useEffect, useState } from 'react'

const Dashboard = () => {
    const {address, chainId, provider} = useWeb3();
    const [projects, setProjects] = useState([]);

    const handleSendNotification = async () => {
        // const subscribe = await OptInChannel(address, provider);
        const res = sendNotifications(provider.getSigner(), "Push Protocol Testing", "Sending Message from account 1 to account 4. (Messgae 3)", "0x902c3bdF5c0d54fB0eC901AFF8293f14750c6d45")
    }

    useEffect(() => {
      if (chainId) getProjectByAddress()
    },[chainId]);

    const getProjectByAddress = async() => {
      const data = await getProjectsByUser(chainId, provider, address);
      setProjects(data)
    }

  return (
    <>
    <Nav />
    <div className='p-4 '>
        {/* <button className='border px-4 py-2 bg-green-300' onClick={handleSendNotification}>Send Notification</button> */}
    {
      projects && projects.map(({id, createdOn, owner, fileURI, metadata: {projectName, projectDescription}, deadline, finalBid, lowestBid, highestBid,  }) => (
        <div key={id} className='border p-4'>
          <h2 className='text-lg font-bold my-2 '> {projectName}</h2>
          <p className='text-sm my-2'>Owner: {owner}</p>
          <h2 className='text-md font-normal'>{projectDescription}</h2>
        </div>
      ))
    }
    </div>
    </>
  )
}

export default Dashboard


