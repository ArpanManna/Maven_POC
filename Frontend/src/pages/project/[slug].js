import ProjectDetailTab from '@/components/ProjectDetailTab'
import ProposalsTab from '@/components/ProposalsTab'
import MyChat from '@/components/PushChat'
import { useIsMounted } from '@/lib/hooks/us-is-mounted'
import { getJobProposalsByID, getProjectById } from '@/utils/service'
import { useWeb3 } from '@3rdweb/hooks'
import { Tabs } from 'antd'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
// import MyChat from '@/components/PushChat';
import * as db from '@/utils/polybase';

const ProjectDetail = () => {
  const [proposals, setProposals] = useState([]);
  const [projectDetails, setProjectDetails] = useState({
    metadata: { projectName: '', projectDescription: '', skillsRequired: [], priceFrom: '', priceTo: '' }, currency: '', owner: '', bidCount: '', lowestBid: '', highestBid: '', tokenId: '', tba: ''
  });

  const { chainId, provider } = useWeb3();
  const isMounted = useIsMounted();
  const router = useRouter();
  const data = router.query;
  const id = data.slug;

  useEffect(() => {
    if (chainId && isMounted) {
      // getAllProposals();
      getProjectDetails()
    }
  }, [chainId, isMounted])

  const getAllProposals = async () => {
    const res = await getJobProposalsByID(chainId, provider, id);
    setProposals(res)
  }

  const getProjectDetails = async () => {
    try {
      const res = await db.getJob(id);
      const parsedRes = {
        id: parseInt(res.id, 10),
        owner: res.address,
        freelancer: '0x0000000000000000000000000000000000000000',
        lowestBid: parseInt(res?.lowestBid, 10),
        highestBid: parseInt(res?.highestBid, 10),
        createdOn: res.postDate,
        deadline: res.deadline,
        file: res.mediaUris,
        finalBid: 0,
        status: 0,
        tokenId: parseInt(res.tokenId, 10),
        tba: res.tba,
        metadata: {
          projectName: res.title,
          projectDescription: res.description,
          priceFrom: res.budgetLowerLimit,
          priceTo: res.budgetUpperLimit,
          skillsRequired: res.skillIds,
        },
        assetsHolding: 0,
        bidCount: res.bids.length,
      };
      const bids = [];
      for (const bid of res.bids) {
        bids.push({
          proposalId: parseInt(bid.id.split('_')[0], 10),
          owner: bid.address,
          bidPrice: parseInt(bid.bidAmount, 10),
          estimatedTimeline: parseInt(bid.expectedDelivery, 10),
          proposal: {
            proposal: bid.description,
            milestones: bid.milestones,
          }
        });
      }
      setProposals(bids);
      setProjectDetails(parsedRes);
      return;
    } catch (err) {
      console.log(err);
    }
    const res1 = await getProjectById(chainId, provider, id);
    setProjectDetails(res1)
    const res2 = await getJobProposalsByID(chainId, provider, id);
    setProposals(res2)
  }
  const { metadata: { projectName, projectDescription, skillsRequired, priceFrom, priceTo }, owner, currency, bidCount, tokenId, tba, lowestBid, highestBid } = projectDetails;

  const items = [
    {
      key: '1',
      label: `Details`,
      children: <ProjectDetailTab id={id} projectOwner={owner} projectName={projectName} projectDescription={projectDescription} skillsRequired={skillsRequired} currency={currency} priceFrom={priceFrom} priceTo={priceTo} bidCount={bidCount} tba={tba} tokenId={tokenId} />,
    },
    {
      key: '2',
      label: `Proposals`,
      children: <ProposalsTab id={id} proposals={proposals} projectOwner={owner} />,
    }
  ];

  return (
    <div className=''>
      <div className='container px-8 py-12'>
        <div className='flex justify-between'>
          <h2 className='text-3xl mb-3'>{projectName}</h2>
          <div className='py-2 px-4 shadow-sm rounded-md bg-gray-50 border'>
            <h2 className='text-sm font-semibold text-palatte3'>Total Bids: {bidCount}</h2>

            <h2 className='text-sm font-semibold text-palatte3'>{lowestBid ? 'Bid Price' : 'Budget'}: {lowestBid || priceFrom} wei to {highestBid || priceTo} wei</h2>
          </div>
        </div>
        <Tabs defaultActiveKey="1" items={items} />
      </div>
      <MyChat _signer={provider?.getSigner()} clientAddress={owner} />
    </div>
  )
}

export default ProjectDetail