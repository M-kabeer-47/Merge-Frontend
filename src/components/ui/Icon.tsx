import Image from "next/image";

interface IconProps {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
}

export default function Icon({
  src,
  alt = "Icon",
  width = 25,
  height = 25,
}: IconProps) {
  return <Image src={src} alt={alt} width={width} height={height} />;
}
