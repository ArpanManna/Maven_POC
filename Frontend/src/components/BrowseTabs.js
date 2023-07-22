import React from 'react';
import { Tabs } from 'antd';
import ProjectCards from './ProjectCards';
import DisputedProjectsSection from './DisputedProjectsSection';

const items = [
  {
    key: '1',
    label: `Ongoing Projects`,
    children: <ProjectCards />,
  },
  {
    key: '2',
    label: `Disputed Projects`,
    children: <DisputedProjectsSection />,
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