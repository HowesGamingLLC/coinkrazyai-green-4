import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

const rootElement = document.getElementById("root")!;
if (!(window as any).__REACT_ROOT__) {
  (window as any).__REACT_ROOT__ = createRoot(rootElement);
}
(window as any).__REACT_ROOT__.render(<App />);
