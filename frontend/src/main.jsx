import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HeroUIProvider } from "@heroui/react";
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <HeroUIProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </HeroUIProvider>
);