import { useWeb3 } from '@3rdweb/hooks'
import React from 'react';
import { ethers } from "ethers";
import { Chat, ITheme } from '@pushprotocol/uiweb';

export default function ChatModal() {
  const theme = {
    bgColorPrimary: 'gray',
    bgColorSecondary: 'purple',
    textColorPrimary: 'white',
    textColorSecondary: 'green',
    btnColorPrimary: 'red',
    btnColorSecondary: 'purple',
    border: '1px solid black',
    borderRadius: '40px',
    moduleColor: 'pink',
  };

  async function createUserIfNecessary(signer) {
    if (!address) return;
    let userObj = await PushAPI.user.get({
      account: `eip155:${address}`,
      env: "staging",
    });

    if (!userObj?.encryptedPrivateKey) {
      userObj = await PushAPI.user.create({
        signer: signer, // ethers.js signer
        env: "staging",
      });
    }

    const pgpDecryptedPrivateKey = await PushAPI.chat.decryptPGPKey({
      encryptedPGPPrivateKey: userObj.encryptedPrivateKey,
      signer: signer,
      env: "staging",
    });

    return { ...userObj, privateKey: pgpDecryptedPrivateKey };
  }

  useEffect(() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    if (provider) {
      const signer = provider.getSigner();
      // console.log("working");
      createUserIfNecessary(signer).then((user) => {
        // Perform any necessary actions with the user object
        // console.log(user);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const { ethereum } = window;

  let signer;
  if (ethereum) {
    const provider = new ethers.providers.Web3Provider(ethereum);
    signer = provider.getSigner();
  }
  // const { address, chainId, provider } = useWeb3();
  // const signer = provider?.getSigner();
  
  return (
    <Chat
      account='0xFe6C8E9e25f7bcF374412c5C81B2578aC473C0F7'
      supportAddress="0xFe6C8E9e25f7bcF374412c5C81B2578aC473C0F7"
      env='staging'
      signer={signer}
      theme={theme}
    />
  );
};