import Footer from '@components/layouts/Footer';
import Header from '@components/layouts/Header';
import SideNav from '@components/layouts/SideNav';
import { ReactNode } from 'react';

const DashboardLayout = ({ children }: { children: ReactNode }) => {
    return (
        <>
            <Header />

            <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10 md:min-h-screen">
                <SideNav />
                <main className="my-8 h-full">{children}</main>
            </div>

            <Footer />
        </>
    );
};

export default DashboardLayout;
