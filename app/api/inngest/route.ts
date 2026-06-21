import { serve } from "inngest/next";
import { inngest } from "@/features/inngest/client";
import { reviewPullRequest } from "@/features/reviews/server/review-pr";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [reviewPullRequest],
});