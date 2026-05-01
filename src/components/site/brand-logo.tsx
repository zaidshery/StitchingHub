import { siteConfig } from "@/lib/config/site";

type BrandLogoProps = {
  size?: "sm" | "md";
  showLabel?: boolean;
};

const sizeClass = {
  sm: "h-8 w-8",
  md: "h-10 w-10 sm:h-12 sm:w-12 lg:h-9 lg:w-9",
};

export function BrandLogo({ size = "md", showLabel = true }: BrandLogoProps) {
  return (
    <span className={`relative grid ${sizeClass[size]} shrink-0 place-items-center rounded-full bg-[#4b2774] shadow-[0_10px_24px_rgba(75,39,116,0.16)]`}>
      <svg viewBox="0 0 64 64" aria-hidden="true" className="h-[72%] w-[72%]">
        <path
          d="M22 18h20l-4 7H26l-4-7Z"
          fill="#f7e9cf"
        />
        <path
          d="M26 25h12v16H26z"
          fill="#f7e9cf"
        />
        <path
          d="M22 46h20l-4-7H26l-4 7Z"
          fill="#f7e9cf"
        />
        <path d="M25 30h14" stroke="#4b2774" strokeLinecap="round" strokeWidth="2.4" />
        <path d="M25 36h14" stroke="#4b2774" strokeLinecap="round" strokeWidth="2.4" />
        <path d="M44 24c5 3 5 13 0 16" fill="none" stroke="#d8bd67" strokeLinecap="round" strokeWidth="3" />
        <path d="M48 31h4" stroke="#d8bd67" strokeLinecap="round" strokeWidth="3" />
      </svg>
      <span className="sr-only">{showLabel ? siteConfig.name : ""}</span>
    </span>
  );
}
