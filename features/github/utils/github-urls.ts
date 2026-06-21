
export function getGithubInstallUrl(userId: string): string {
    const publicLink = process.env.NEXT_PUBLIC_GITHUB_APP_PUBLIC_LINK;

    if (!publicLink) {
        throw new Error("Missing NEXT_PUBLIC_GITHUB_APP_PUBLIC_LINK in environment variables.");
    }

    const url = new URL(publicLink);
    url.searchParams.set("state", userId);
    return url.toString();
}