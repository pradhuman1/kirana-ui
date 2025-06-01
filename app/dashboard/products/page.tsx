"use client";
import NoData from "@/app/components/NoData";
import { ShoppingBagIcon } from "@heroicons/react/20/solid";
import { useState } from "react";
import AddProductModal from "./AddProductModal";
import { useRouter } from "next/navigation";
import InventoryList from "./InventoryList";
// import {
//   BarcodeIcon,
//   ArrowUpTrayIcon,
//   PencilSquareIcon,
// } from "@heroicons/react/24/outline";

export default function Products() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const addProduct = () => {
    router.push("/dashboard/products/add/manualUpload");
    // setIsModalOpen(true);
  };

  const handleOptionClick = (option: string, path?: string) => {
    console.log(`Selected option: ${option}`);
    console.log(`Selected path: ${path}`);
    setIsModalOpen(false);
    if (path) {
      router.push(path);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Inventory</h1>
        <button
          onClick={addProduct}
          className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Add Product
        </button>
      </div>

      <InventoryList />

      <AddProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onOptionSelect={handleOptionClick}
      />
    </div>
  );
}
