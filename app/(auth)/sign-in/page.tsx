import { GithubLoginForm } from "@/features/auth/components/github-sign-in-form"
import type { Metadata } from 'next';
import { requireUnauth } from "@/features/auth/actions";

export const metadata: Metadata = {
    title: "Sign In",
    description: "Sign In to Syntact with your Github Account.",
};

type SignInProps = {
    searchParams: Promise<{ callbackUrl?: string }>;
};

async function SignIn({ searchParams }: SignInProps) {
    await requireUnauth();
    const { callbackUrl } = await searchParams;
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
            <div className="w-full max-w-sm">
                <GithubLoginForm callbackUrl={callbackUrl} />
            </div>
        </div>
    )
}

export default SignIn


