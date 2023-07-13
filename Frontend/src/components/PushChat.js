import { useState, useEffect } from "react";
import { Chat, ITheme } from "@pushprotocol/uiweb";
import { ethers } from "ethers";
import { useWeb3 } from "@3rdweb/hooks";

export default function PushChat() {
  const [supportAddress, setSupportAddress] = useState("");

  const {address, provider} = useWeb3();

  function handleInputChange(event) {
    const { name, value } = event.target;
    setSupportAddress(value);
  }

  async function getAccount() {
    const signer = provider.getSigner();
    let account = await signer.getAddress();
    setAccount(account);
  }

  useEffect(() => {
    getAccount();
  }, []);

  const theme = {
    bgColorPrimary: "gray",
    bgColorSecondary: "purple",
    textColorPrimary: "white",
    textColorSecondary: "green",
    btnColorPrimary: "red",
    btnColorSecondary: "purple",
    border: "1px solid black",
    borderRadius: "40px",
    moduleColor: "pink",
  };
  return (
    <>
      From : {address}
      <input
        type="text"
        name="supportAddress"
        value={supportAddress}
        onChange={handleInputChange}
      />
      <Chat
        account={address}
        supportAddress={supportAddress}
        apiKey={"tAWEnggQ9Z.UaDBNjrvlJZx3giBTIQDcT8bKQo1O1518uF1Tea7rPwfzXv2ouV5rX9ViwgJUrXm"}
        // apiKey='tAWEnggQ9Z.UaDBNjrvlJZx3giBTIQDcT8bKQo1O1518uF1Tea7rPwfzXv2ouV5rX9ViwgJUrXm'
        env="staging"
        theme={theme}
      />
    </>
  );
}