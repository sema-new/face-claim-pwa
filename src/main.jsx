import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App";
import AddFaceClaim from "./AddFaceClaim";
import JsonEditor from "./JsonEditor";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/add" element={<AddFaceClaim />} />
        <Route path="/editor" element={<JsonEditor />} />
      </Routes>
    </Router>
  </React.StrictMode>
);

// Inside <Routes>...
