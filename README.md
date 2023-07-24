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

To ensure that both parties are committed to the project, the client must first escrow the bidding amount plus platform fees into the smart contract. This means that the client will deposit the money into a smart contract, and the freelancer will not be able to access it until the project is completed. Once the project is completed to the client's satisfaction, the escrowed funds will be released to the freelancer. The platform fees will remain with the contract. This system helps to protect both parties from fraud, and ensures that both parties are motivated to complete the project.

## Technologies Used

- **ERC-6551** defines a system which gives every ERC-721 token a smart contract account. These token bound accounts (TBA) allow ERC-721 tokens to own assets and interact with applications, without requiring changes to existing ERC-721 smart contracts or infrastructure.
  - We utilize this feature to create Profile NFT which ensures complete ownership of the job lifecycle (job and milestone NFTs transfership), from start to finish.
  - For example, if a freelancer completes a job, they can transfer the milestone NFT ownership to the client to represent completion of their work. The client can then verify and release payment to the freelancer.
- **Chainlink VRF** is used as an "_on-chain random number generator"_. It is used to randomly and anonymously choose voters for voting in case a dispute arises between client and freelancers.
- **Push Protocol** is used to provide real-time communication updates to clients and freelancers via notifications and chat support. This is especially helpful when a job is posted or a dispute is raised. It also helps freelancers to discuss the project with the clients via real-time chat option. By receiving push notifications, clients and freelancers can take immediate action without delay.
- **IPFS** is used for decentralized storage of metadata (job details, client/freelancer profiles etc.).
- **Polybase** is used as a decentralized database powered by zero knowledge proofs, with attributes of a blockchain and the speed & privacy of a database.

## How are "profile NFTs" created?

We were the **first project** to integrate ERC-6551 to create NFT profiles, well before Lens Protocol announced their v2 version.

The newly designed technique of ERC-6551 was used to create **profile NFTs**. This technique allows for the creation of more complex and interactive NFTs than were previously possible. It also makes it possible to store more data on each NFT, which could be used to create more personalized and unique experiences for users.

To create a profile, an ERC-721 token is minted for each profile. Then, a token bound account (TBA) wallet address is generated using ERC-6551 and is associated with the ERC-721 **profile NFT.**

Our platform provides support for EIP-4337 **account abstraction**.
<p align="center">

<img width="641" src="https://github.com/ArpanManna/Maven_POC/assets/115616879/12a03658-66d5-4738-92d3-da2162ecb7ed">
</p>

## How is job ownership protected using ERC-6551?

1. Whenever a client posts a job then ERC-721 token is minted for the job. Then, a token bound account (TBA) wallet address is generated using ERC-6551 and associated with the ERC-721 **job NFT.** These job NFTs are further associated inside profile NFTs to protect ownership of jobs for each client initially.
<p align="center">
<img width="432" alt="Screenshot 2023-07-24 at 9 28 39 PM" src="https://github.com/ArpanManna/Maven_POC/assets/115616879/067f6f3c-acf0-4741-bc7a-de331e6b93e7">

</p>
2. Whenever a client selects a freelancer bid for the job then the proposed number of milestones in the bid are minted as NFTs and the **milestone NFTs** are added in the TBA wallet of the corresponding job NFT.
<p align="center">
<img width="319" alt="Screenshot 2023-07-23 at 10 40 48 PM" src="https://github.com/ArpanManna/Maven_POC/assets/115616879/05bc0277-d25a-4c59-bc03-e52b31f8d5b8">
</p>
3. The platform then automatically transfers the job NFT and TBA wallet (along with the milestones NFT) to the freelancer's profile Token Bound Address.
 <p align="center">
  <img width="562" alt="Screenshot 2023-07-23 at 10 42 13 PM" src="https://github.com/ArpanManna/Maven_POC/assets/115616879/bfedbaba-5ecf-4502-a6cf-9e025498ce9b">
 </p>
4. When a freelancer completes a milestone then the milestone NFT is transferred back to the client profile Token Bound Address (TBA). 
<p align="center">
<img width="562" alt="Screenshot 2023-07-23 at 10 42 44 PM" src="https://github.com/ArpanManna/Maven_POC/assets/115616879/755c3bf2-818e-4cee-87e5-7d85a8c9ac85">
</p>
5. When all the milestones are completed, the job NFT will be burn by the platform.

6. Finally, the profile NFT will contain the milestone NFT for this job in its TBA wallet.
<p align="center">
<img width="578" alt="Screenshot 2023-07-23 at 10 43 39 PM" src="https://github.com/ArpanManna/Maven_POC/assets/115616879/a8b9be92-d00e-4759-928a-d39d6abc5cb6">
</p>   
6. In case a dispute arises, the ownership of the job NFT and the uncompleted milestone NFTs are transferred to the platform and will be withheld until the dispute is resolved. It will then transfer the ownership of these to the winning party.

## Future Vision

- **Collaborative Freelancing**: A future where freelancers can easily connect with each other and collaborate on projects.
- **Reputation-based social graph using Lens**: A social graph that uses Lens to track the reputation of each user, making it easier to identify and avoid fake profiles.
- **Fake profile protection using AI**: AI-powered tools that can detect and remove fake profiles from the platform.
- **AI-powered job recommendation**: AI-powered tools that can recommend jobs to users based on their skills and reputation.

