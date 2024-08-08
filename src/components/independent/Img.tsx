import { Image, ImageProps } from "@chakra-ui/react";
import { useState } from "react";

interface Props extends ImageProps {
  initialSrc?: string;
  fallbackSrc?: string;
}

export default function Img({ initialSrc, fallbackSrc, ...props }: Props) {
  const [src, setSrc] = useState<string | undefined>(initialSrc);

  return (
    <Image
      src={src}
      onError={() => {
        console.log("error");
        setSrc(fallbackSrc);
      }}
      {...props}
    />
  );
}
