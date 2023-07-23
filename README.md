# ERC-6551-based Freelancing Platform

Ownership protected freelancing platform that connects freelancers with clients using Blockchain.

## Description

This platform helps freelancers find jobs that match their skills and experience.

Clients post jobs on the platform, and freelancers can apply for the jobs that they are interested in. The platform does not charge any fees to freelancers while a minimal fee from the clients, and it guarantees that freelancers will be paid for the work that they do.

The platform also protects the ownership of the work that freelancers do, so that clients cannot claim ownership of the work without the freelancer's permission.

The project is designed to help freelancers find work and get paid, while also protecting their rights. It is a valuable resource for freelancers, and it is likely to be successful in helping them find work and get paid.

## Architecture

![Github ReadMe](https://github.com/ArpanManna/Maven_POC/assets/115616879/a7dae3e2-2a76-4ce3-aac0-56d0b252eda0)

## Technologies Used

- **ERC-6551** defines a system which gives every ERC-721 token a smart contract account. These token bound accounts (TBA) allow ERC-721 tokens to own assets and interact with applications, without requiring changes to existing ERC-721 smart contracts or infrastructure.
  - We utilize this feature to create Profile NFT which ensures complete ownership of the job lifecycle (job and milestone NFTs transfership), from start to finish.
  - For example, if a freelancer completes a job, they can transfer the milestone NFT ownership to the client to represent completion of their work. The client can then verify and release payment to the freelancer.
- **Chainlink VRF** is used as an "_on-chain random number generator"_. It is used to randomly and anonymously choose voters for voting in case a dispute arises between client and freelancers.
- **Push Protocol** is used to provide real-time communication updates to clients and freelancers via notifications and chat support. This is especially helpful when a job is posted or a dispute is raised. It also helps freelancers to discuss the project with the clients via real-time chat option. By receiving push notifications, clients and freelancers can take immediate action without delay.
- **IPFS** is used for decentralized storage of metadata (job details, client/freelancer profiles etc.).
- **Polybase** is used as a decentralized database powered by zero knowledge proofs, with attributes of a blockchain and the speed & privacy of a database.

## How are "profile NFTs" created?

The newly designed technique of ERC-6551 was used to create **profile NFTs**. This technique allows for the creation of more complex and interactive NFTs than were previously possible. It also makes it possible to store more data on each NFT, which could be used to create more personalized and unique experiences for users.

To create a profile, an ERC-721 token is minted for each profile. Then, a token bound account (TBA) wallet address is generated using ERC-6551 and is associated with the ERC-721 **profile NFT.**

Our platform provides support for EIP-4337 **account abstraction**.
![Github ReadMe-2](https://github.com/ArpanManna/Maven_POC/assets/115616879/29d3c2c2-351a-4b3a-b5ec-4d62a6e90313)



## How is job ownership protected using ERC-6551?

1. Whenever a client posts a job then ERC-721 token is minted for the job. Then, a token bound account (TBA) wallet address is generated using ERC-6551 and associated with the ERC-721 **job NFT.** These job NFTs are further associated inside profile NFTs to protect ownership of jobs for each client initially.
![Github ReadMe-3](https://github.com/ArpanManna/Maven_POC/assets/115616879/6f9d4327-93a4-4f66-b443-7c25756c70bd)

2. Whenever a client selects a freelancer bid for the job then the proposed number of milestones in the bid are minted as NFTs and the **milestone NFTs** are added in the TBA wallet of the corresponding job NFT.

![Github ReadMe-4](https://github.com/ArpanManna/Maven_POC/assets/115616879/1851cc56-6462-4326-9dc6-d80dc077b735)

3. The platform then automatically transfers the job NFT and TBA wallet (along with the milestones NFT) to the freelancer's profile Token Bound Address.
   ![Github ReadMe-5](https://github.com/ArpanManna/Maven_POC/assets/115616879/f3915374-0a92-45bf-a951-f5500bf1305f)

4. When a freelancer completes a milestone then the milestone NFT is transferred back to the client profile Token Bound Address (TBA). 
![Github ReadMe-6](https://github.com/ArpanManna/Maven_POC/assets/115616879/14c7b7bc-fcb2-494c-a78f-573e86d2b05a)

5. When all the milestones are completed, the job NFT will be burn by the platform.

6. Finally, the profile NFT will contain the milestone NFT for this job in its TBA wallet.
 ![Github ReadMe-7](https://github.com/ArpanManna/Maven_POC/assets/115616879/0233029e-f966-41b0-8dc9-c55ac442430c)
   
6. In case a dispute arises, the ownership of the job NFT and the uncompleted milestone NFTs are transferred to the platform and will be withheld until the dispute is resolved. It will then transfer the ownership of these to the winning party.

## How voters are selected anonymously?

1. A freelancer can register themself to be part of "Voters List" for a specific skill/category.
2. A freelancer commits a random number "X" between 0 to 100, denoted by H=h(X).
3. He is then added to the "Voters List" for a specific skill on-chain.
4. When a dispute arises for that specific skill, the contract invokes Chainlink VRF to generate a random number "n".
5. This random number will be used by all the voters to verify whether they are selected in the "Voting Panel" or not.
6. If n\<X then a voter is selected. In this way a group of voters will be selected randomly.
7. This is an anonymous selection as only the voter knows his secret random number which he will reveal during the voting period.
8. Now, an eligible voter can vote by publishing his committed value X and its vote.
9. Contract will check the following:
  1. If h(X) = H then
    1. If n\<X then invoke "Voting.sol"
    2. Else return "You are not eligible to vote"
  2. Else return "Invalid random number"

## Who pays the platform fees?

Freelancers currently do not pay any platform fees.

We only charge clients a small platform fee of around 1% of the job cost.

To ensure that both parties are committed to the project, the client must first escrow the bidding amount plus platform fees into the smart contract. This means that the client will deposit the money into a smart contract, and the freelancer will not be able to access it until the project is completed. Once the project is completed to the client's satisfaction, the escrowed funds will be released to the freelancer. The platform fees will remain with the contract. This system helps to protect both parties from fraud, and ensures that both parties are motivated to complete the project.

Before a freelancer can start working on a project, a client must first escrow the bidding amount plus platform fees into the contract. The bidding amount will be released to the freelancer upon successful completion of the project, while the platform fees will remain with the contract.

## Future Vision

- Collaborative Freelancing: A future where freelancers can easily connect with each other and collaborate on projects.
- Reputation-based social graph using Lens: A social graph that uses Lens to track the reputation of each user, making it easier to identify and avoid fake profiles.
- Fake profile protection using AI: AI-powered tools that can detect and remove fake profiles from the platform.
- AI-powered job recommendation: AI-powered tools that can recommend jobs to users based on their skills and reputation.

![Shape14](RackMultipart20230723-1-vx01xb_html_1b2f20215c22aef3.gif)
