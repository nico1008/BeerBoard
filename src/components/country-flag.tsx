import Image from "next/image";

export function CountryFlag({
  isoCode,
  className = "",
}: {
  isoCode: string;
  className?: string;
}) {
  return (
    <Image
      className={`country-flag ${className}`.trim()}
      src={`/flags/${isoCode.toLowerCase()}.svg`}
      alt=""
      width={32}
      height={24}
    />
  );
}
