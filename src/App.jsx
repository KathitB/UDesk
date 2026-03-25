import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import LoginPage from "./LoginPage";
import Tickets from "./Tickets";
import { Route, Routes } from "react-router-dom";
import WorkFlowDashBoard from "./WORKFLOW/workFlowDashBoard";
import Dashboard from "./Dashboard";
import WorkflowDualDashboard from "./WORKFLOW/WorkflowDualDashboard";
function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      {/* <LoginPage /> */}
      {/* <Dashboard /> */}

      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tickets" element={<Tickets />} />
        <Route path="/spanDashboard" element={<WorkFlowDashBoard />} />
        <Route path="/dualDashboard" element={<WorkflowDualDashboard />} />
      </Routes>
    </>
  );
}

export default App;
