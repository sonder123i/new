import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import type { ScreenVariant } from '@/components/mockup/PhoneScreen';

const params = new URLSearchParams(window.location.search);
const root = createRoot(document.getElementById('root')!);

if (params.get('lab') === 'screens') {
  const screen = (params.get('screen') ?? 'home') as ScreenVariant;
  import('./lab/ScreenshotLab').then(({ ScreenshotLab }) => {
    root.render(<ScreenshotLab screen={screen} />);
  });
} else {
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
