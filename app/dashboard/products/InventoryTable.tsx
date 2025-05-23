"use client";

import { useEffect, useState } from "react";
import ApiHelper from "@/app/Utils/apiHelper";
import apiEndPoints from "@/app/Utils/apiEndPoints";
import { handleApiError } from "@/app/Utils/apiHelper";
import ViewToggle, { ViewMode } from "./ViewToggle";
import TableView from "./TableView";
import GridView from "./GridView";

interface InventoryItem {
  _id: string;
  productTitle: string;
  brand: string;
  quantity: number;
  price: string;
  imagesUrl: string[];
}

interface InventoryResponse {
  inventory: InventoryItem[];
}

export default function InventoryTable() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("table");

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const data = await ApiHelper.get<InventoryResponse>(
          apiEndPoints.getBusinessInventory
        );
        setInventory(data.inventory);
      } catch (err) {
        const { message } = handleApiError(err, "Failed to fetch inventory");
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>;
  }

  if (inventory.length === 0) {
    return <div className="text-center py-4">No inventory items found</div>;
  }

  return (
    <div className="mt-8">
      <ViewToggle currentView={viewMode} onViewChange={setViewMode} />
      {viewMode === "table" ? (
        <TableView inventory={inventory} />
      ) : (
        <GridView inventory={inventory} />
      )}
    </div>
  );
}
