import Image from "next/image";

export function Crest({
  size = 48,
  className = "",
  priority = false,
}: {
  size?: number;
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src="/coat-of-arms.png"
      alt=""
      width={size}
      height={size}
      priority={priority}
      className={className}
    />
  );
}
