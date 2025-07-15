import { Text } from "@chakra-ui/react";
import { useAuth } from "@clerk/clerk-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AttendanceTablePage = () => {
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!isSignedIn) {
      navigate("/sign-in", { replace: true });
    }
  }, [isSignedIn, navigate]);

  return <Text>Attendance Table</Text>;
};
export default AttendanceTablePage;
