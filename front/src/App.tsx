import React from 'react';
import Layout from "./components/Layout/Layout";
import {Route, Routes} from "react-router-dom";
import Error from "./components/Error/Error";
import Register from "./containers/Users/Register";
import Login from "./containers/Users/Login";
import Chat from "./containers/Chat/Chat";
import {useAppSelector} from "./app/hooks";
import {selectUser} from "./features/users/UsersSlice";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

function App() {
  const user = useAppSelector(selectUser);

  return (
    <>
      <Layout>
        <Routes>
          <Route path="/" element={<Login/>}/>
          <Route path="/chat" element={(
            <ProtectedRoute isAllowed={!!user}>
              <Chat/>
            </ProtectedRoute>
          )}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/*" element={<Error/>}/>
        </Routes>
      </Layout>
    </>
  )
}

export default App
