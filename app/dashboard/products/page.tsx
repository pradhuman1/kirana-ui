"use client";
import NoData from "@/app/components/NoData";
import { ShoppingBagIcon } from "@heroicons/react/20/solid";
import { useState } from "react";
import AddProductModal from "./AddProductModal";
import { useRouter } from "next/navigation";
// import {
//   BarcodeIcon,
//   ArrowUpTrayIcon,
//   PencilSquareIcon,
// } from "@heroicons/react/24/outline";

export default function Products() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const addProduct = () => {
    setIsModalOpen(true);
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
      <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
      <div className="mt-6">
        <NoData
          noDataTitle="No products found"
          noDataText="Add a product to get started"
          buttonText="Add Product"
          buttonAction={addProduct}
          icon={<ShoppingBagIcon />}
        />
      </div>

      <AddProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onOptionSelect={handleOptionClick}
      />
    </div>
  );
}
