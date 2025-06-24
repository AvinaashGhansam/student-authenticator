import { Button, type ButtonProps } from "@chakra-ui/react";

const CustomButton = ({
  title,
  bg = "primary.900",
  fontWeight = "bold",
  size = "md",
  variant = "solid",
  ...rest
}: ButtonProps & { title: string }) => {
  return (
    <Button
      bg={bg}
      fontWeight={fontWeight}
      size={size}
      variant={variant}
      {...rest}
    >
      {title}
    </Button>
  );
};

export default CustomButton;
