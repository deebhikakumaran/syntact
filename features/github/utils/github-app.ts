import "server-only";
import { App } from "@octokit/app";

let githubApp: App | null = null;

export function getGithubApp(): App {
    if (!githubApp) {
        githubApp = new App({
            appId: process.env.GITHUB_APP_ID!,
            privateKey: process.env.GITHUB_APP_PRIVATE_KEY!.replace(/\\n/g, "\n"),
            webhooks: {
                secret: process.env.GITHUB_WEBHOOK_SECRET!
            }
        })
    }

    return githubApp;
}