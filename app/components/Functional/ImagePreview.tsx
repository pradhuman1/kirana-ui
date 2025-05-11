import { PhotoIcon } from "@heroicons/react/24/outline";

interface ImagePreviewProps {
  imageUrl: string | null;
  onRemove: () => void;
  className?: string;
}

export default function ImagePreview({
  imageUrl,
  onRemove,
  className = "",
}: ImagePreviewProps) {
  if (!imageUrl) {
    return (
      <div
        className={`relative w-full aspect-square rounded-lg overflow-hidden border border-gray-200 ${className}`}
      >
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
          <PhotoIcon className="h-12 w-12 text-gray-300" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative w-full aspect-square rounded-lg overflow-hidden border border-gray-200 ${className}`}
    >
      <div className="relative w-full h-full">
        <img
          src={imageUrl}
          alt="Preview"
          className="w-full h-full object-cover"
        />
        <button
          type="button"
          onClick={onRemove}
          className="absolute top-2 right-2 rounded-full bg-red-100 p-1 text-red-600 hover:bg-red-200"
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
      </div>
    </div>
  );
}
