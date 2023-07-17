import Accordion from '@/components/Accordion';
import Nav from '@/components/Nav'
import { Space } from 'antd';
import React, { useEffect, useState } from 'react'

const Dashboard = () => {
  return (
    <>
      <Nav />
      <div className='px-12 py-8'>
        <Space direction="vertical" className='w-full'>
          <Accordion />
        </Space>
      </div>
    </>
  )
}

export default Dashboard


