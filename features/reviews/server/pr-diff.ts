import { PrFile } from "@/features/reviews/types/review";
import { getGithubApp } from "@/features/github/utils/github-app";

const FILES_PER_PAGE = 100;

export function formatPrDiffsForReview(files: PrFile[]): string {
    return files
            .map((file) => `### ${file.filePath}\n\`\`\`diff\n${file.patch}\n\`\`\``)
            .join("\n\n");
}

export async function getPullRequestDiffs(installationId: number, repoFullName: string, prNumber: number): Promise<PrFile[]> {
    const app = getGithubApp();
    const octokit = await app.getInstallationOctokit(installationId)
    const [owner, repo] = repoFullName.split("/");

    const { data } = await octokit.request(
        "GET /repos/{owner}/{repo}/pulls/{pull_number}/files",
        { owner, repo, pull_number: prNumber, per_page: FILES_PER_PAGE }
    )

    const files: PrFile[] = [];

    for (const file of data) {
        if (!file.patch) {
            continue;
        }

        files.push({ filePath: file.filename, patch: file.patch });
    }

    return files;
}