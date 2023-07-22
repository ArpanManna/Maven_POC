import React from 'react';
import feature1 from "../assets/imgs/feature1.jpg"
import Image from 'next/image';

const ProtocolFeatures = () => {
    const features = [
        {
            "title": "Profile Creation",
            "description": "Whenever a client posts a job then ERC-721 token is minted for the job. Then, a token bound account (TBA) wallet address is generated using ERC-6551 and associated with the ERC-721 job NFT. These job NFTs are further associated inside profile NFTs to protect ownership of jobs for each client initially.",
            "imgSrc": feature1
        },
        {
            "title": "Post Job",
            "description": "dispute arises, the ownership of the job NFT and the uncompleted milestone NFTs are transferred to the platform and will be withheld until the dispute is resolved. It will then transfer the ownership of these to the winning party.",
            "imgSrc": feature1
        },
        {
            "title": "Select Bid",
            "description": "When a freelancer completes a milestone then the milestone NFT is transferred back to the client profile Token Bound Address (TBA). When all the milestones are completed, the job NFT will be burn by the platform.",
            "imgSrc": feature1
        },
        {
            "title": "Ownership Transfer",
            "description": "Whenever a client selects a freelancer bid for the job then the proposed number of milestones in the bid are minted as NFTs and the milestone NFTs are added in the TBA wallet of the corresponding job NFT.",
            "imgSrc": feature1
        },
        {
            "title": "Payment Release",
            "description": "Whenever a client selects a freelancer bid for the job then the proposed number of milestones in the bid are minted as NFTs and the milestone NFTs are added in the TBA wallet of the corresponding job NFT.",
            "imgSrc": feature1
        },
        {
            "title": "Dispute Resolution",
            "description": "Whenever a client selects a freelancer bid for the job then the proposed number of milestones in the bid are minted as NFTs and the milestone NFTs are added in the TBA wallet of the corresponding job NFT.",
            "imgSrc": feature1
        }
    ]
  return (

    <div class="py-16 px-12">
    <div class="container m-auto px-6 text-gray-500 md:px-12 xl:px-0">
      <div class="mx-auto grid gap-6 md:w-3/4 lg:w-full lg:grid-cols-3">
        {features.map(({title, description, imgSrc}) => (
        <div class="border border-gray-100  rounded-3xl bg-white px-8 pt-12 shadow-2xl shadow-gray-600/10 sm:px-12 lg:px-8">
        <div class="mb-12 space-y-4">
          <h3 class="text-2xl font-semibold text-gray-800">{title}</h3>
          <p class="mb-6 text-gray-600">
            {description}
          </p>
          {/* <a href="#" class="block font-medium text-primary">Know more</a> */}
        </div>
        <Image
          src={imgSrc}
          class="ml-auto w-2/3"
          alt="illustration"
          loading="lazy"
          width="900"
          height="600"
        />
      </div>
        ))}
      </div>
    </div>
  </div>
                                        )
}

export default ProtocolFeatures