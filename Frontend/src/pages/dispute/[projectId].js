import Nav from '@/components/Nav'
import React, { useCallback, useEffect, useState } from 'react'
import avatar4 from '../../assets/imgs/avatar2.svg'
import Image from 'next/image'
import { Input } from 'antd'
import { useRouter } from 'next/router'
import { getDisputeDetails, getProjectById, getVotingResult, voteForDisputeResolution } from '@/utils/service'
import { useWeb3 } from '@3rdweb/hooks'
import Spinner from '@/components/UI/Spinner'
import { TransactionToastMessage } from '@/components/UI/Toast'
import addresses from "../../constants/Contracts.json"
import moment from 'moment'

const MilestoneDispute = () => {
    const { provider, chainId } = useWeb3();
    const router = useRouter();
    const { projectId } = router.query;

    const [random, setRandom] = useState();
    const [result, setResult] = useState(0);
    const [projectDetails, setProjectDetails] = useState({
        owner: "",
        freelancer: ""
    });
    const [disputeDetail, setDisputeDetail] = useState(
        {disputeReason: '', duration:'', disputeRaisedBy:'', voterList:''}
    );
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (chainId && projectId) getDisputeData();
    }, [chainId, projectId]);

    const getDisputeData = async () => {
        const res = await getProjectById(chainId, provider, projectId);
        const dispute = await getDisputeDetails(chainId, provider, projectId);
        
        setProjectDetails(res);
        setDisputeDetail(dispute)
    }

    const votingResultLabel = {
        0: "None",
        1: "Freelancer",
        2: "Client"
    }

    const handleVote = async (e) => {
        if (random && chainId) {
            setLoading(true);
            await voteForDisputeResolution(chainId, provider, projectId, e.target.value, random, txNotify);
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
        console.log(res)
        console.log(typeof res)
        setResult(res);
    }

    const txNotify = useCallback((type, title, txHash) => {
        TransactionToastMessage({ type, title, txHash });
    }, []);

    const {owner, freelancer} = projectDetails;
    const {disputeReason, duration, disputeRaisedBy, voterList} = disputeDetail;

    // console.log(disputeDetail)
    // const now = moment().unix();
    
    // const remaining = now - duration;
    // console.log("now",now, "duration", duration, remaining)
    // console.log(moment.duration(remaining).minutes())
    return (
        <div>
            {loading && <Spinner />}
            <div className='grid  grid-cols-6 gap-2 py-8 px-12'>
                <div className='col-span-1 border p-4'>
                    <h2 className='text-center font-bold my-2'> Voter List</h2>
                    <hr />
                    {voterList && voterList.map((voter, i) => (
                        <div key={i} className='flex flex-wrap gap-2 items-center'>
                            <Image src={avatar4} height={20} width={20} alt='avatar' />
                            <p className='my-2 font-mono text-center' key={i}>0x...{voter.slice(36)}</p>
                        </div>
                    ))}
                </div>

                <div className='col-span-5 border'>
                    <div className=''>
                        <h2 className='font-bold py-4 text-center font-mono'>DISPUTED PROJECT DETAILS</h2>
                        <hr />
                        <div className='flex justify-around p-8 font-mono'>
                            <div>
                                <h2 className='my-1'>Project Id: {projectId}</h2>

                                <h2 className='my-1'>Current Owner: 0x...{addresses[80001].disputeResolution.slice(36)} (Dispute Resolution Contract)</h2>
                                <h2 className='my-1'>Dispute Raised By : 0x...{disputeRaisedBy.slice(36)}</h2>
                                
                                <h2 className='my-1'>Dispute Reason: {disputeReason}</h2>
                            </div>
                            <div>
                                <h2 className='my-1'>Client: 0x...{owner.slice(36)}</h2>
                                <h2 className='my-1'>Freelancer: 0x...{freelancer.slice(36)}</h2>
                            </div>
                        </div>
                        <div className='text-right'>
                            {/* <p>{remaining && remaining}</p> */}
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
                            <button className='text-white bg-gradient-to-r mt-4 from-palatte1 to-palatte4 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-30 shadow-lg shadow-cyan-500/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-4' onClick={(e) => handleVotingResult(e)}>Get Voting Result</button>
                            <h2 className='font-bold mt-6'>
                                {votingResultLabel[result]}</h2>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MilestoneDispute