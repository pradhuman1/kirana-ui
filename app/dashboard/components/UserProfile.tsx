import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { useUser } from "@/app/context/UserContext";
import { logoutUser } from "@/app/Utils/apiHelper";

export default function UserProfile() {
  const { userData } = useUser();
  console.log(userData);
  console.log("userData");

  const getUserDisplayName = () => {
    if (userData.shopName) {
      console.log("shopName");
      console.log(userData.shopName);
      return userData.shopName;
    }
    if (userData.mobileNumber) {
      return userData.mobileNumber;
    }
    return "";
  };

  const handleLogout = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    logoutUser();
  };

  const userNavigation = [
    { name: "Your profile", href: "#" },
    { name: "Sign out", href: "#", action: handleLogout },
  ];
  return (
    <Menu as="div" className="relative">
      <MenuButton className="-m-1.5 flex items-center p-1.5">
        <span className="sr-only">Open user menu</span>

        <span className="flex items-center">
          <span
            aria-hidden="true"
            className="ml-4 text-sm/6 font-semibold text-gray-900"
          >
            {getUserDisplayName()}
          </span>
          <ChevronDownIcon
            aria-hidden="true"
            className="ml-2 size-5 text-gray-400"
          />
        </span>
        <img
          alt=""
          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
          className="size-8 rounded-full bg-gray-50"
        />
      </MenuButton>
      <MenuItems
        transition
        className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
      >
        {userNavigation.map((item) => (
          <MenuItem key={item.name}>
            <a
              href={item.href}
              className="block px-3 py-1 text-sm/6 text-gray-900 data-focus:bg-gray-50 data-focus:outline-hidden"
              onClick={item.action}
            >
              {item.name}
            </a>
          </MenuItem>
        ))}
      </MenuItems>
    </Menu>
  );
}
