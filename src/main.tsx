import { createRoot } from 'react-dom/client'
import { ThemeProvider } from "next-themes"
import App from './App.tsx'
import './index.css'

// Initialize font size on app load
const savedFontSize = localStorage.getItem('fontSize') || 'medium';
document.documentElement.classList.add(`font-size-${savedFontSize}`);

createRoot(document.getElementById("root")!).render(
  <ThemeProvider
    attribute="class"
    defaultTheme="system"
    enableSystem
    disableTransitionOnChange
  >
    <App />
  </ThemeProvider>
);
