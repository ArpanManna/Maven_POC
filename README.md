# Maven: ERC-6551 based Freelancing Platform

Ownership protected freelancing platform that connects freelancers with clients using Blockchain.

## Description

This platform helps freelancers find jobs that match their skills and experience.

Clients post jobs on the platform, and freelancers can apply for the jobs that they are interested in. The platform does not charge any fees to freelancers while a minimal fee from the clients, and it guarantees that freelancers will be paid for the work that they do.

The platform also protects the ownership of the work that freelancers do, so that clients cannot claim ownership of the work without the freelancer's permission.

The project is designed to help freelancers find work and get paid, while also protecting their rights. It is a valuable resource for freelancers, and it is likely to be successful in helping them find work and get paid.

## Architecture
<p align="center">
<img width="641" src="https://github.com/ArpanManna/Maven_POC/assets/115616879/47c185b6-6d2e-413a-bdf4-a2d57e55a11f">
</p>

## Who pays the platform fees?

Freelancers currently **do not pay** any platform fees.

We only charge clients a small platform fee of around 1% of the job cost.

## Technologies Used

- [**ERC-6551**](https://eips.ethereum.org/EIPS/eip-6551) defines a system which gives every ERC-721 token a smart contract account (a.k.a **account abstraction**). These token bound accounts (TBA) allow ERC-721 tokens to own assets and interact with applications.
  - We utilize this feature to create "_Profile NFT"_ which ensures complete ownership of the job lifecycle (job and milestone NFTs transfership), from start to finish.
  - For example, if a freelancer completes a job, they can transfer the milestone NFT ownership to the client to represent completion of their work. The client can then verify and release payment to the freelancer.
- [**Chainlink VRF**](https://docs.chain.link/vrf/v2/introduction) is used as an "_on-chain random number generator"_. It is used to randomly and anonymously choose voters for voting, in case a dispute arises between client and freelancers.
- [**Push Protocol**](https://push.org/) is used to provide real-time communication updates to clients and freelancers via notifications and chat support. This is especially helpful when a job is posted or a dispute is raised. It also helps freelancers to discuss the project with the clients via real-time chat option. By receiving push notifications, clients and freelancers can take immediate action without delay.
- [**IPFS**](https://ipfs.tech/) is used for decentralized storage of metadata (job details, client/freelancer profiles etc.).
- [**Polybase**](https://polybase.xyz/) is used as a decentralized database powered by zero knowledge proofs, with attributes of a blockchain and the speed & privacy of a database. 

## How are "profile NFTs" created?

We were the **first project** to integrate ERC-6551 to create NFT profiles, well before Lens Protocol announced their v2 version.

The newly designed technique of ERC-6551 was used to create **profile NFTs**. This technique allows for the creation of more complex and interactive NFTs than were previously possible. It also makes it possible to store more data on each NFT, which could be used to create more personalized and unique experiences for users.

To create a profile, an ERC-721 token is minted for each profile. Then, a token bound account (TBA) wallet address is generated using ERC-6551 and is associated with the ERC-721 **profile NFT.**

Our platform provides support for EIP-4337 **account abstraction**.
<p align="center">
<img width="432" alt="Screenshot 2023-07-24 at 9 28 39 PM" src="https://github.com/ArpanManna/Maven_POC/assets/115616879/067f6f3c-acf0-4741-bc7a-de331e6b93e7">

</p>

## How is job ownership protected using ERC-6551?

1. Whenever a client posts a job then ERC-721 token is minted for the job. Then, a token bound account (TBA) wallet address is generated using ERC-6551 and associated with the ERC-721 **job NFT.** These job NFTs are further associated inside profile NFTs to protect ownership of jobs for each client initially.
<p align="center">
<img width="476" alt="Screenshot 2023-07-24 at 11 00 36 PM" src="https://github.com/ArpanManna/Maven_POC/assets/115616879/0f6c2254-a128-49f3-acd0-60df4ef388a9">
</p>

2. Whenever a client selects a freelancer bid for the job then the proposed number of milestones in the bid are minted as NFTs and the **milestone NFTs** are added in the TBA wallet of the corresponding job NFT.
 <p align="center">
   <img width="321" alt="Screenshot 2023-07-24 at 11 03 02 PM" src="https://github.com/ArpanManna/Maven_POC/assets/115616879/450b6817-3bb1-4909-9595-865e7fad65d2">
 </p>
3. The platform then automatically transfers the job NFT and TBA wallet (along with the milestones NFT) to the freelancer's profile Token Bound Address.
<p align="center">
<img width="562" alt="Screenshot 2023-07-24 at 11 04 25 PM" src="https://github.com/ArpanManna/Maven_POC/assets/115616879/b5ad8da0-1d79-465f-9f3a-7c696ee6a07a">
</p>
4. When a freelancer completes a milestone then the milestone NFT is transferred back to the client profile Token Bound Address (TBA). 
<p align="center">
  <img width="564" alt="Screenshot 2023-07-24 at 11 05 03 PM" src="https://github.com/ArpanManna/Maven_POC/assets/115616879/be2bbb69-f774-4b86-9f2c-515eff579e2f">
</p>
5. When all the milestones are completed, the job NFT will be burnt by the platform.

6. Finally, the payment is released to the freelancer and the stake is returned to the client. The profile NFT will, thus, contain the milestone NFT for this job in its TBA wallet.
<p align="center">
  <img width="576" alt="Screenshot 2023-07-24 at 11 08 04 PM" src="https://github.com/ArpanManna/Maven_POC/assets/115616879/1c6ff80a-0930-4ca9-af5b-486e8ef9cc62">
</p>   
6. In case a dispute arises, the ownership of the job NFT and the uncompleted milestone NFTs are transferred to the platform and will be withheld until the dispute is resolved. It will then transfer the ownership of these to the winning party.

## Anonymous Voting
1. When a dispute arises, voting contract selects top “k-eligible” voters (w.r.t skills) from the registered freelancer’s list.
2. The contract, then, invokes Chainlink VRF to generate on-chain random number "n".
3. In order to check eligibility to vote, each voter sends a random number “k” (without knowing the on-chain random number).
4. If n\<k then “Voter is eligible to vote”. They can vote for either “Client” or “Freelancer” based on the disputed details.
5. Else return “You are not eligible to vote”
6. This is an anonymous selection as only the voter knows his secret random number which he will reveal during the voting period.

## Future Vision

- **Collaborative Freelancing**: A future where freelancers can easily connect with each other and collaborate on projects.
- **Reputation-based social graph using Lens**: A social graph that uses Lens to track the reputation of each user, making it easier to identify and avoid fake profiles.
- **Fake profile protection using AI**: AI-powered tools that can detect and remove fake profiles from the platform.
- **AI-powered job recommendation**: AI-powered tools that can recommend jobs to users based on their skills and reputation.

## Deployment Details

Our project is deployed on Polygon Mumbai testnet.

Maven contract: [0x8399eDEbCF9fDF32a7fD33791dCFBbF7319941e5](https://mumbai.polygonscan.com/address/0x8399edebcf9fdf32a7fd33791dcfbbf7319941e5)

Dispute resolution contract: [0xBC0C6f0AFC882aa07bA0dB3c5049ADF0F24D1741](https://mumbai.polygonscan.com/address/0xBC0C6f0AFC882aa07bA0dB3c5049ADF0F24D1741)

Chainlink VRF Subscription ID: [5476](https://vrf.chain.link/mumbai/5476)

[Polybase explorer](https://explorer.testnet.polybase.xyz/studio/pk%2F0xa19aa505ca2151e5f7f6d8f1c5d74afe10a0fa7b5f6968fab70cb8b98a84fdb0187a7b01bb8ff5724f8798a78aeafdc2b435a071846d139031c301a3d036dc6f%2Fmaven-prod/collections/bidTest0)

