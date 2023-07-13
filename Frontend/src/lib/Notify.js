import { createSocketConnection, EVENTS } from '@pushprotocol/socket';
import { ethers } from 'ethers';
const PushAPI = require('@pushprotocol/restapi');

export const sendNotification = async (title, body, recipients) => {
const privateKey = "8fbaf6a89d80f1c6f774277e417cad7242d42dc3397baeda96a8be635b82adb3"
const channel = "eip155:5:0x92D147e6f10730d38F8dC737F742501AE84472bD"

    try {
        const response = await PushAPI.payloads.sendNotification({
            signer: new ethers.Wallet(`0x${privateKey}`),
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
            channel,
            env: 'staging',
        });
        return response;
    } catch (err) {
        console.log(err);
    }
}

export const socketConnection = async(address) => {
    const pushSDKSocket = await createSocketConnection({
    user: `eip155:5:${address}`, // CAIP-10 format
    env: 'staging',
    socketOptions: { autoConnect: true }
  });
    pushSDKSocket?.on(EVENTS.CONNECT, () => { console.log('connected') })
    pushSDKSocket?.on(EVENTS.DISCONNECT, (err) => console.log(err));
    pushSDKSocket?.on(EVENTS.CHAT_RECEIVED_MESSAGE, (message) => console.log(message))
    pushSDKSocket?.on(EVENTS.USER_FEEDS, (notification) => console.log(notification))
    pushSDKSocket?.on(EVENTS.USER_SPAM_FEEDS, (spam) => console.log(spam))
}
