import { inngest } from "@/features/inngest/client";
import { db } from "@/lib/db";
import { getPineconeIndex } from "@/features/pinecone/client";
import { getPullRequestDiffs } from "@/features/reviews/server/pr-diff";
import { generateReview } from "@/features/reviews/server/generate-review";
import { postPrComment } from "@/features/reviews/server/post-pr-comment";
import { chunkPrFiles } from "@/features/reviews/utils/chunk-code";
import { buildPrNamespace, saveChunksToPinecone, searchPrContext } from "@/features/reviews/server/vector";
import { buildRepoNamespace } from "@/features/repo-sync/server";

export const reviewPullRequest = inngest.createFunction(
    { id: "review-pull-request", triggers: { event: "github/pr.received" } },
    async ({ event, step }) => {
        const pullRequestId = event.data.pullRequestId;

        const pullRequest = await step.run("mark-processing", async () => {
            return db.pullRequest.update({
                where: {
                    id: pullRequestId
                },
                data: {
                    status: "processing"
                }
            })
        })

        const chunks = await step.run("breakdown-code", async () => {
            const files = await getPullRequestDiffs(
                pullRequest.installationId,
                pullRequest.repoFullName,
                pullRequest.prNumber
            );
    
            // Turn unified diffs into fixed-size chunks for embedding
            return chunkPrFiles(pullRequest.prNumber, files);
        });
  
        if (chunks.length === 0) {
            await step.run("mark-reviewed-no-code", async () => {
                await db.pullRequest.update({
                    where: { id: pullRequestId },
                    data: { status: "reviewed" },
                });
            });
    
            return { pullRequestId, status: "reviewed", reason: "no code to review" };
        }

        // PR namespace isolates this diff from other PRs and from repo-wide sync data
        const namespace = buildPrNamespace(
            pullRequest.repoFullName,
            pullRequest.prNumber
        );

        await step.run("save-vectors-to-pinecone", async () => {
            await saveChunksToPinecone(namespace, chunks);
        });
  
        await step.run("verify-vectors-indexed", async () => {
            const index = getPineconeIndex();
            for (let i = 0; i < 3; i++) {
                const result = await index.namespace(namespace).searchRecords({
                    query: { topK: 1, inputs: { text: pullRequest.title } },
                });
                if (result.result.hits.length > 0) return;
                await new Promise(r => setTimeout(r, 3000));
            }
        });

        const searchQuery = [
            pullRequest.title,
            ...chunks.slice(0, 5).map(c => c.filePath),  
        ].join(" ");

        // Extra context from the on-demand codebase sync, when the repo was synced
        const repoContextSnippets = await step.run("search-repo-context", async () => {
            const repoSync = await db.repoSync.findUnique({
                where: { repoFullName: pullRequest.repoFullName },
            });
    
            if (!repoSync || repoSync.status !== "synced") {
                return [];
            }
    
            const repoNamespace = buildRepoNamespace(pullRequest.repoFullName);
            return searchPrContext(repoNamespace, searchQuery);
        });

        const review = await step.run("generate-ai-review", async () => {
            // Search within this PR's namespace for chunks related to the PR title
            const contextSnippets = await searchPrContext(
                namespace,
                searchQuery
            );
    
            return generateReview({
                repoFullName: pullRequest.repoFullName,
                title: pullRequest.title,
                contextSnippets,
                repoContextSnippets,
            });
        })

        await step.run("post-pr-comment", async () => {
            await postPrComment(
                pullRequest.installationId,
                pullRequest.repoFullName,
                pullRequest.prNumber,
                review
            );
        })

        await step.run("mark-reviewed", async () => {
            await db.pullRequest.update({
                where: { id: pullRequestId },
                data: {
                    status: "reviewed",
                    reviewComment: review,
                    reviewedAt: new Date(),
                },
            });
        });

        await step.run("cleanup-pr-namespace", async () => {
            const index = getPineconeIndex();
            await index.deleteNamespace(namespace);
        });

        return { pullRequestId, status: "reviewed" };
    }
)