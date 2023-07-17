import React, { useCallback, useState } from 'react';
import { Space, Table } from 'antd';
import { useWeb3 } from '@3rdweb/hooks';
import { processPayment, transferMilestone } from '@/utils/service';
import { TransactionToastMessage } from './Toast';
import Spinner from './Spinner';
import Modal from './Modal';

const MilestoneTable = ({milestones, postStatusIdToLabel, owner, freelancer, projectId}) => {
  const [loading, setLoading] = useState(false);
  const [modalStatus, setModalStatus] = useState(false);
  const [disputeData, setdisputeData] = useState({projectId: '', milestoneId: ''});
  const {address, chainId, provider} = useWeb3();

  const handleProcessPayment = async (milestoneId) => {
    setLoading(true);
    await processPayment(chainId, provider, projectId, milestoneId, freelancer, txNotify);
    setLoading(false);
  }

  const handleTransferOwnership = async (milestoneId) => {
    setLoading(true);
    await transferMilestone(chainId, provider, projectId, milestoneId, owner, txNotify);
    setLoading(false);
  }

  const handleDispute = async (projectId, milestoneId) => {
    setdisputeData({projectId, milestoneId});
    setModalStatus(true);
  }

  const txNotify = useCallback((type, title, txHash) => {
    TransactionToastMessage({ type, title, txHash });
  }, []);

  const data = [];
  for (let i = 0; i < milestones.length; i++) {
    data.push({
      key: i,
      MilestoneTitle: milestones[i].title,
      NFTId: milestones[i].tokenId,
      Amount: milestones[i].price,
      Owner: `0x...89bb`,
      Status: postStatusIdToLabel[milestones[i].status],
    });
  };

  const columns = [
    {
      title: 'Milestone Title',
      dataIndex: 'MilestoneTitle',
      width: 180,
    },
    {
      title: 'NFT Id',
      dataIndex: 'NFTId',
      width: 120,
    },
    {
      title: 'Amount',
      dataIndex: 'Amount',
      width: 120,
    },
    {
      title: 'Owner',
      dataIndex: 'Owner',
      width: 120,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          {owner === address ? 
          <button className='px-4 py-2 rounded-md text-white font-mono text-sm bg-blue-400' onClick={() => handleProcessPayment(record.key)}>Release Payment</button> :
          <button className='px-4 py-2 rounded-md text-white font-mono text-sm bg-blue-400' onClick={() => handleTransferOwnership(record.key)}>Request Payment</button>
        }
          <button className='px-4 py-2 rounded-md text-white font-mono text-sm bg-palatte4' onClick={() => handleDispute(record.key)}>Dispute</button>
        </Space>
      ),
    },
  ];

  return (
    <>
  {loading && <Spinner />}
  <Table
    columns={columns}
    dataSource={data}
    scroll={{
      y: 240,
    }}
  />
  {modalStatus && <Modal modalStatus={modalStatus} setModalStatus={setModalStatus} disputeData={disputeData}/>}
  </>
)};
export default MilestoneTable;