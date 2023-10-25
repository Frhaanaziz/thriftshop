'use client';
import { Button } from '@components/ui/button';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const SignOutForm = () => {
    const router = useRouter();

    function handleSubmit() {
        toast.success('Logout successful. See you next time!');
    }

    return (
        <>
            <form
                action="/api/auth/signout"
                method="POST"
                className="w-full"
                onSubmit={handleSubmit}
            >
                <Button
                    type="submit"
                    className={`w-full`}
                >
                    Log out
                </Button>
            </form>
            <Button
                variant="ghost"
                className="border w-full"
                onClick={() => router.back()}
            >
                Go back
            </Button>
        </>
    );
};

export default SignOutForm;
