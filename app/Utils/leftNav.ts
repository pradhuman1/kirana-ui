import {
  HomeIcon,
  UsersIcon,
  FolderIcon,
  CalendarIcon,
  DocumentDuplicateIcon,
  ChartPieIcon,
} from "@heroicons/react/24/outline";
export const navigationItems = [
  { name: "Dashboard", href: "/dashboard", icon: HomeIcon, current: true },
  //{ name: "Team", href: "#", icon: UsersIcon, current: false },
  {
    name: "Products",
    href: "/dashboard/products",
    icon: FolderIcon,
    current: false,
    subItems: [
      { name: "Add Product", href: "/dashboard/products/add" },
      //   { name: "Product List", href: "/dashboard/products" },
    ],
  },
  {
    name: "Orders",
    href: "/dashboard/orders",
    icon: CalendarIcon,
    current: false,
  },
  //   { name: "Customers", href: "#", icon: DocumentDuplicateIcon, current: false },
  {
    name: "Reports",
    href: "/dashboard/reports",
    icon: ChartPieIcon,
    current: false,
  },
];
