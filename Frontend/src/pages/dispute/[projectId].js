import Nav from '@/components/Nav'
import React, { useState } from 'react'
import avatar4 from '../../assets/imgs/avatar2.svg'
import Image from 'next/image'
import { Input } from 'antd'
import { useRouter } from 'next/router'
import { getVotingResult, voteForDisputeResolution } from '@/utils/service'
import { useWeb3 } from '@3rdweb/hooks'
import Spinner from '@/components/UI/Spinner'

const MilestoneDispute = () => {
    const { provider, chainId } = useWeb3();
    const router = useRouter();
    const { projectId } = router.query;

    const [random, setRandom] = useState();
    const [result, setResult] = useState();
    const [loading, setLoading] = useState(false);

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

    const handleVote = async (e) => {
        if (random && chainId) {
            setLoading(true);
            await voteForDisputeResolution(chainId, provider, projectId, e.target.value, random);
            setLoading(false);
        }
    }

    const handleInputChange = (e) => {
        const { value: inputValue } = e.target;
        const reg = /^-?\d*(\.\d*)?$/;
        if (reg.test(inputValue) || inputValue === '' || inputValue === '-') {
            setRandom(inputValue);
        }
    };

    const handleVotingResult = async () => {
        const res = await getVotingResult(chainId, provider, projectId);
        setResult(res);
    }
    return (
        <div>
            {loading && <Spinner />}
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
                        <div className='flex justify-around p-8 font-mono'>
                            <div>
                                <h2 className='my-1'>Project Id: {projectId}</h2>

                                <h2 className='my-1'>Current Owner: 0x..dsjd3 (Freelancer)</h2>
                                <h2 className='my-1'>Dispute Reason: Improper project requirements</h2>
                            </div>
                            <div>
                                <h2 className='my-1'>Client: 0x..9023k</h2>
                                <h2 className='my-1'>Freelancer: 0x..dsjd3</h2>
                            </div>
                        </div>
                        <hr />
                        <div className='grid grid-cols-2 gap-8 my-8'>
                            <div className='px-8 text-center'>
                                <h2 className='text-lg my-2 font-semibold font-mono'> Choose a random Number: </h2>
                                <Input className='w-40 border-gray-800' value={random} onChange={handleInputChange} maxLength={4} placeholder='Random Number' />
                            </div>
                            <div>
                                <h2 className='text-lg my-2 font-semibold font-mono'>Vote:</h2>
                                <button className='px-4 mr-4 py-1 bg-palatte2 rounded-md' value={1} onClick={(e) => handleVote(e)}>Freelancer</button>
                                <button className='px-4  py-1 bg-palatte4 rounded-md' value={2} onClick={(e) => handleVote(e)}>Client</button>
                            </div>
                        </div>
                        <div className='flex px-8 flex-wrap gap-8 pb-2'>
                            <button className='px-4  py-1 bg-palatte4 rounded-md' onClick={(e) => handleVotingResult(e)}>Get Voting Result</button>
                            {result && <p className='font-mono font-semibold'>{result === 1 ? "Freelancer" : "Client"}</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MilestoneDispute