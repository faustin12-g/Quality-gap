import LOGO from '../assets/QG_logo.png';
import { useLocation } from "react-router-dom";
import { navigation } from "../constants";
import { disablePageScroll, enablePageScroll } from "scroll-lock";
import Button from "./Button";
import MenuSvg from '../assets/svg/MenuSvg';
import { useState } from "react";
import { Globe2 } from 'lucide-react'; // Icon for translate button

const Header = () => {
  const pathname = useLocation();
  const [openNavigation, setOpenNavigation] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState("en");

  const toggleNavigation = () => {
    if (openNavigation) {
      setOpenNavigation(false);
      enablePageScroll();
    } else {
      setOpenNavigation(true);
      disablePageScroll();
    }
  };

  const handleClick = () => {
    if (!openNavigation) return;

    enablePageScroll();
    setOpenNavigation(false);
  };

  const handleLanguageChange = (language) => {
    setCurrentLanguage(language);
    setDropdownOpen(false); // Close dropdown after selection
    // Integrate Google Translate or your language switching logic here
    console.log(`Language changed to: ${language}`);
  };

  return (
    <div
      className={`shadow-xl fixed top-0 left-0 w-full z-50 lg:bg-amber-100 lg:backdrop-blur-sm ${
        openNavigation ? "bg-amber-100" : "bg-amber-100 backdrop-blur-sm"
      }`}
    >
      <div className="flex items-center px-5 lg:px-7.5 xl:px-10 max-lg:py-4">
        {/* Logo */}
        <a className="block w-[12rem] xl:mr-8" href="#hero">
          <img src={LOGO} width={120} height={5} alt="QualityGap Logo" />
        </a>

        {/* Navigation */}
        <nav
          className={`${
            openNavigation ? "flex" : "hidden"
          } fixed top-[5rem] left-0 right-0 bottom-0 bg-amber-50 backdrop-blur-lg lg:static lg:flex lg:mx-auto lg:bg-transparent`}
        >
          <div className="relative z-2 flex flex-col items-center justify-center m-auto lg:flex-row">
            {navigation.map((item) => (
              <a
                key={item.id}
                href={item.url}
                onClick={handleClick}
                className={`block relative font-code text-2xl uppercase text-black transition-colors hover:text-amber-400 ${
                  item.onlyMobile ? "lg:hidden" : ""
                } px-4 py-4 md:py-6 lg:py-2 lg:-mr-0.25 lg:text-xs lg:font-semibold ${
                  item.url === pathname.hash
                    ? "z-2 lg:text-black"
                    : "lg:text-black/50"
                } lg:leading-5 lg:hover:text-black xl:px-4`}
              >
                {item.title}
              </a>
            ))}
          </div>
        </nav>

        {/* Join Request & Sign In */}
        <a
          href="/placeholder.html"
          className="button hidden mr-8 text-black/50 transition-colors hover:text-black lg:block"
        >
          Join Request
        </a>
        <Button
          className="hidden lg: bg-amber-300 p-1 text-black/45 hover:text-black hover:bg-amber-200 rounded-md"
          href="/placeholder.html"
        >
          Sign in
        </Button>

        {/* Language Dropdown */}
        <div className="relative ml-4">
          <button
            className="flex items-center space-x-2 p-2 bg-white rounded-md hover:bg-gray-100"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <Globe2 className="w-5 h-5 text-black" />
            <span className="text-sm font-medium text-black">
              {currentLanguage === "en"
                ? "English"
                : currentLanguage === "fr"
                ? "Français"
                : "Kinyarwanda"}
            </span>
          </button>
          {dropdownOpen && (
            <div
              className="absolute right-0 mt-2 p-2 bg-white shadow-md rounded-md"
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <button
                className={`block w-full text-left px-4 py-2 text-sm ${
                  currentLanguage === "en" ? "bg-gray-100" : "hover:bg-gray-100"
                }`}
                onClick={() => handleLanguageChange("en")}
              >
                English
              </button>
              <button
                className={`block w-full text-left px-4 py-2 text-sm ${
                  currentLanguage === "fr" ? "bg-gray-100" : "hover:bg-gray-100"
                }`}
                onClick={() => handleLanguageChange("fr")}
              >
                Français
              </button>
              <button
                className={`block w-full text-left px-4 py-2 text-sm ${
                  currentLanguage === "rw" ? "bg-gray-100" : "hover:bg-gray-100"
                }`}
                onClick={() => handleLanguageChange("rw")}
              >
                Kinyarwanda
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <Button
          className="ml-auto lg:hidden text-black/25"
          px="px-3"
          onClick={toggleNavigation}
        >
          <MenuSvg openNavigation={openNavigation} />
        </Button>
      </div>
    </div>
  );
};

export default Header;
