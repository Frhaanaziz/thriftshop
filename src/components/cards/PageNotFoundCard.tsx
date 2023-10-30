import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';
import { buttonVariants } from '@components/ui/button';

const PageNotFoundCard = () => {
    return (
        <main className="flex items-center justify-center min-h-screen">
            <div className="border flex flex-col justify-center items-center p-10 rounded-xl">
                <div className="bg-primary-foreground p-5 rounded-full ">
                    <AlertTriangle className="w-14 h-14 " />
                </div>
                <div className="my-10">
                    <h1 className="font-semibold text-2xl my-3 text-center">Page not found</h1>
                    <p className="text-muted-foreground">The page you are looking for does not exist</p>
                </div>

                <Link
                    href="/"
                    className={buttonVariants({
                        size: 'lg',
                        className: 'border',
                    })}
                >
                    Go to Home
                </Link>
            </div>
        </main>
    );
};

export default PageNotFoundCard;
