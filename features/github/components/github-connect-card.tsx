"use client";

import { SquareArrowOutUpRight, Plug } from 'lucide-react';
import { GithubIcon } from '@/components/icons/lucide-github';
import type { GithubInstallationStatus } from "@/features/dashboard/lib/types";
import {
    statusBadge,
    statusButtonClass,
} from "@/features/dashboard/lib/status-style";
import { getGithubInstallUrl } from "@/features/github/utils/github-urls";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import { useFormStatus } from "react-dom";
import { disconnectGithubApp } from "@/features/github/actions";


type GithubConnectCardProps = {
    userId: string;
    installation: GithubInstallationStatus;
};


function ConnectedDetails({ accountLogin }: { accountLogin: string | null }) {
    return (
        <p className="text-xs text-muted-foreground">
            Installed for{" "}
            <span className="font-medium text-green-700 dark:text-green-400">
                @{accountLogin}
            </span>
            . The app can read repository metadata and post review comments on pull
            requests.
        </p>
    );
}


function DisconnectedDetails() {
    return (
        <ul className="list-inside list-disc space-y-1 text-xs text-muted-foreground">
            <li>Access public and private repositories you select</li>
            <li>Receive webhooks for pull request events</li>
            <li>Post AI-generated review comments on PRs</li>
        </ul>
    );
}


function ConnectionDetails({
    connected,
    accountLogin,
}: {
    connected: boolean;
    accountLogin: string | null;
}) {
    if (connected) {
        return <ConnectedDetails accountLogin={accountLogin} />;
    }

    return <DisconnectedDetails />;
}


function DisconnectSubmitButton() {
    const { pending } = useFormStatus();

    return (
        <Button
            type="submit"
            variant="outline"
            className={cn(statusButtonClass.danger, "rounded-sm")}
            disabled={pending}
        >
            <Plug className="size-4" />
            {pending ? "Disconnecting..." : "Disconnect GitHub App"}
        </Button>
    );
}

function ConnectedActions() {
    return (
        <form action={disconnectGithubApp}>
            <DisconnectSubmitButton />
        </form>
    );
}


function DisconnectedActions({ installUrl }: { installUrl: string }) {
    const [isRedirecting, setIsRedirecting] = useState(false);

    return (
        <Button
            nativeButton={false}
            render={<a href={installUrl} onClick={() => setIsRedirecting(true)} />}
            className={cn(statusButtonClass.success, 
                            "rounded-sm", 
                            isRedirecting && "pointer-events-none opacity-70")}
        >
            <GithubIcon />
            {isRedirecting ? "Redirecting to GitHub..." : "Install GitHub App"}
            <SquareArrowOutUpRight className="size-3 opacity-80" />
        </Button>
    );
}


function ConnectionActions({
    connected,
    installUrl,
}: {
    connected: boolean;
    installUrl: string;
}) {
    if (connected) {
        return <ConnectedActions />;
    }

    return <DisconnectedActions installUrl={installUrl} />;
}
0

export function GithubConnectCard({
    userId,
    installation,
}: GithubConnectCardProps) {
    0

    const { connected, accountLogin } = installation;
    // Install URL encodes userId so the callback can associate the installation
    const installUrl = getGithubInstallUrl(userId);

    // Default to neutral styling; switch to green when connected
    let cardBorderClass = "border-border";
    let iconWrapperClass = "border-border bg-muted";
    let statusTone: "success" | "neutral" = "neutral";
    let statusLabel = "Not connected";

    if (connected) {
        cardBorderClass = "border-green-500/30";
        iconWrapperClass =
            "border-green-500/40 bg-green-500/10 text-green-700 dark:text-green-400";
        statusTone = "success";
        statusLabel = "Connected";
    }

    return (
        <div className="flex flex-1 flex-col gap-6 p-6">
            <Card className={cn("max-w-2xl transition-colors rounded-sm", cardBorderClass)}>
                <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <span
                                className={cn(
                                    "flex size-10 items-center justify-center rounded-none border",
                                    iconWrapperClass
                                )}
                            >
                                <GithubIcon className="size-5" />
                            </span>
                            <div>
                                <CardTitle>CODEFOX</CardTitle>
                                <CardDescription>
                                    Install account or organization to access public and private repositories.
                                </CardDescription>
                            </div>
                        </div>
                        <span className={statusBadge(statusTone)}>{statusLabel}</span>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <ConnectionDetails connected={connected} accountLogin={accountLogin} />
                </CardContent>
                <CardFooter className="flex flex-wrap gap-2">
                    <ConnectionActions connected={connected} installUrl={installUrl} />
                </CardFooter>
            </Card>
        </div>
    );
}