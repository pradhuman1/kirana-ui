import {
  QrCodeIcon,
  ArrowUpTrayIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import Modal from "@/app/components/Modal";

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOptionSelect: (option: string, path?: string) => void;
}

export default function AddProductModal({
  isOpen,
  onClose,
  onOptionSelect,
}: AddProductModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Select One of the Options to Add Product"
    >
      <div className="grid grid-cols-1 gap-4">
        <button
          onClick={() => onOptionSelect("barcode")}
          className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 text-left hover:bg-gray-50 hover:cursor-pointer"
        >
          <QrCodeIcon className="h-6 w-6 text-gray-600" />
          <div>
            <h4 className="font-medium text-gray-900">Barcode</h4>
            <p className="text-sm text-gray-500">Scan product barcode</p>
          </div>
        </button>

        <button
          onClick={() => onOptionSelect("bulk")}
          className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 text-left hover:bg-gray-50 hover:cursor-pointer"
        >
          <ArrowUpTrayIcon className="h-6 w-6 text-gray-600" />
          <div>
            <h4 className="font-medium text-gray-900">Bulk XL Upload</h4>
            <p className="text-sm text-gray-500">
              Upload multiple products via Excel
            </p>
          </div>
        </button>

        <button
          onClick={() =>
            onOptionSelect("manual", "/dashboard/products/add/manualUpload")
          }
          className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 text-left hover:bg-gray-50 hover:cursor-pointer"
        >
          <PencilSquareIcon className="h-6 w-6 text-gray-600" />
          <div>
            <h4 className="font-medium text-gray-900">Manually Add</h4>
            <p className="text-sm text-gray-500">
              Add product details manually
            </p>
          </div>
        </button>
      </div>
    </Modal>
  );
}
