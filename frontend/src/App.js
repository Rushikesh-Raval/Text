import "./App.css";
import { Route, Routes } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import ChatPage from "./Pages/ChatPage";
import { ChakraProvider } from "@chakra-ui/react";

function App() {
  return (
    <>
      <div className="App">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/chats" element={<ChatPage />} />
          </Routes>
      </div>
    </>
  );
}

export default App;
