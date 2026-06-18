import { DASHBOARD_ROUTES } from "@/features/dashboard/lib/routes";
import { saveInstallation } from "@/features/github/server/installation";
import { getServerSession } from "@/features/auth/actions";
import { redirect } from "next/navigation";

function buildSignInCallbackUrl(installationId: string | null): string {
    if (installationId) {
        return `/api/github/callback?installation_id=${installationId}`;
    }
    return DASHBOARD_ROUTES.github;
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const installationId = searchParams.get("installation_id");
    const session = await getServerSession();

    if (!session) {
        const callbackUrl = buildSignInCallbackUrl(installationId);
        redirect(`/sign-in?callbackUrl=${encodeURIComponent(callbackUrl)}`);
    }

    if (installationId) {
        try {
            await saveInstallation(session.user.id, Number(installationId));
        } catch (error) {
            console.error("🚨 Failed to save installation:", error);
            return new Response("Internal Server Error while saving installation", { status: 500 });
        }
    }

    redirect(DASHBOARD_ROUTES.github);
}