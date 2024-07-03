import { useTheme } from "./ThemeProvider";
import { Moon, Sun } from "lucide-react";

function ThemeToggler() {
  const {theme, setTheme} = useTheme();

  function handleClick() {
    if(theme === 'light'){
      setTheme('dark')
    }
    else {
      setTheme('light')
    }

  }

  return (
    <button onClick={handleClick}>{theme === 'light'? <Sun/> :<Moon/>}</button>
  )
}

export default ThemeToggler;
