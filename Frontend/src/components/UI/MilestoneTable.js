import React, { useCallback, useState } from 'react';
import { Space, Table } from 'antd';
import { useWeb3 } from '@3rdweb/hooks';
import { getProjectsByUser, processPayment, transferMilestone } from '@/utils/service';
import { TransactionToastMessage } from './Toast';
import Spinner from './Spinner';
import { useContextState } from '@/context';

const MilestoneTable = ({milestones, owner, freelancer, projectId}) => {
  const [loading, setLoading] = useState(false);
  const {address, chainId, provider} = useWeb3();
  const [{}, dispatch] = useContextState();

  const handleProcessPayment = async (milestoneId) => {
    setLoading(true);
    await processPayment(chainId, provider, projectId, milestoneId, freelancer, txNotify);
    await getProjectsByUser(chainId, provider, address, dispatch);
    setLoading(false);
  }

  const handleTransferOwnership = async (milestoneId) => {
    setLoading(true);
    await transferMilestone(chainId, provider, projectId, milestoneId, owner, txNotify);
    await getProjectsByUser(chainId, provider, address, dispatch);
    setLoading(false);
  }

  const milestoneStatusIdToLabel = {
    0: "In Progress",
    1: "Payment Pending",
    2: "Completed",
    3: "Disputed"
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
      Status: milestoneStatusIdToLabel[milestones[i].status],
    });
  };

  const columns = [
    {
      title: 'Milestone Title',
      dataIndex: 'MilestoneTitle',
      width: 220,
    },
    {
      title: 'NFT Id',
      dataIndex: 'NFTId',
      width: 100,
    },
    {
      title: 'Amount',
      dataIndex: 'Amount',
      width: 100,
    },
    {
      title: 'Owner',
      dataIndex: 'Owner',
      width: 100,
    },
    {
      title: 'Status',
      dataIndex: 'Status',
      width: 130,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          {console.log(record.Status != 0, record)}
          {owner === address ? 
          <button disabled={loading || record.Status != "Payment Pending"} className='px-4 py-2 disabled:bg-gray-400 rounded-md text-white font-mono text-sm bg-blue-400' onClick={() => handleProcessPayment(record.key)}>Release Payment</button> :
          <button disabled={loading || record.Status != "In Progress"} className='px-4 py-2 disabled:bg-gray-400 rounded-md text-white font-mono text-sm bg-green-400' onClick={() => handleTransferOwnership(record.key)}>Request Payment</button>
        }
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
  </>
)};
export default MilestoneTable;