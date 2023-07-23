# ERC-6551-based Freelancing Platform

Ownership protected freelancing platform that connects freelancers with clients using Blockchain.

## Website

## Description

This platform helps freelancers find jobs that match their skills and experience.

Clients post jobs on the platform, and freelancers can apply for the jobs that they are interested in. The platform does not charge any fees to freelancers while a minimal fee from the clients, and it guarantees that freelancers will be paid for the work that they do.

The platform also protects the ownership of the work that freelancers do, so that clients cannot claim ownership of the work without the freelancer's permission.

The project is designed to help freelancers find work and get paid, while also protecting their rights. It is a valuable resource for freelancers, and it is likely to be successful in helping them find work and get paid.

## Architecture

![Shape1](RackMultipart20230723-1-vx01xb_html_9d389da263ffc1d9.gif)

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

![Shape2](RackMultipart20230723-1-vx01xb_html_57d5b2c6392eb1a2.gif)

## How is job ownership protected using ERC-6551?

1. Whenever a client posts a job then ERC-721 token is minted for the job. Then, a token bound account (TBA) wallet address is generated using ERC-6551 and associated with the ERC-721 **job NFT.** These job NFTs are further associated inside profile NFTs to protect ownership of jobs for each client initially. ![Shape3](RackMultipart20230723-1-vx01xb_html_ab21f0ecf2f5db5b.gif)
2. Whenever a client selects a freelancer bid for the job then the proposed number of milestones in the bid are minted as NFTs and the **milestone NFTs** are added in the TBA wallet of the corresponding job NFT.
 ![Shape7](RackMultipart20230723-1-vx01xb_html_f11a01665643073b.gif)

1. The platform then automatically transfers the job NFT and TBA wallet (along with the milestones NFT) to the freelancer's profile Token Bound Address. ![Shape9](RackMultipart20230723-1-vx01xb_html_fdc2c52516bd64e1.gif)
2. When a freelancer completes a milestone then the milestone NFT is transferred back to the client profile Token Bound Address (TBA). ![Shape10](RackMultipart20230723-1-vx01xb_html_b4b621f0f0e41ec5.gif)
3. When all the milestones are completed, the job NFT will be burn by the platform.
4. Finally, the profile NFT will contain the milestone NFT for this job in its TBA wallet. ![Shape13](RackMultipart20230723-1-vx01xb_html_876cff0fd4d33d56.gif)
5. In case a dispute arises, the ownership of the job NFT and the uncompleted milestone NFTs are transferred to the platform and will be withheld until the dispute is resolved. It will then transfer the ownership of these to the winning party.

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
