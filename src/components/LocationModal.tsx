import React from "react";
import { Button, Text } from "@chakra-ui/react";
import CustomModal from "./ui/CustomModal";

interface LocationModalProps {
  isOpen: boolean;
  onAllow: () => void;
  onDeny: () => void;
  onClose: () => void;
}

const LocationModal: React.FC<LocationModalProps> = ({
  isOpen,
  onAllow,
  onDeny,
  onClose,
}) => (
  <CustomModal
    isOpen={isOpen}
    onClose={onClose}
    title="Allow Location Access"
    footer={
      <>
        <Button colorScheme="blue" mr={3} onClick={onAllow}>
          Allow
        </Button>
        <Button variant="ghost" onClick={onDeny}>
          Deny
        </Button>
      </>
    }
  >
    <Text>
      To sign in, we need to verify your location. Please allow location access.
      If you deny, you must see the professor to verify your sign in.
    </Text>
  </CustomModal>
);

export default LocationModal;
