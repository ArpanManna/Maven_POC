const PushAPI = require('@pushprotocol/restapi');

const initializeChatSocket = (account) => {
  return createSocketConnection({
    user: `eip155:${account}`, // Not CAIP-10 format
    env: 'staging',
    socketType: 'chat',
    socketOptions: { autoConnect: true, reconnectionAttempts: 3 }
  });
};

const decryptPGPKey = async (account, signer) => {
  if ((!account) || (!signer)) {
    console.log('No account or signer');
    return;
  }
  const { encryptedPrivateKey } = await getUser(account);
  const pgpPrivateKey = await PushAPI.chat.decryptPGPKey({
    encryptedPGPPrivateKey: encryptedPrivateKey,
    signer,
  });
  // console.log(pgpPrivateKey);
  return pgpPrivateKey;
};

const createUser = async (signer, env = 'staging') => {
  const user = await PushAPI.user.create({
    signer, // ethers.js signer
    env,
  });

  return user;
};

const getUser = async (account, env = 'staging') => {
  if (!account) {
    console.log('No Account!');
    return;
  }
  const user = await PushAPI.user.get({ env, account });
  return user;
};

const fetchChatList = async (account, pgpPrivateKey, env = 'staging') => {
  if (!account) return;
  // const pgpPrivateKey = await decryptPGPKey(account, signer);
  const response = await PushAPI.chat.chats({
    account,
    toDecrypt: true,
    pgpPrivateKey,
    env,
  });
  return response;
};

const fetchChatRequestList = async (account, pgpPrivateKey, env = 'staging') => {
  if (!account) return;
  const response = await PushAPI.chat.requests({
    account,
    toDecrypt: true,
    pgpPrivateKey,
    env,
  });
  return response;
};

const fetchChats = async (account, pgpPrivateKey, env = 'staging') => {
  const [ chats, requests ] = await Promise.all([
    fetchChatList(account, pgpPrivateKey),
    fetchChatRequestList(account, pgpPrivateKey),
  ]);
  return [...chats, ...requests];
}

const fetchHistory = async (from, to, pgpPrivateKey, env = 'staging') => {
  let params = {
    account: `eip155:${to}`,
    conversationId: `eip155:${from}`,
    env,
  };
  const conversationHash = await PushAPI.chat.conversationHash(params);
  params = {
    threadhash: conversationHash.threadHash,
    account: `eip155:${from}`,
    toDecrypt: true,
    // limit: 2,
    pgpPrivateKey,
    env,
  };
  const chatHistory = await PushAPI.chat.history(params);
  return chatHistory;
};

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

const sendChat = async (from, to, pgpPrivateKey, message, env = 'staging') => {
  const parsedMessage = constructMessage(message, 'text');
  const params = {
    ...parsedMessage,
    receiverAddress: to,
    account: from,
    pgpPrivateKey,
    env,
  };
  const response = await PushAPI.chat.send(params);
  return response;
};

module.exports = {
  initializeChatSocket,
  createUser,
  decryptPGPKey,
  fetchChats,
  fetchHistory,
  sendChat,
  getUser,
};