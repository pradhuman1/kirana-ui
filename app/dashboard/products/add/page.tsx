"use client";

import {
  QrCodeIcon,
  ArrowUpTrayIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AddProduct() {
  const router = useRouter();
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Add Product</h1>
        <p className="mt-1 text-sm text-gray-500">
          Choose a method to add products to your inventory
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <Link
          href="/dashboard/products/add/barcode"
          className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 text-left hover:bg-gray-50 hover:cursor-pointer"
        >
          <QrCodeIcon className="h-6 w-6 text-gray-600" />
          <div>
            <h4 className="font-medium text-gray-900">Barcode</h4>
            <p className="text-sm text-gray-500">Scan product barcode</p>
          </div>
        </Link>

        <Link
          href="/dashboard/products/add/bulk"
          className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 text-left hover:bg-gray-50 hover:cursor-pointer"
        >
          <ArrowUpTrayIcon className="h-6 w-6 text-gray-600" />
          <div>
            <h4 className="font-medium text-gray-900">Bulk XL Upload</h4>
            <p className="text-sm text-gray-500">
              Upload multiple products via Excel
            </p>
          </div>
        </Link>

        <Link
          href="/dashboard/products/add/manualUpload"
          className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 text-left hover:bg-gray-50 hover:cursor-pointer"
        >
          <PencilSquareIcon className="h-6 w-6 text-gray-600" />
          <div>
            <h4
              className="font-medium text-gray-900"
              onClick={() =>
                router.push("/dashboard/products/add/manualUpload")
              }
            >
              Manually Add
            </h4>
            <p className="text-sm text-gray-500">
              Add product details manually
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
