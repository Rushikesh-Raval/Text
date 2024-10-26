import { Box } from "@chakra-ui/react";
import { ChatState } from "../Context/ChatProvider";
import SideDrawer from "../Components/miscellaneous/SideDrawer.js";
import ChatBox from "../Components/ChatBox.js";
import MyChats from "../Components/MyChats.js";
import { useState } from "react";
import UpdateGroupChatModal from "../Components/miscellaneous/UpdateGroupChatModal.js";

const ChatPage = () => {
  const { user } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);
  // console.log(user)

  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}

      <Box
        display="flex"
        justifyContent="space-between"
        w="100%"
        h="91.5vh"
        p="10px"
      >
        {user && (
          <MyChats fetchAgain={fetchAgain}/>
        )}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
        {/* {user && (
          <UpdateGroupChatModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )} */}
        {/* Suspect is to uncomment */}
      </Box>
    </div>
  );
};

export default ChatPage;
