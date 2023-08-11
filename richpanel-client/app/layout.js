import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { PaymentProvider } from '@/context/PaymentContext';

export default function RootLayout({ children }) {

    return (

        <html lang="en">
            <body>
                <main id='root'>
                    <AuthProvider>
                        <PaymentProvider>
                            {children}
                        </PaymentProvider>
                    </AuthProvider>
                </main>
            </body>
        </html>
    )
}