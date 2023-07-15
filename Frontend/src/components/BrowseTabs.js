import React from 'react';
import { Tabs } from 'antd';
import ProjectCards from './ProjectCards';
import FreelancerSection from './FreelancerSection';

const items = [
  {
    key: '1',
    label: `Projects`,
    children: <ProjectCards />,
  },
  {
    key: '2',
    label: `Freelancers`,
    children: <FreelancerSection />,
  }
];

const BrowseTabs = () => {
  return (
    <div className='px-12'>
      <Tabs defaultActiveKey="1" items={items} />
    </div>
    )
}
export default BrowseTabs;