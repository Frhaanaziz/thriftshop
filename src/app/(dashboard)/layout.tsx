import Footer from '@components/layouts/Footer';
import Header from '@components/layouts/Header';
const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <Header />
            {children}
            <Footer />
        </>
    );
};

export default DashboardLayout;
