import type { Metadata } from 'next'; import './style.css';
export const metadata:Metadata={title:'Madeira de Quintal | Casa, luz, madeira e histórias',description:'Peças de madeira, luminárias, decoração e móveis com design acolhedor.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="pt-BR"><body>{children}</body></html>;}
