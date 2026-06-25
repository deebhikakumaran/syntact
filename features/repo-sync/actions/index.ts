"use server";

import { redirect } from "next/navigation";
import { requireAuth } from "../../auth/actions";
import { getUserInstallationId } from "@/features/github/server/installation";
import { DASHBOARD_ROUTES } from "@/features/dashboard/lib/routes";
import { triggerRepoSync } from "@/features/repo-sync/server";


export async function syncRepoCodebase(repoFullName: string, branch: string){
    const session = await requireAuth();
    const installationId = await getUserInstallationId(session.user.id);

    if(!installationId){
        redirect(DASHBOARD_ROUTES.github)
    }

    await triggerRepoSync(installationId , repoFullName , branch)
}