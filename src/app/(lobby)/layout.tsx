import Footer from '@components/layouts/Footer';
import Header from '@components/layouts/Header';
import { ReactNode } from 'react';

const LobbyLayout = ({ children }: { children: ReactNode }) => {
    return (
        <>
            <Header />
            <main className="container my-8 h-full">{children}</main>
            <Footer />
        </>
    );
};

export default LobbyLayout;
