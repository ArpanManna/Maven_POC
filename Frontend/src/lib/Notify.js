import { createSocketConnection, EVENTS } from '@pushprotocol/socket';
import { ethers } from 'ethers';
const PushAPI = require('@pushprotocol/restapi');

export const sendNotification = async (title, body, recipients) => {
    const privateKey = "8fbaf6a89d80f1c6f774277e417cad7242d42dc3397baeda96a8be635b82adb3"
    const channel = "eip155:80001:0xF9F99B62C8D56a577A5C490daFaE40Af23F2bE69"

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
