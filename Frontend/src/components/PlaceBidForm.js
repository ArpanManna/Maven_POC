import { uploadFileToIPFS } from '@/lib/IPFSClient';
import { placeBid } from '@/utils/service';
import { useWeb3 } from '@3rdweb/hooks';
import moment from 'moment';
import React, { useCallback, useState } from 'react'
import 'react-calendar/dist/Calendar.css';
import Spinner from './UI/Spinner';
import ToastMessage, { TransactionToastMessage } from './UI/Toast';
import { DatePicker, Input } from 'antd';

const PlaceBidForm = ({ id, projectOwner }) => {
  const [loading, setLoading] = useState(false);
  const [milestones, setMileStones] = useState([
    { title: '', price: '' },
  ]);
  const [proposalForm, setProposalForm] = useState({
    bidPrice: "",
    proposal: ""
  });
  const [deadline, setDeadline] = useState(new Date());
  const { bidPrice, proposal } = proposalForm;

  const { chainId, provider } = useWeb3();

  const handleMilestoneChange = (event, index) => {
    let data = [...milestones];
    const { name, value } = event.target;
    if (name === 'price') {
      const reg = /^-?\d*(\.\d*)?$/;
      if (reg.test(value) || value === '' || value === '-') {
        data[index][name] = value;
        setMileStones(data);
      }
    } else {
      data[index][name] = value;
      setMileStones(data);
    }

  }

  const addFields = () => {
    let object = {
      title: '',
      price: ''
    }
    setMileStones([...milestones, object])
  }

  const removeFields = (index) => {
    let data = [...milestones];
    data.splice(index, 1)
    setMileStones(data)
  }

  const handleFormChange = async (e) => {
    const { name, value } = e.target;
    if (name === "bidPrice") {
      const reg = /^-?\d*(\.\d*)?$/;
      if (reg.test(value) || value === '' || value === '-') {
        setProposalForm({
          ...proposalForm, [name]: value
        })
      }
    } else {
      setProposalForm({
        ...proposalForm, [name]: value
      })
    }

  }

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (bidPrice && deadline && milestones.length > 0 && proposal) {
      setLoading(true);
      let milestoneArray = milestones.map(({ price, ...rest }) => price);
      const expectedTimeline = moment(deadline).unix()
      const proposalURI = await uploadFileToIPFS(JSON.stringify({ proposal, milestones }))
      await placeBid(chainId, provider, id, bidPrice, expectedTimeline, proposalURI, milestoneArray, projectOwner, txNotify)
      setLoading(false);
      setMileStones([
        { title: '', price: '' },
      ]);
      setProposalForm({
        bidPrice: "",
        proposal: ""
      })
      setDeadline(new Date())
    }
  }

  const txNotify = useCallback((type, title, txHash) => {
    TransactionToastMessage({ type, title, txHash });
  }, []);

  const handleDeadlineChange = (date, dateString) => {
    setDeadline(date);
  };

  return (
    <div className='container border-t-2'>
      <div className='p-4'>
        <h2 className='text-lg py-2 border-b font-mono font-semibold'> Place a bid on this project</h2>
        <p className='text-sm my-6 font-medium'> You will be able to edit your bid until the project is awarded to someone.</p>
        <Input id="bidPrice" className='py-2 border-gray-400 placeholder:text-gray-400' name="bidPrice" value={bidPrice} onChange={handleFormChange} required="" placeholder="Your bid price" />
        <h2 className='text-lg pt-6 pb-2 font-mono font-semibold'>Expected Deadline</h2>
        <DatePicker onChange={handleDeadlineChange} className='border-gray-600 placeholder:text-gray-400 py-1.5' />
        <h2 className='text-lg pt-6 pb-2 font-mono font-semibold'>Describe your proposal (minimum 100 characters)</h2>
        <div className="relative">
          <textarea id="proposal" maxLength={400} name="proposal" value={proposal} onChange={handleFormChange} className="w-full bg-gray-100 mt-1 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white h-32 text-base outline-none text-gray-800 py-1 px-3 resize-none leading-6 transition-colors focus:border-transparent focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-300 duration-200 ease-in-out" />
        </div>
        <h2 className='text-lg pt-3 font-mono font-semibold'>Milestones:</h2>
        {milestones.map((milestone, index) =>
        (
          <div key={index} className='flex flex-wrap gap-4 my-2'>
            <Input
              name='title'
              className="block px-4 py-2.5 w-1/3 text-mono text-gray-800 font-semibold placeholder-gray-400 placeholder:font-semibold transition duration-500 ease-in-out transform border-gray-400 rounded-lg"
              placeholder='Milestone'
              onChange={event => handleMilestoneChange(event, index)}
              value={milestones.title}
            />
            <Input
              name='price'
              className="block px-4 py-2.5 w-1/3 text-mono text-gray-800 font-semibold placeholder-gray-400 placeholder:font-semibold transition duration-500 ease-in-out transform border-gray-400 rounded-lg"
              placeholder='Price'
              onChange={event => handleMilestoneChange(event, index)}
              value={milestones.price}
            />
            <button onClick={() => removeFields(index)} className='text-white bg-gradient-to-r from-palatte2 to-palatte4 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-30 shadow-lg shadow-cyan-500/50 font-medium rounded-lg text-sm px-5 py-2 text-center'>Remove</button>
          </div>
        )
        )}

        <button onClick={addFields} className='text-white  bg-gradient-to-r mt-2 from-palatte3 to-palatte5 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-30 shadow-lg shadow-cyan-500/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-4'>Add More..</button>
        <br />
        {loading ? <Spinner /> :
          <button type="button" onClick={handleFormSubmit} className="text-white bg-gradient-to-r mt-2 from-blue-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-30 shadow-lg shadow-cyan-500/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-4">Place Bid</button>
        }
      </div>
    </div>
  )
}

export default PlaceBidForm