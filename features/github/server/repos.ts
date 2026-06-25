import { getGithubApp } from "@/features/github/utils/github-app";


export type GithubRepo = {
    id: string;
    name: string;
    fullName: string;
    visibility: "public" | "private";
    defaultBranch: string;
    updatedAt: string;
    language: string | null;
    stars: number;
};


function getRepoVisibility(isPrivate?: boolean): GithubRepo["visibility"] {
    if (isPrivate) {
        return "private";
    }

    return "public";
}


export type InstallationReposPage = {
    repos: GithubRepo[];
    totalCount: number;
    page: number;
    hasMore: boolean;
};


/** Normalizes a raw GitHub API repo object into our app's `GithubRepo` shape. */
function mapRepo(repo: {
    id: number;
    name: string;
    full_name: string;
    private?: boolean;
    default_branch?: string;
    updated_at?: string | null;
    language?: string | null;
    stargazers_count?: number | null;
}): GithubRepo {
    return {
        id: String(repo.id),
        name: repo.name,
        fullName: repo.full_name,
        visibility: getRepoVisibility(repo.private),
        defaultBranch: repo.default_branch ?? "main",
        updatedAt: repo.updated_at ?? new Date().toISOString(),
        language: repo.language ?? null,
        stars: repo.stargazers_count ?? 0,
    };
}


const REPOS_PER_PAGE = 100;


export async function getInstallationReposPage(
    installationId: number,
    page = 1
): Promise<InstallationReposPage> {
    const app = getGithubApp();
    // `getInstallationOctokit` exchanges the App JWT for an installation access token.
    const octokit = await app.getInstallationOctokit(installationId);
    const { data } = await octokit.request("GET /installation/repositories", {
        per_page: REPOS_PER_PAGE,
        page,
    });

    const totalCount = data.total_count;
    const repos = data.repositories.map(mapRepo);

    return {
        repos,
        totalCount,
        page,
        hasMore: page * REPOS_PER_PAGE < totalCount,
    };
}