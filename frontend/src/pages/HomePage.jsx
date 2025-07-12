import  Sidebar from "../components/Sidebar";
import  NoChatSelected from "../components/NoChatSelected";
import  ChatContainer from "../components/ChatContainer";
import { useChatStore } from "../store/useChatStore.js"

const HomePage = () => {
  const {selectedUser}=useChatStore();

  return (
    <div className="h-screen bg-base-200">
      <div className="flex justify-center items-center px-4 pt-20">
        <div className="bg-base-100 rounded-xl shadow-cl w-full max-w-6xl  h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <Sidebar />
            {!selectedUser ? <NoChatSelected/> : <ChatContainer/>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage
