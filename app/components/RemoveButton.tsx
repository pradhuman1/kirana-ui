interface RemoveButtonProps {
  onClick: () => void;
  className?: string;
}

export default function RemoveButton({
  onClick,
  className = "",
}: RemoveButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full bg-red-100 p-1 text-red-600 hover:bg-red-200 cursor-pointer ${className}`}
    >
      <svg
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  );
}
