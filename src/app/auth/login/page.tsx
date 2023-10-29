import LogInForm from './LogInForm';

export default function LoginForm() {
    return (
        <>
            <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-2xl font-semibold tracking-tight">Login an account</h1>
                <p className="text-sm text-muted-foreground">
                    Enter your credentials below to login your account
                </p>
            </div>
            <div className={'grid gap-6'}>
                <LogInForm />
            </div>
        </>
    );
}
