import { create } from 'ipfs-http-client';

const projectId = '2PYh5WBhST7v7XUHkobwZmFouc3';
const projectSecret = '5d069dd4de740bd8b9775b4eca12a1b0';

const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

const client = create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
        authorization: auth,
    },
});


export const uploadFileToIPFS = async (file) => {
    const added = await client.add(file)
    const uri = `https://ipfs.io/ipfs/${added.path}`;
    return uri
} 

// module.exports = {uploadFileToIPFS}