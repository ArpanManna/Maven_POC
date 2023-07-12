const PushAPI = require('@pushprotocol/restapi');
// import { createSocketConnection, EVENTS } from '@pushprotocol/socket';

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
    console.log(res)
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
    user: `eip155:5:${address}`, // user address in CAIP
    env: 'staging'
  });
}

export const OptInChannel = async (address, provider) => {
    await PushAPI.channels.subscribe({
        signer: provider.getSigner(),
        channelAddress: 'eip155:5:0x92D147e6f10730d38F8dC737F742501AE84472bD', // channel address in CAIP
        userAddress: `eip155:5:${address}`, // user address in CAIP
        onSuccess: () => {
         console.log('opt in success');
        },
        onError: () => {
          console.error('opt in error');
        },
        env: 'staging'
      })
}

export const sendNotifications = async (signer, title, body, recipients) => {
    try {
        const response = await PushAPI.payloads.sendNotification({
            signer,
            type: 3,
            identityType: 2,
            notification: {
                title,
                body,
            },
            payload: {
                title,
                body,
                cta: '',
                img: '',
            },
            recipients,
            channel: 'eip155:5:0x92D147e6f10730d38F8dC737F742501AE84472bD',
            env: 'staging',
        });
        return response;
    } catch (err) {
        console.log(err);
    }
}

