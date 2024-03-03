import React from "react";
import "./App.css";
import Header from "./pages/header/Header";
import Main from "./pages/mainPage/Main";
import "./appEventListeners.ts";

function App() {
  return (
    <>
      <Header />
      <Main />
    </>
  );
}

export default App;
