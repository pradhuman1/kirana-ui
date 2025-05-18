import Link from "next/link";

interface RedirectionInfoProps {
  message: string;
  linkText: string;
  href: string;
  className?: string;
}

export default function RedirectionInfo({
  message,
  linkText,
  href,
  className = "mt-10 text-center text-sm/6 text-gray-500",
}: RedirectionInfoProps) {
  return (
    <p className={className}>
      {message}{" "}
      <Link
        href={href}
        className="font-semibold text-indigo-600 hover:text-indigo-500"
      >
        {linkText}
      </Link>
    </p>
  );
}
