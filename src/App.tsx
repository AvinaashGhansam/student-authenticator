import ProfessorDashboard from "./pages/ProfessorDashboard.tsx";
import SignInPage from "./pages/SignInPage.tsx";
import SignUpPage from "./pages/SignUpPage.tsx";
import StudentSignInPage from "./pages/StudentSignInPage.tsx";
import AttendanceTablePage from "./pages/AttendanceTablePage.tsx";
import { Route, Routes } from "react-router-dom";
import { Toaster } from "./components/ui/toaster.tsx";

function App() {
  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/professor-dashboard" element={<ProfessorDashboard />} />
        <Route path="/attendance" element={<AttendanceTablePage />} />
        <Route path="/student" element={<StudentSignInPage />} />
      </Routes>
    </>
  );
}

export default App;
