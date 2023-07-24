import { useWeb3 } from '@3rdweb/hooks'
import Chat from '@/components/PushChatModal';

const chat = () => {
  const { provider, address } = useWeb3();
  return (
    <div>
      <Chat _signer={provider?.getSigner()} clientAddress={address}/>
    </div>
  )
}

export default chat;