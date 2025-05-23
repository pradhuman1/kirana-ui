"use client";

import { Squares2X2Icon, TableCellsIcon } from "@heroicons/react/24/outline";

export type ViewMode = "table" | "grid";

interface ViewToggleProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

export default function ViewToggle({
  currentView,
  onViewChange,
}: ViewToggleProps) {
  return (
    <div className="flex justify-end mb-4">
      <div className="inline-flex rounded-md shadow-sm" role="group">
        <button
          type="button"
          onClick={() => onViewChange("table")}
          className={`px-4 py-2 text-sm font-medium rounded-l-lg border ${
            currentView === "table"
              ? "bg-gray-100 text-gray-900 border-gray-300"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
          }`}
        >
          <TableCellsIcon className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => onViewChange("grid")}
          className={`px-4 py-2 text-sm font-medium rounded-r-lg border ${
            currentView === "grid"
              ? "bg-gray-100 text-gray-900 border-gray-300"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
          }`}
        >
          <Squares2X2Icon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
