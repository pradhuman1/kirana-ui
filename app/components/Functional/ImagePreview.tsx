import { PhotoIcon } from "@heroicons/react/24/outline";
import RemoveButton from "../RemoveButton";

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
          <div className="flex flex-col items-center">
            <PhotoIcon className="h-12 w-12 text-gray-300" />
            <span className="mt-2 text-sm text-gray-500">Upload an image</span>
          </div>
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
        <RemoveButton onClick={onRemove} className="absolute top-2 right-2" />
      </div>
    </div>
  );
}
