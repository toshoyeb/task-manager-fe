import React from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store/store";
import { logout } from "../../store/slices/authSlice";
import { Disclosure } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

// Utility function to join class names
function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const Navbar: React.FC = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );

  const handleLogout = () => {
    dispatch(logout());
  };

  const navLinks = [
    { title: "Dashboard", path: "/dashboard", authRequired: true },
    { title: "Tasks", path: "/tasks", authRequired: true },
    { title: "Chat", path: "/chat", authRequired: true },
    { title: "Login", path: "/login", authRequired: false },
    { title: "Register", path: "/register", authRequired: false },
  ];

  return (
    <Disclosure as="nav" className="bg-white shadow-md">
      {({ open }) => (
        <>
          <div className="container mx-auto px-4">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <Link to="/" className="text-xl font-bold text-blue-600">
                    TaskManager
                  </Link>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  {navLinks.map((item) => {
                    if (item.authRequired && !isAuthenticated) return null;
                    if (!item.authRequired && isAuthenticated) return null;
                    return (
                      <NavLink
                        key={item.title}
                        to={item.path}
                        className={({ isActive }) =>
                          classNames(
                            isActive
                              ? "inline-flex items-center border-b-2 border-blue-500 px-1 pt-1 text-sm font-medium text-gray-900"
                              : "inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                          )
                        }
                      >
                        {item.title}
                      </NavLink>
                    );
                  })}
                </div>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:items-center">
                {isAuthenticated ? (
                  <div className="ml-3 relative flex items-center">
                    <div className="text-sm text-gray-700 mr-4">
                      Hi, {user?.name}
                    </div>
                    <button
                      onClick={handleLogout}
                      className="bg-white p-1 rounded-full text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="flex space-x-4">
                    <Link
                      to="/login"
                      className="text-gray-600 hover:text-gray-900"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="text-gray-600 hover:text-gray-900"
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
              <div className="-mr-2 flex items-center sm:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>
          <Disclosure.Panel className="sm:hidden">
            <div className="pt-2 pb-3 space-y-1">
              {navLinks.map((item) => {
                if (item.authRequired && !isAuthenticated) return null;
                if (!item.authRequired && isAuthenticated) return null;
                return (
                  <Disclosure.Button
                    key={item.title}
                    as={NavLink}
                    to={item.path}
                    className={({ isActive }: { isActive: boolean }) =>
                      classNames(
                        isActive
                          ? "block border-l-4 border-blue-500 bg-blue-50 py-2 pl-3 pr-4 text-base font-medium text-blue-700"
                          : "block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800"
                      )
                    }
                  >
                    {item.title}
                  </Disclosure.Button>
                );
              })}
            </div>
            <div className="pt-4 pb-3 border-t border-gray-200">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center px-4">
                    <div className="flex-shrink-0">
                      <span className="inline-block h-10 w-10 overflow-hidden rounded-full bg-gray-100">
                        <svg
                          className="h-full w-full text-gray-300"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      </span>
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium text-gray-800">
                        {user?.name}
                      </div>
                      <div className="text-sm font-medium text-gray-500">
                        {user?.email}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1 px-2">
                    <Disclosure.Button
                      as="button"
                      onClick={handleLogout}
                      className="block w-full text-left rounded-md px-3 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                    >
                      Logout
                    </Disclosure.Button>
                  </div>
                </>
              ) : (
                <div className="mt-3 space-y-1 px-2">
                  <Disclosure.Button
                    as={Link}
                    to="/login"
                    className="block rounded-md px-3 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                  >
                    Login
                  </Disclosure.Button>
                  <Disclosure.Button
                    as={Link}
                    to="/register"
                    className="block rounded-md px-3 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                  >
                    Register
                  </Disclosure.Button>
                </div>
              )}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default Navbar;
