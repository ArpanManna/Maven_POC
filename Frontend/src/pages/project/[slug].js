import Nav from '@/components/Nav'
import ProjectDetailTab from '@/components/ProjectDetailTab'
import ProposalsTab from '@/components/ProposalsTab'
import { useIsMounted } from '@/lib/hooks/us-is-mounted'
import { getJobProposalsByID } from '@/utils/service'
import { useWeb3 } from '@3rdweb/hooks'
import { Tabs } from 'antd'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

const ProjectDetail = () => {
  const [proposals, setProposals] = useState([]);
  const {chainId, provider} = useWeb3();
  const isMounted = useIsMounted();
  const router = useRouter();
  const data = router.query;
  
  const jobDetail = JSON.parse(data.post)
  const {id, projectName, projectDescription, owner, skillsRequired, currency, priceFrom, priceTo} = jobDetail;

  const items = [
    {
      key: '1',
      label: `Details`,
      children: <ProjectDetailTab id ={id} projectOwner={owner} projectName={projectName} projectDescription={projectDescription} skillsRequired={skillsRequired} currency={currency} priceFrom={priceFrom} priceTo={priceTo} />,
    },
    {
      key: '2',
      label: `Proposals`,
      children: <ProposalsTab id={id} proposals={proposals} projectOwner={owner}/>,
    }
  ];


  useEffect(() => {
    if (chainId && isMounted) getAllProposals();
  },[chainId, isMounted])

  const getAllProposals = async() => {
    const res = await getJobProposalsByID(chainId, provider, id);
    setProposals(res)
  }

  return (
    <div className=''>
      <Nav />
      <div className='container px-8 py-12'>
        <div className='flex justify-between'>
          <h2 className='text-3xl mb-2'>{projectName}</h2>
          <div className=''>
            <div className='flex font-bold flex-wrap gap-4'>
              <h2>Bids</h2>
              <h2>Average Bid</h2>
            </div>
            <div className='flex flex-wrap gap-8'>
              <h2>20</h2>
              <h2>$200</h2>
            </div>
          </div>

        </div>
{/* 
        <Tabs>
          <Tab component={<ProjectDetailTab id ={id} projectOwner={owner} projectName={projectName} projectDescription={projectDescription} skillsRequired={skillsRequired} currency={currency} priceFrom={priceFrom} priceTo={priceTo} />} active>Details</Tab>
          <Tab component={<ProposalsTab id={id} proposals={proposals} projectOwner={owner}/>}>
            Proposals
          </Tab>
        </Tabs> */}
      <Tabs defaultActiveKey="1" items={items} />

      </div>
    </div>
  )
}

export default ProjectDetail