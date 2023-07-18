const PushAPI = require('@pushprotocol/restapi');
// import { createSocketConnection, EVENTS } from '@pushprotocol/socket';

const channelAddress = "eip155:80001:0xF9F99B62C8D56a577A5C490daFaE40Af23F2bE69";

const createAccount = async (signer, env = 'staging') => {
    const user = await PushAPI.user.create({ signer, env });
    return user;
};

const getUser = async (account, env = 'staging') => {
    const user = await PushAPI.user.get({
        account: `eip155:${account}`,
        env,
      });
    return user;
};
// helper
const constructMessage = (message, type) => {
    const response = {};
    response.messageContent = message;
    switch (type) {
        case 'text':
            response.messageType = 'Text';
            break;
        case 'image':
            response.messageType = 'Image';
            break;
        case 'media':
            response.messageType = 'File';
            break;
        case 'gif':
            response.messageType = 'GIF';
            break;
        default:
            break;
    }
    return response;
};

const decryptPGPKey = async (account, signer) => {
    const res = await getUser(account);
    const { encryptedPrivateKey } = res;
    const pgpPrivateKey = await PushAPI.chat.decryptPGPKey({
        encryptedPGPPrivateKey: encryptedPrivateKey,
        signer,
    });
    return pgpPrivateKey;
};

const sendChat = async (from, to, signer, message, env = 'staging') => {
    const pgpPrivateKey = await decryptPGPKey(from, signer);
    const params = {
        ...message,
        receiverAddress: to,
        signer,
        pgpPrivateKey,
        env,
    };
    const response = await PushAPI.chat.send(params);
    return response;
};

export const fetchChatList = async (account, signer, env = 'staging') => {
    const pgpPrivateKey = await decryptPGPKey(account, signer);
    const response = await PushAPI.chat.chats({
        account,
        toDecrypt: true,
        pgpPrivateKey,
        env,
    });
    return response;
}

const approveChats = async (senderAddress, signer, env = 'staging') => {
    const response = await PushAPI.chat.approve({
        status: 'Approved',
        // account,
        senderAddress,
        signer,
        env,
    });
    return response;
}

export const fetchNotifications = async(address) => {
    return await PushAPI.user.getFeeds({
    user: `eip155:80001:${address}`, // user address in CAIP
    env: 'staging'
  });
}

export const OptInChannel = async (address, provider) => {
    await PushAPI.channels.subscribe({
        signer: provider.getSigner(),
        channelAddress, // channel address in CAIP
        userAddress: `eip155:80001:${address}`, // user address in CAIP
        onSuccess: () => {
         console.log('opt in success');
        },
        onError: () => {
          console.error('opt in error');
        },
        env: 'staging'
      })
}
