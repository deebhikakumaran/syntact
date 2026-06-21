export type PrFile = {
    filePath: string;
    patch: string;
};


export type ReviewInput = {
    repoFullName: string;
    title: string;
    diff: string;
};

export type CodeChunk = {
    id: string;
    filePath: string;
    text: string;
};


export type PullRequestWebhookPayload = {
    action: string;
    installation: { id: number };
    repository: { full_name: string };
    pull_request: {
        number: number;
        title: string;
        user: { login: string } | null;
        head: { sha: string };
        base: { ref: string };
    };
};