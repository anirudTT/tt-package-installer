import ModeToggle from "./DarkModeToggle";
import logo from "../assets/tt_logo.svg";

const NavBar = () => {
  return (
    <div className="relative w-full bg-white dark:bg-gray-800 shadow-xl z-50">
      <div className="flex items-center justify-between w-full px-4 py-2 sm:px-5 sm:py-3">
        <a
          href="https://www.tenstorrent.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center"
        >
          <img
            src={logo}
            alt="Tenstorrent Logo"
            className="w-10 h-10 sm:w-14 sm:h-14 transform transition duration-300 hover:scale-110"
          />
          <h4 className="hidden sm:block text-lg sm:text-2xl ml-3 font-bold font-roboto text-black dark:text-white">
            TT Package Installer
          </h4>
        </a>
        <div className="flex items-center space-x-2 sm:space-x-4">
          <ModeToggle />
        </div>
      </div>
    </div>
  );
};

export default NavBar;
