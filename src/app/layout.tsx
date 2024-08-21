

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CustomThemeProvider from './components/ThemeProvider';
import { Container } from '@mui/material';
import './globals.css';
import { Providers } from './providers';

export const metadata = {
  title: 'Niraj Dhakal',
  description: 'Portfolio website of Niraj Dhakal',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
        <CustomThemeProvider>
          <Navbar />
          <Container component="main" sx={{ minHeight: '80vh', py: 3 }}>
            {children}
          </Container>
          <Footer />
        </CustomThemeProvider>
        </Providers>
      </body>
    </html>
  );
}