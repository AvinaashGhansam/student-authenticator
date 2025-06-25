import ProfessorDashboard from "./pages/ProfessorDashboard.tsx";
import SignInPage from "./pages/SignInPage.tsx";
import SignUpPage from "./pages/SignUpPage.tsx";
import StudentPage from "./pages/StudentPage.tsx";
import { Route, Routes } from "react-router-dom";
import { Toaster } from "./components/ui/toaster.tsx";
import SheetViewPage from "./pages/SheetViewPage.tsx";
import SheetLogPage from "./pages/SheetLogPage.tsx";
import AttendanceTablePage from "./pages/AttendanceTablePage.tsx";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/professor-dashboard" element={<ProfessorDashboard />} />
        <Route path="/student" element={<StudentPage />} />
        <Route path="/sheet/:sheetId" element={<SheetViewPage />} />
        <Route path="/sheet/:sheetId/log" element={<SheetLogPage />} />
        <Route path="/sheet/:sheetId/view" element={<SheetViewPage />} />
        <Route path="/table" element={<AttendanceTablePage />} />
        <Route path="*" element={<SignInPage />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
