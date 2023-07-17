import { useState, useEffect } from "react";
import { Chat } from "@pushprotocol/uiweb";

export default function MyChat({ _signer, clientAddress }) {
  // Request method to authorize user

  const [account, setAccount] = useState("");
  const [supportAddress, setSupportAddress] = useState("");
  const [signer, setSigner] = useState(null);

  function handleInputChange(event) {
    const { name, value } = event.target;
    setSupportAddress(value);
  }

  async function getAccount() {
    if (!_signer) return;
    // const web3Modal = new Web3Modal();
    // const connection = await web3Modal.connect();
    // const provider = new ethers.providers.Web3Provider(connection);
    const signer = _signer;
    let account = await signer.getAddress();
    setAccount(account);
    setSigner(_signer);
  }

  useEffect(() => {
    setSupportAddress(clientAddress);
  }, [clientAddress]);

  useEffect(() => {
    getAccount();
  }, [_signer]);

  const theme = {
    bgColorPrimary: "white",
    bgColorSecondary: "#5856d6",
    textColorPrimary: "#5856d6",
    textColorSecondary: "white",
    btnColorPrimary: "#5856d6",
    btnColorSecondary: "purple",
    border: "1px solid black",
    borderRadius: "40px",
    moduleColor: "white",
  };
  return (
    <>
      {/* From : {account} */}
      <input
        type="text"
        name="supportAddress"
        value={supportAddress}
        onChange={handleInputChange}
      />
      <Chat
        account={account}
        supportAddress={supportAddress}
        signer={signer}
        env="staging"
        theme={theme}
      />
    </>
  );
}