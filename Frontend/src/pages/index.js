import Image from 'next/image'
import { Inter } from 'next/font/google'
import Nav from '@/components/Nav'
import { socketConnection } from '@/lib/Notify'
import { useWeb3 } from '@3rdweb/hooks'
import { useCallback, useEffect } from 'react'
import { NotificationItem } from '@pushprotocol/uiweb'
import { ToastContainer, toast } from "react-toastify";
import ToastMessage from "@/components/UI/Toast";
import { EVENTS, createSocketConnection } from '@pushprotocol/socket'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const { address } = useWeb3();

  useEffect(() => {
    const pushSDKSocket = createSocketConnection({
      user: `eip155:5:${address}`, // CAIP-10 format
      env: 'staging',
      socketOptions: { autoConnect: true }
    });
      pushSDKSocket?.on(EVENTS.CONNECT, () => { console.log('connected') })
      pushSDKSocket?.on(EVENTS.DISCONNECT, (err) => console.log(err));
      pushSDKSocket?.on(EVENTS.CHAT_RECEIVED_MESSAGE, (message) => console.log(message))
      pushSDKSocket?.on(EVENTS.USER_FEEDS, (notification) =>{
            notify("success", notification.payload.notification.title, notification.payload.notification.body)
      
      console.log(notification)
      }

      )
      pushSDKSocket?.on(EVENTS.USER_SPAM_FEEDS, (spam) => console.log(spam))

  }, [address])

  const notify = useCallback((type, title, body) => {
    ToastMessage({ type, title, body });
  }, []);
  return (
    <>
      <Nav />
      <h2>Home Page</h2>
    </>
  )
}
