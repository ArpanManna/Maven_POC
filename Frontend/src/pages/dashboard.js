import Accordion from '@/components/Accordion';
import Nav from '@/components/Nav'
import Modal from '@/components/UI/Modal';
import { OptInChannel, sendNotifications } from '@/lib/pushProtocol';
import { getProjectsByUser, processPayment, transferMilestone } from '@/utils/service';
import { useWeb3 } from '@3rdweb/hooks'
import { Space } from 'antd';
import moment from 'moment';
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


