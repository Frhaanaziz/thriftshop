import SignOutForm from '../../../components/forms/SignOutForm';

const SignoutPage = () => {
    return (
        <div className="flex flex-col items-center justify-center">
            <h1 className="font-bold text-2xl">Sign out</h1>
            <p className="text-muted-foreground text-lg my-2">Are you sure you want to sign out?</p>
            <div className="flex gap-2 my-5 w-full">
                <SignOutForm />
            </div>
        </div>
    );
};

export default SignoutPage;
