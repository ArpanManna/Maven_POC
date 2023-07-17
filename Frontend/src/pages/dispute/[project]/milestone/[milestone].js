import Nav from '@/components/Nav'
import React, { useState } from 'react'
import avatar4 from '../../../../assets/imgs/avatar4.svg'
import Image from 'next/image'
import { Input } from 'antd'

const milestoneDispute = () => {
    const [random, setRandom] = useState();

    const voters = [
        "0xae7ab96520de3a18e5e111b5eaab095312d7fe84",
        "0xae7ab96520de3a18e5e111b5eaab095312d7fe84",
        "0xae7ab96520de3a18e5e111b5eaab095312d7fe84",
        "0xae7ab96520de3a18e5e111b5eaab095312d7fe84",
        "0xae7ab96520de3a18e5e111b5eaab095312d7fe84",
        "0xae7ab96520de3a18e5e111b5eaab095312d7fe84",
        "0xae7ab96520de3a18e5e111b5eaab095312d7fe84",
        "0xae7ab96520de3a18e5e111b5eaab095312d7fe84",
    ]
    return (
        <div>
            <Nav />
            <div className='border grid  grid-cols-6 gap-2 py-8 shadow-md px-12'>
                <div className='col-span-1 border p-4'>
                    <h2 className='text-center font-bold my-2'> Voter List</h2>
                    <hr />
                    {voters.map((voter, i) => (
                        <div key={i} className='flex flex-wrap gap-2 items-center'>
                            <Image src={avatar4} height={20} width={20} alt='avatar' />
                            <p className='my-2 font-mono text-center' key={i}>0x...{voter.slice(voter.length - 5)}</p>

                        </div>
                    ))}
                </div>

                <div className='col-span-5 border'>
                    <div className=''>
                        <h2 className='font-bold py-4 text-center font-mono'>DISPUTED MILESTONE DETAILS</h2>
                        <hr />
                        <div className='flex justify-around py-12 px-4'>
                            <div>
                                <h2 className='my-1 font-serif'>Project Id: 44</h2>
                                <h2 className='my-1 font-serif'>Milestone Id: 3</h2>

                                <h2 className='my-1 font-serif'>Current Owner: 0x..dsjd3 (Freelancer)</h2>
                                <h2 className='my-1 font-serif'>Dispute Reason: Improper project requirements</h2>
                            </div>
                            <div>
                                <h2 className='my-1 font-serif'>Client: 0x..9023k</h2>
                                <h2 className='my-1 font-serif'>Freelancer: 0x..dsjd3</h2>
                            </div>
                        </div>
                        <div className='p-4'>

                        </div>
                        <hr />
                        <div className='grid grid-cols-2 gap-8 my-8'>
                            <div className='px-8 text-center'>
                                <h2 className='text-lg my-2 font-semibold font-mono'> Choose a random Number: </h2>
                                <Input className='w-40 border-gray-800' value={random} onChange={(e) => setRandom(e.target.value)} placeholder='Random Number' />
                            </div>
                            <div>
                                <h2 className='text-lg my-2 font-semibold font-mono'>Vote:</h2>
                                <button className='px-4 mr-4 py-1 bg-palatte4 rounded-md' >Client</button>
                                <button className='px-4 py-1 bg-palatte2 rounded-md'>Freelancer</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default milestoneDispute