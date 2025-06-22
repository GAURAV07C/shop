import './global.css';
import Header from '../shared/widgets/header';
import Providers from './providers';

export const metadata = {
  title: 'Eshop',
  description: 'Eshop - Your online shopping destination',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>

       
        
        <Header />

        {children}
        
      </Providers>
         </body>
    </html>
  );
}
