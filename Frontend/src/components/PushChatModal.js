import * as pushChat from "@/utils/pushChat";
import { Input } from "antd";
import { useState, useEffect } from "react";
const moment = require("moment");

export default function MyChat({ _signer, clientAddress }) {
  const [pgpPrivateKey, setPgpPrivateKey] = useState(null);
  const [profilePicture, setProfilePicture] = useState({});
  const [chatList, setChatList] = useState(null);
  const [chatColor, setChatColor] = useState({});
  const [currChatId, setCurrChatId] = useState(null);
  const [currentChat, setCurrentChat] = useState(null);
  const [message, setMessage] = useState('');
  const [messageHistory, setMessageHistory] = useState({});
  
  useEffect(() => {
    if (!clientAddress) return;
    pushChat.getUser(clientAddress).then((data) => {
      if (!data) {
        pushChat.createUser(_signer).then((res) => {
          pushChat.getUser(clientAddress).then((_data) => {
            profilePicture[clientAddress] = _data.profile.picture;
            setProfilePicture(profilePicture);
          });
        });
      } else {
        profilePicture[clientAddress] = data.profile.picture;
        setProfilePicture(profilePicture);
      }
    });
  }, [clientAddress]);

  useEffect(() => {
    if (!pgpPrivateKey) return;
    pushChat.fetchChatList(clientAddress, pgpPrivateKey).then((chats) => {
      const parsedData = [];
      for (const chat of chats) {
        const to = chat.msg.fromCAIP10.split(':')[1] === clientAddress ? chat.msg.toCAIP10.split(':')[1] : chat.msg.fromCAIP10.split(':')[1];
        chatColor[to] = "flex flex-row py-4 px-2 justify-center rounded-lg my-2 mx-2 cursor-pointer hover:bg-gray-100 items-center border shadow-md";
        profilePicture[to] = chat.profilePicture;
        parsedData.push({
          with: to,
          chatId: chat.chatId,
          threadHash: chat.threadhash,
          messageContent: chat.msg.messageContent,
          messageType: chat.msg.messageType,
          timestamp: chat.msg.timestamp,
        });
      }
      setProfilePicture(profilePicture);
      setChatColor(chatColor);
      setChatList(parsedData);
    });
  }, [pgpPrivateKey]);

  function handleConnect() {
    if (!clientAddress) return;
    pushChat.decryptPGPKey(clientAddress, _signer).then((data) => {
      setPgpPrivateKey(data);
    });
  };

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
    messageHistory[currChatId] = event.target.value;
    setMessageHistory(messageHistory);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleFormSubmit();
    }
  };

  const handleFormSubmit = () => {
    if ((!currChatId) || (!message)) return;
    pushChat.sendChat(clientAddress, currChatId, pgpPrivateKey, message).then((res, rej) => {
      if (rej) {
        return;
      }
      // console.log(res);
      handleChatSelection(currChatId);
      messageHistory[currChatId] = '';
      setMessageHistory(messageHistory);
      setMessage('');
    });
  };

  function handleChatSelection(user) {
    if (!pgpPrivateKey) return;
    if (currChatId) {
      chatColor[currChatId] = "flex flex-row py-4 px-2 justify-center rounded-lg my-2 mx-2 cursor-pointer hover:bg-gray-100 items-center border shadow-md";
    }
    chatColor[user] = "flex flex-row py-4 px-2 justify-center rounded-lg my-2 mx-2 cursor-pointer hover:bg-gray-100 items-center border shadow-md items-center border-b-2 border-l-4 border-blue-400";
    setCurrChatId(user);
    setChatColor(chatColor);

    pushChat.fetchHistory(clientAddress, user, pgpPrivateKey).then((res, rej) => {
      if (res) {
        res = res.sort((x, y) => (parseInt(x.timestamp) > parseInt(y.timestamp)) ? 1 : -1)
        if (!(user in messageHistory)) {
          messageHistory[user] = '';
          setMessageHistory(messageHistory);
        }
        setMessage(messageHistory[user]);
        setCurrentChat((
          <div class="flex flex-col mt-5">
            {
              res.map((data) => {
                if (data.messageType !== 'Text') return;
                if (data.fromCAIP10 === `eip155:${clientAddress}`) {
                  return (
                    <div class="flex w-full mt-2 space-x-3 max-w-xs ml-auto justify-end">
                      <div>
                        <div class="flex flex-wrap gap-4 bg-blue-600 text-white p-3 rounded-l-lg rounded-br-lg">
                          <p class="text-sm">{data.messageContent}</p>
                        </div>
                        <span class="text-xs text-gray-500 leading-none">{moment(new Date(data.timestamp)).format('h:mm A - D MMMM, YY')}</span>
                      </div>
                      {/* <img src={profilePicture[data.fromCAIP10.split(':')[1]]} class="flex-shrink-0 h-10 w-10 rounded-full"></img> */}
                    </div>
                  );
                } else {
                  return (
                    <div class="flex w-full mt-2 space-x-3 max-w-xs">
                      {/* <img src={profilePicture[data.fromCAIP10.split(':')[1]]} class="flex-shrink-0 h-10 w-10 rounded-full"></img> */}

                      <div>
                        <div class="bg-palatte4 text-white p-3 rounded-r-lg rounded-bl-lg">
                          <p class="text-sm">{data.messageContent}</p>
                        </div>
                        <span class="text-xs text-gray-500 leading-none">{moment(new Date(data.timestamp)).format('h:mm A - D MMMM, YY')}</span>
                      </div>
                    </div>
                  )
                }
              })
            }
          </div>
        ))
      }
      if (rej) console.log(rej);
    });
  }

  function trimAddress(address) {
    return `${address.replaceAll('eip155:', '').substring(0, 14)}...`;
  }

  return (
    <div class="container shadow-lg rounded-lg px-20 py-4">
      <div class="px-5 py-5 flex  items-center bg-white border-b-2">
        <img src={profilePicture[clientAddress]} class="object-cover h-12 w-12 rounded-full" alt="" />
        <div class="text-xl ml-2">
          <h2 className="font-semibold leading-7 text-gray-900 sm:truncate sm:text-2xl sm:tracking-tight">{clientAddress ? `${clientAddress.slice(0,5)}...${clientAddress.slice(36)}` : 'Loading...'}</h2>
        </div>
      </div>
      <div class="flex flex-row justify-between min-h-5/6	 bg-white">
        <div class="flex flex-col w-2/5 border-r-2 overflow-y-auto">
          
          {
            (chatList && chatList.map((data) => (
              <div class={chatColor[data.with]} id={data.with} onClick={() => handleChatSelection(data.with)}>
                <div class="w-1/4">
                  <img
                    src={profilePicture[data.with]}
                    class="object-cover h-12 w-12 rounded-full"
                    alt=""
                  />
                </div>
                <div class="w-full">
                  <div class="text-md font-semibold">{trimAddress(data.with)}</div>
                  <span class="text-gray-500">{data.messageContent}</span>
                </div>
              </div>
            )
            ))
          }

        </div>
        <div class="w-full  px-5 flex flex-col justify-between overflow-y-auto h-96">
          {(pgpPrivateKey && (
            currentChat || (
              <div class="grid justify-items-center py-48">
                  <div class="py-3 px-4 bg-palatte4 rounded-2xl font-semibold text-white">
                    Select a chat!
                </div>
              </div>
            )
          ) || (
              <div class="grid justify-items-center py-48">
                  <button class="py-3 px-4  bg-palatte4 rounded-2xl font-semibold text-white" onClick={handleConnect}>
                    Connect!
                  </button>
              </div>
            )
          )}
          <div class="flex-grow ml-4 py-5">
            <div class="w-2/5 fixed bottom-10 ">
              <Input
                type="text"
                name="message"
                class="flex py-6 border placeholder:text-gray-400 border-gray-800 rounded-xl w-full focus:outline-none focus:border-indigo-300 pl-4 h-10"
                placeholder="Type your message..."
                onChange={handleMessageChange}
                onKeyPress={handleKeyPress}
                value={message}
              />
              <button class="absolute flex items-center justify-center h-full w-12 right-0 top-0 text-gray-400 hover:text-gray-600" onClick={handleFormSubmit}>
                <svg
                  class="w-4 h-4 transform rotate-45 -mt-px"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};