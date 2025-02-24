import { Box, Icon, IconButton } from "@chakra-ui/react";
import { RiEyeLine, RiEyeOffLine } from "@remixicon/react";
import { RefObject, useState } from "react";
import StringInput from "./StringInput";

interface Props {
  name: string;
  onChangeSetter: (inputValue: string | undefined) => void;
  inputValue: string | undefined;
  isError?: boolean;
  placeholder?: string;
  fRef?: RefObject<HTMLInputElement>;
}

export default function PasswordInput({
  name,
  onChangeSetter,
  inputValue,
  isError,
  placeholder,
  fRef,
  ...props
}: Props) {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <Box position={"relative"}>
      <StringInput
        fRef={fRef}
        name={name}
        placeholder={placeholder || "*******"}
        onChangeSetter={(inputValue) => {
          onChangeSetter(inputValue);
        }}
        inputValue={inputValue}
        type={showPassword ? "text" : "password"}
        pr={"40px !important"}
        {...props}
      />

      <IconButton
        aria-label="show password button"
        icon={
          <Icon as={showPassword ? RiEyeOffLine : RiEyeLine} fontSize={20} />
        }
        bg={"transparent"}
        _hover={{ bg: "transparent" }}
        _active={{ bg: "transparent" }}
        position={"absolute"}
        right={0}
        top={0}
        zIndex={2}
        onClick={() => {
          setShowPassword((ps) => !ps);
        }}
      />
    </Box>
  );
}
