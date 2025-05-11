import { Combobox } from "@headlessui/react";
import { CheckIcon, MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { useState } from "react";

interface Entity {
  id: string;
  name: string;
  [key: string]: any; // Allow additional properties
}

interface SearchEntityProps<T extends Entity> {
  entities: T[];
  selectedEntity: T | null;
  onEntitySelect: (entity: T | null) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchEntity<T extends Entity>({
  entities,
  selectedEntity,
  onEntitySelect,
  placeholder = "Search...",
  className = "",
}: SearchEntityProps<T>) {
  const [query, setQuery] = useState("");

  const filteredEntities =
    query === ""
      ? entities
      : entities.filter((entity) =>
          entity.name.toLowerCase().includes(query.toLowerCase())
        );

  return (
    <div className={className}>
      <Combobox value={selectedEntity} onChange={onEntitySelect}>
        <div className="relative">
          <Combobox.Input
            as="input"
            className="w-full rounded-lg border border-gray-300 py-2 pl-3 pr-10 text-sm leading-5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onChange={(event) => setQuery(event.target.value)}
            displayValue={(entity: Entity) => entity?.name ?? ""}
            placeholder={placeholder}
          />
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
            <MagnifyingGlassIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </Combobox.Button>
          <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {filteredEntities.length === 0 && query !== "" ? (
              <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                No results found.
              </div>
            ) : (
              filteredEntities.map((entity) => (
                <Combobox.Option
                  key={entity.id}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? "bg-indigo-600 text-white" : "text-gray-900"
                    }`
                  }
                  value={entity}
                >
                  {({ selected, active }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? "font-medium" : "font-normal"
                        }`}
                      >
                        {entity.name}
                      </span>
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
