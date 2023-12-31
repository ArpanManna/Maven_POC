import ProjectDetailTab from '@/components/ProjectDetailTab'
import ProposalsTab from '@/components/ProposalsTab'
import MyChat from '@/components/PushChat'
import { useIsMounted } from '@/lib/hooks/us-is-mounted'
import { getJobProposalsByID, getProjectById } from '@/utils/service'
import { useWeb3 } from '@3rdweb/hooks'
import { Tabs } from 'antd'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

const ProjectDetail = () => {
  const [proposals, setProposals] = useState([]);
  const [projectDetails, setProjectDetails] = useState({
    metadata: { projectName: '', projectDescription: '', skillsRequired: [], priceFrom: '', priceTo: '' }, currency: '', owner: '', bidCount: '', tokenId: '', tba: ''
  });

  const { chainId, provider } = useWeb3();
  const isMounted = useIsMounted();
  const router = useRouter();
  const data = router.query;
  const id = data.slug;

  useEffect(() => {
    if (chainId && isMounted) {
      getAllProposals();
      getProjectDetails()
    }
  }, [chainId, isMounted])

  const getAllProposals = async () => {
    const res = await getJobProposalsByID(chainId, provider, id);
    setProposals(res)
  }

  const getProjectDetails = async () => {
    const res = await getProjectById(chainId, provider, id);
    setProjectDetails(res)
  }
  const { metadata: { projectName, projectDescription, skillsRequired, priceFrom, priceTo }, owner, currency, bidCount, tokenId, tba } = projectDetails;

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

            <h2 className='text-sm font-semibold text-palatte3'>Budget: {priceFrom} wei to {priceTo} wei</h2>
          </div>
        </div>
        <Tabs defaultActiveKey="1" items={items} />
      </div>
      <MyChat _signer={provider?.getSigner()} clientAddress={owner} />
    </div>
  )
}

export default ProjectDetail