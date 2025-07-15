import ProfessorDashboard from "./pages/ProfessorDashboard.tsx";
import SignInPage from "./pages/SignInPage.tsx";
import SignUpPage from "./pages/SignUpPage.tsx";
import StudentPage from "./pages/StudentPage.tsx";
import { Route, Routes } from "react-router-dom";
import { Toaster } from "./components/ui/toaster.tsx";
import SheetViewPage from "./pages/SheetViewPage.tsx";
import SheetLogPage from "./pages/SheetLogPage.tsx";
import AttendanceTablePage from "./pages/AttendanceTablePage.tsx";
import { useEffect, useRef } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import SignedInStudentPage from "./pages/SignedInStudentPage";
import { Spinner, Flex } from "@chakra-ui/react";

function App() {
  const { isSignedIn, signOut, isLoaded } = useAuth();
  const { user } = useUser();
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isSignedIn) return;
    const resetTimer = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(
        () => {
          void signOut();
        },
        5 * 60 * 1000,
      ); // 5 minutes
    };
    const events = ["mousemove", "keydown", "mousedown", "touchstart"];
    events.forEach((event) => window.addEventListener(event, resetTimer));
    resetTimer();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, [isSignedIn, signOut]);

  if (!isLoaded || typeof user === "undefined" || (isSignedIn && !user)) {
    return (
      <Flex height="100vh" align="center" justify="center">
        <Spinner size="xl" />
      </Flex>
    );
  }

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
        <Route path="/signed-in-student" element={<SignedInStudentPage />} />
        <Route path="*" element={<SignInPage />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
