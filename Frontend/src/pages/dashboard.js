import Accordion from '@/components/Accordion';
import { Space } from 'antd';
import React from 'react'

const Dashboard = () => {
  return (
    <>
      <div className='px-12 py-8'>
        <Space direction="vertical" className='w-full'>
          <Accordion />
        </Space>
      </div>
    </>
  )
}

export default Dashboard


