import React, { useEffect, useState } from "react";
function ThemeController() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  // const [theme, setTheme] = useState(
  //   localStorage.getItem("theme") ? localStorage.getItem("theme") : "light"
  // );

  const element = document.documentElement;
  useEffect(() => {
    if (theme === "dark") {
      element.classList.add("dark");
      localStorage.setItem("theme", "dark");
      document.body.classList.add("dark")
    }
    else {
      element.classList.remove("dark");
      localStorage.setItem("theme", "light");
      document.body.classList.remove("dark");
    }
    
    
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };
  return (
    <div className="flex items-center justify-center mb-6">
      <button
        className="px-3 py-3 text-xl font-bold rounded-lg shadow-md bg-white-100 text-gray-800 dark:bg-gray-800 dark:text-white dark:shadow-white  "
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
