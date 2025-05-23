import { Combobox } from "@headlessui/react";
import {
  CheckIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { useState, useEffect, useRef, useCallback } from "react";
import { debounce } from "lodash";
import ApiHelper from "@/app/Utils/apiHelper";
import apiEndPoints from "@/app/Utils/apiEndPoints";

interface ProductVariant {
  productID: string;
  productTitle: string;
  weight: string;
  price: string;
  brand: string;
  variants: ProductVariant[];
  imagesUrl: string[];
}

interface Product {
  productID: string;
  productTitle: string;
  weight: string;
  price: string;
  brand: string;
  variants: ProductVariant[];
  imagesUrl: string[];
}

interface SearchEntityProps {
  selectedEntity: Product | null;
  onEntitySelect: (entity: Product | null) => void;
  placeholder?: string;
  className?: string;
  apiEndPoint?: string;
  showClearButton?: boolean;
}

export default function SearchEntity({
  selectedEntity,
  onEntitySelect,
  placeholder = "Search...",
  className = "",
  apiEndPoint = "",
  showClearButton = true,
}: SearchEntityProps) {
  const [query, setQuery] = useState("");
  const [entities, setEntities] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Ref to store the abort controller
  const abortControllerRef = useRef<AbortController | null>(null);

  const searchProducts = useCallback(
    async (searchQuery: string) => {
      // Cancel any previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      if (!apiEndPoint || searchQuery.length < 2) {
        setEntities([]);
        return;
      }

      // Create new AbortController for this request
      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;

      setIsLoading(true);
      try {
        const response = await ApiHelper.post(
          apiEndPoint,
          {
            searchTerm: searchQuery,
            page: 1,
            pageSize: 20,
          },
          { signal }
        );

        // Only update if the request wasn't aborted
        if (!signal.aborted && response.data) {
          const { products = [] } = response.data;
          setEntities(products);
        }
      } catch (error: unknown) {
        // Don't update state if the request was aborted
        if (error instanceof Error && error.name === "AbortError") {
          console.log("Request was aborted");
          return;
        }
        console.error("Error searching products:", error);
        if (!signal.aborted) {
          setEntities([]);
        }
      } finally {
        if (!signal.aborted) {
          setIsLoading(false);
        }
      }
    },
    [apiEndPoint]
  );

  // Create a memoized debounced search function
  const debouncedSearch = useRef(
    debounce((searchQuery: string) => {
      searchProducts(searchQuery);
    }, 300)
  ).current;

  // Update search when query changes
  useEffect(() => {
    debouncedSearch(query);

    // Cleanup function
    return () => {
      debouncedSearch.cancel();
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [query, debouncedSearch]);

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEntitySelect(null);
  };

  return (
    <div className={className}>
      <Combobox value={selectedEntity} onChange={onEntitySelect}>
        <div className="relative">
          <Combobox.Input
            as="input"
            className="w-full rounded-lg border border-gray-300 py-2 pl-3 pr-10 text-sm leading-5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onChange={(event) => setQuery(event.target.value)}
            displayValue={(entity: Product | null) =>
              entity?.productTitle ?? ""
            }
            placeholder={placeholder}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 gap-1">
            {selectedEntity && showClearButton && (
              <button
                onClick={handleClear}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                title="Clear selection"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            )}
            <Combobox.Button className="flex items-center">
              <MagnifyingGlassIcon
                className={`h-5 w-5 ${
                  isLoading ? "animate-spin" : "text-gray-400"
                }`}
                aria-hidden="true"
              />
            </Combobox.Button>
          </div>
          <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {isLoading ? (
              <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                Searching...
              </div>
            ) : entities.length === 0 && query !== "" ? (
              <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                No results found.
              </div>
            ) : (
              entities.map((entity) => (
                <Combobox.Option
                  key={entity.productID}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-16 pr-4 ${
                      active ? "bg-indigo-600 text-white" : "text-gray-900"
                    }`
                  }
                  value={entity}
                >
                  {({ selected, active }) => (
                    <>
                      <div className="absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 flex-shrink-0">
                        {entity.imagesUrl && entity.imagesUrl.length > 0 && (
                          <img
                            src={entity.imagesUrl[0]}
                            alt={entity.productTitle}
                            className="h-full w-full object-contain rounded"
                          />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span
                          className={`block truncate ${
                            selected ? "font-medium" : "font-normal"
                          }`}
                        >
                          {entity.productTitle}
                        </span>
                        <span
                          className={`block truncate text-sm ${
                            active ? "text-white/80" : "text-gray-500"
                          }`}
                        >
                          {entity.weight} • {entity.brand}
                        </span>
                      </div>
                      {selected ? (
                        <span
                          className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                            active ? "text-white" : "text-indigo-600"
                          }`}
                        >
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Combobox.Option>
              ))
            )}
          </Combobox.Options>
        </div>
      </Combobox>
    </div>
  );
}
