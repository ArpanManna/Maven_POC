import React, { useState } from 'react'

const Item = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);
  
    return (
      <div className="border-b">
        <button
          type="button"
          aria-label="Open item"
          title="Open item"
          className="flex items-center justify-between w-full p-4 focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          <p className="text-lg font-medium">{title}</p>
          <svg
            viewBox="0 0 24 24"
            className={`w-3 text-gray-600 transform transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
          >
            <polyline
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeMiterlimit="10"
              points="2,7 12,17 22,7"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        {isOpen && (
          <div className="p-4 pt-0">
            <p className="text-gray-700">{children}</p>
          </div>
        )}
      </div>
    );
  };
  
  export const Faq = () => {
    return (
      <div className="px-4 py-16 bg-gray-200 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20 ">
        <div className="max-w-xl sm:mx-auto lg:max-w-2xl">
          <div className="max-w-xl mb-10 md:mx-auto sm:text-center lg:max-w-xl md:mb-12">
            <h1 className="max-w-lg mb-6 font-sans text-3xl font-bold leading-none tracking-tight text-gray-900 sm:text-4xl md:mx-auto">
              FAQ
            </h1>
            <p className="text-normal text-gray-700 md:text-lg ">
              Your questions, Our solutions
            </p>
          </div>
          <div className="space-y-4">
            <Item title="How Maven works?">
              Maven create a Profile NFT for freelancers and clients and attach a ERC6551 Token Bound Address(TBA) with it. So, each TBA can now hold multiple Job NFTs. TBA of Job NFTs holds multiple milestone NFTs. Hence, the whole job lifecycle is protected using ERC-6551.
            </Item>
            <Item title="How Job Ownership Protection is handled?">
              When client selects a freelancer bid, corresponding Job NFT and associated TBA is transferred to the freelancer. On completion of every milestone, milestone NFT ownership is transferred back to client's Profile TBA. In case any dispute occurs, milestone ownership will be transferred to the smart contract. Based on dispute resolution result, ownership will be transferred either to client or freelancer. On completion of all milestones of a Job, the parent Job NFT is burned.
            </Item>
            <Item title="How are we ensuring real-time communication?">
              As the communication protocol of Web3, Maven uses Push Protocol to ensure real-time notification and Chat. For example, whenever a freelancer bids for a client project, the client gets notified immediately. Maven also allows real-time chat support between client and freelancer to discuss anything.
            </Item>
            <Item title="How voters are selcted anonymously?">
              Whenever a dispute arises for a particular job then the platform fetches top "k-eligible" freelancers from polybase who have worked on such projects. Freelancers are then selected "anonymously" and "randomly" via chainlink VRF to be part of "Voting Panel". Only members of voting panel are allowed to resolve the dispute via voting.
            </Item>
          </div>
        </div>
      </div>
    );
  };