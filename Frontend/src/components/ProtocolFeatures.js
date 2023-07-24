import React from 'react';
import feature1 from "../assets/imgs/feature1.svg"
import feature2 from "../assets/imgs/feature2.svg"
import feature3 from "../assets/imgs/feature3.svg"
import feature4 from "../assets/imgs/feature4.svg"
import feature5 from "../assets/imgs/feature5.svg"
import feature6 from "../assets/imgs/feature6.svg"
import Image from 'next/image';

const ProtocolFeatures = () => {
  const features = [
    {
        "title": "Profile Creation",
        "description": "Register in Maven and generate your unique Profile NFT and an ERC6551 Token Bound Wallet (TBA).",
        "imgSrc": feature1
    },
    {
        "title": "Post Job",
        "description": "Post job to mint Job NFT under Profile Token Bound Address (wallet functionality).",
        "imgSrc": feature2
    },
    {
        "title": "Select Bid",
        "description": "Freelancer bid for Job NFT. When Client select a freelancer bid, milestones NFTs are minted under Job TBA. After that ownership of Job NFT is transferred to client profile Token Bound Address (TBA).",
        "imgSrc": feature3
    },
    {
        "title": "Ownership Transfer",
        "description": "Complete milestone and transfer MIlestone NFT to client Profile TBA.",
        "imgSrc": feature4
    },
    {
        "title": "Escrowed Payment",
        "description": "Client receive Milestone NFT and release payment from Escrow Contract. On project completion, milestone NFTs are held under client Profile TBA. Job NFT under Freelancer Profile TBA is burned.",
        "imgSrc": feature5
    },
    {
        "title": "Dispute Resolution",
        "description": "Raise dispute and Job NFT will be transferred to Dispute contract. An anonymous voting will decide the ownership of disputed NFTs.",
        "imgSrc": feature6
    }
]
  return (

    <div class="py-16 px-12 bg-gray-300">
    <div class="container m-auto px-6 text-gray-500 md:px-12 xl:px-0">
      <div class="mx-auto grid gap-6 md:w-3/4 lg:w-full lg:grid-cols-3">
        {features.map(({title, description, imgSrc}) => (
        <div key={title} class="border border-gray-100  rounded-3xl bg-gray-50 px-8 pt-12 shadow-2xl shadow-gray-600/10 sm:px-12 lg:px-8">
        <div class="mb-12 space-y-4">
          <h3 class="text-2xl font-semibold text-gray-800">{title}</h3>
          <p class="text-gray-600">
            {description}
          </p>
          {/* <a href="#" class="block font-medium text-primary">Know more</a> */}
        </div>
        <Image
          src={imgSrc}
          className="-my-16"
          alt="illustration"
          loading="lazy"
          width={600}
          height={100}
        />
      </div>
        ))}
      </div>
    </div>
  </div>
                                        )
}

export default ProtocolFeatures