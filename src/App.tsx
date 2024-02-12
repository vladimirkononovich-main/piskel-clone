import React from "react";
import "./App.css";
import Header from "./pages/header/Header";
import Main from "./pages/mainPage/Main";

export let windowPressedMouseButton: string | null = null;

function App() {
  document.body.addEventListener("mousedown", (e) => {
    if (e.button === 0) windowPressedMouseButton = "left";
    if (e.button === 2) windowPressedMouseButton = "right";
  });
  document.body.addEventListener("mouseup", () => {
    windowPressedMouseButton = null;
  });

  return (
    <>
      <Header />
      <Main />
    </>
  );
}

export default App;
