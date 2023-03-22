import React from 'react';
import Layout from "./components/Layout/Layout";
import {Route, Routes} from "react-router-dom";
import Error from "./components/Error/Error";
import Register from "./containers/Users/Register";
import Login from "./containers/Users/Login";
import Chat from "./containers/Chat/Chat";

function App() {
  return (
    <>
      <Layout>
        <Routes>
          <Route path="/" element={<Login/>}/>
          <Route path="/chat" element={<Chat/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/*" element={<Error/>}/>
        </Routes>
      </Layout>
    </>
  )
}

export default App
