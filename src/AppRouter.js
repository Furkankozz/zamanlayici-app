import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App";
import ProfilePage from "./ProfilePage";

export default function AppRouter() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<App />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </Router>
  );
}
