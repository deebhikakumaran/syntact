import { Inngest } from "inngest";

export const inngest = new Inngest({ id: "codefox", eventKey: process.env.INNGEST_EVENT_KEY, });