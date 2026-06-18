"use server";

import { getServerSession } from "@/features/auth/actions";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getGithubApp } from "@/features/github/utils/github-app";
import { deleteInstallation, getUserInstallationId } from "@/features/github/server/installation";
import { DASHBOARD_ROUTES } from "@/features/dashboard/lib/routes";


export async function disconnectGithubApp() {
    const session = await getServerSession();

    if (!session) {
        redirect("/sign-in");
    }

    try {
        const installationId = await getUserInstallationId(session.user.id);

        if (installationId) {
            const app = getGithubApp();
            try {
                await app.octokit.request("DELETE /app/installations/{installation_id}", {
                    installation_id: installationId,
                });
            } catch (githubError) {
                console.warn("GitHub uninstall skipped/failed:", githubError);
            }
        }

        await deleteInstallation(session.user.id);

        revalidatePath(DASHBOARD_ROUTES.github);

    } 
    catch (error) {
        console.error("🚨 Fatal error during disconnect:", error);
        throw new Error("Failed to disconnect from GitHub");
    }

    await deleteInstallation(session.user.id);
    redirect(DASHBOARD_ROUTES.github);
}