import React from 'react'

const Feature = () => {
  return (
    <div id="featureCard" className="px-4 py-16 bg-gray-300 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">
    <div className="max-w-xl mb-10 md:mx-auto sm:text-center lg:max-w-2xl md:mb-12">
      <div>
        <p className="inline-block px-3 py-px mb-4 text-xs font-semibold tracking-wider text-teal-900 uppercase rounded-full bg-teal-accent-400">
          MAVEN
        </p>
      </div>
      <h2 className="max-w-lg mb-6 font-sans text-3xl font-bold leading-none tracking-tight text-gray-900 sm:text-4xl md:mx-auto">
        <span className="relative inline-block">
          <svg
            viewBox="0 0 52 24"
            fill="currentColor"
            className="absolute top-0 left-0 z-0 hidden w-32 -mt-8 -ml-20 text-blue-gray-100 lg:w-32 lg:-ml-28 lg:-mt-10 sm:block"
          >
            <defs>
              <pattern
                id="34f481be-159a-4846-821d-9ca19fb6bcc5"
                x="0"
                y="0"
                width=".135"
                height=".30"
              >
                <circle cx="1" cy="1" r=".7" />
              </pattern>
            </defs>
            <rect
              fill="url(#34f481be-159a-4846-821d-9ca19fb6bcc5)"
              width="52"
              height="24"
            />
          </svg>
          <span className="relative">Decentralized Freelancing</span>
        </span>{' '}
      </h2>
      <p className="text-base text-gray-700 md:text-lg">
        Earn $MAVEN tokens by creating or working on a project.
      </p>
    </div>
    <div className="grid gap-8 row-gap-5 mb-8 md:row-gap-8 lg:grid-cols-4 sm:grid-cols-2">
      <div className="duration-300 transform bg-white shadow-md hover:-translate-y-2">
        <div className="h-full p-5 border border-l-0 rounded-r shadow-sm">
          <h6 className="mb-2 font-semibold leading-5">Job Ownership Protection using ERC 6551</h6>
          <p className="text-sm text-gray-900">
            Client and Freelancer holds profile NFT which can hold multiple job NFTs and mileston NFTs thereby protecting ownership lifecycle of jobs and milestones.
          </p>
        </div>
      </div>
      <div className="duration-300 transform bg-white shadow-md hover:-translate-y-2">
        <div className="h-full p-5 border border-l-0 rounded-r shadow-sm">
          <h6 className="mb-2 font-semibold leading-5">Privacy-preserving Decentralized Database Storage</h6>
          <p className="text-sm text-gray-900">
             Using zk-proof powered Polybase storage. Three layer of data storage : IPFS (Metadata), Polybase(temporary storage and processing) and Ethereum(Permanent Data). 
          </p>
        </div>
      </div>
      <div className="duration-300 transform bg-white shadow-md hover:-translate-y-2">
        <div className="h-full p-5 border border-l-0 rounded-r shadow-sm">
          <h6 className="mb-2 font-semibold leading-5">
        Fair and Unique Dispute Resolution
            
          </h6>
          <p className="text-sm text-gray-900">
            Anonymous Voter selection based on reputation from Polybase and random selection using Chainlink VRF. Fair dispute resolution via smart contracts.
          </p>
        </div>
      </div>
      <div className="duration-300 transform bg-white shadow-md hover:-translate-y-2">
        <div className="h-full p-5 border border-l-0 rounded-r shadow-sm">
          <h6 className="mb-2 font-semibold leading-5">Real-time communication/notification via Push protocol</h6>
          <p className="text-sm text-gray-900">
            Allows real-time chat upport between client and freelancers. Instant notifications in client and freelancers inbox.
          </p>
        </div>
      </div>
    </div>
    
  </div>
  )
}

export default Feature