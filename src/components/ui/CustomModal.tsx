import React from "react";
import ReactModal from "react-modal";
import { Box, Button } from "@chakra-ui/react";

interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
}

const CustomModal: React.FC<CustomModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
}) => {
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={{
        overlay: { zIndex: 2000, backgroundColor: "rgba(0,0,0,0.4)" },
        content: {
          maxWidth: 400,
          margin: "auto",
          borderRadius: 16,
          padding: 24,
          top: "50%",
          left: "50%",
          right: "auto",
          bottom: "auto",
          transform: "translate(-50%, -50%)",
          height: "auto",
        },
      }}
      ariaHideApp={false}
    >
      <Box mb={4} fontWeight="bold" fontSize="xl">
        {title}
      </Box>
      <Box mb={4}>{children}</Box>
      {footer && <Box mt={4}>{footer}</Box>}
      <Button
        mt={2}
        variant="ghost"
        colorScheme="gray"
        onClick={onClose}
        w="100%"
      >
        Close
      </Button>
    </ReactModal>
  );
};

export default CustomModal;
