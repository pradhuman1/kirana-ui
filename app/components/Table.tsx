interface Column<T> {
  header: string;
  accessor: keyof T;
  width?: string;
  render?: (item: T) => React.ReactNode;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
}

export default function Table<T>({
  columns,
  data,
  keyExtractor,
}: TableProps<T>) {
  return (
    <div className="w-full">
      <table className="min-w-full divide-y divide-gray-300">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th
                key={column.header}
                scope="col"
                className={`${
                  column.width || "w-1/5"
                } px-3 py-3.5 text-left text-sm font-semibold text-gray-900 ${
                  index === 0 ? "pl-4" : ""
                }`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((item) => (
            <tr key={keyExtractor(item)}>
              {columns.map((column, index) => (
                <td
                  key={column.header}
                  className={`px-0 py-4 text-sm ${
                    index === 0
                      ? "pl-1 font-medium text-gray-900"
                      : "text-gray-500"
                  }`}
                >
                  {column.render ? (
                    column.render(item)
                  ) : (
                    <div className="break-words">
                      {String(item[column.accessor])}
                    </div>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
