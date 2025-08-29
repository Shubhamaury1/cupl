import React, { useEffect, useState } from "react";
function ThemeController() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };
  return (
    <div className="flex items-center justify-center mt-10">
      <button
        onClick={toggleTheme}
       
      >
        {theme === "light"
          ? "🌞 Switch to Dark Theme"
          : "🌙 Switch to Light Theme"}
      </button>
    </div>
  );
}
export default ThemeController;








//  className =
//    "px-3 py-3 text-lg font-bold rounded-lg shadow-md bg-gray-200 dark:bg-gray-800 dark:text-white transition-all";