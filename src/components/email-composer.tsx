import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Diagnosis } from "@/types/diagnosis";

type RecipientType = "contractor" | "realtor" | "seller" | "inspector";

interface EmailComposerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  diagnosis: Diagnosis;
  homeAddress: string;
}

export function EmailComposer({
  open,
  onOpenChange,
  diagnosis,
  homeAddress,
}: EmailComposerProps) {
  const [selectedRecipient, setSelectedRecipient] = useState<RecipientType>("contractor");
  const [userEmail, setUserEmail] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [draft, setDraft] = useState<{ subject: string; body: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleDraftEmail() {
    if (!userEmail.trim()) {
      setError("Please enter your email address");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/draft-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          diagnosis,
          recipientType: selectedRecipient,
          userEmail,
          homeAddress,
        }),
      });

      if (!response.ok) throw new Error("Failed to draft email");

      const data = await response.json();
      setDraft(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to draft email");
    } finally {
      setLoading(false);
    }
  }

  async function handleSendEmail() {
    if (!draft || !recipientEmail.trim()) {
      setError("Please enter recipient email");
      return;
    }

    setSending(true);
    setError("");

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: recipientEmail,
          subject: draft.subject,
          body: draft.body,
          userEmail,
        }),
      });

      if (!response.ok) throw new Error("Failed to send email");

      setSuccess(true);
      setTimeout(() => {
        onOpenChange(false);
        setDraft(null);
        setRecipientEmail("");
        setUserEmail("");
        setSuccess(false);
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send email");
    } finally {
      setSending(false);
    }
  }

  const recipientLabels: Record<RecipientType, string> = {
    contractor: "Contractor",
    realtor: "Real Estate Agent",
    seller: "Seller / Seller's Agent",
    inspector: "Home Inspector",
  };

  const recipientDescriptions: Record<RecipientType, string> = {
    contractor: "Request a quote and ask technical questions",
    realtor: "Discuss negotiation strategy and next steps",
    seller: "Request repairs or credits",
    inspector: "Ask follow-up questions about findings",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Draft Email about {diagnosis.issue}</DialogTitle>
          <DialogDescription>
            AI-powered email generator for {diagnosis.issue.toLowerCase()}
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <svg className="w-12 h-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-lg font-medium text-foreground">Email sent successfully!</p>
            <p className="text-sm text-muted-foreground">The email was sent to {recipientEmail}</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Step 1: Select Recipient */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">Who do you want to email?</label>
              <Tabs value={selectedRecipient} onValueChange={(v) => setSelectedRecipient(v as RecipientType)}>
                <TabsList className="grid w-full grid-cols-4">
                  {Object.entries(recipientLabels).map(([key, label]) => (
                    <TabsTrigger key={key} value={key} className="text-xs">
                      {label}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {Object.entries(recipientDescriptions).map(([key, desc]) => (
                  <TabsContent key={key} value={key}>
                    <p className="text-xs text-muted-foreground">{desc}</p>
                  </TabsContent>
                ))}
              </Tabs>
            </div>

            {/* Step 2: Your Email */}
            <div className="space-y-2">
              <label htmlFor="userEmail" className="text-sm font-medium text-foreground">
                Your email address
              </label>
              <Input
                id="userEmail"
                type="email"
                placeholder="you@example.com"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                disabled={!!draft}
              />
            </div>

            {/* Step 3: Draft Preview */}
            {draft ? (
              <>
                <div className="space-y-3 bg-card border border-border/60 rounded-lg p-4">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase">Subject</label>
                    <p className="text-sm font-medium text-foreground mt-1">{draft.subject}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase">Email Body</label>
                    <div className="bg-background rounded p-3 mt-2 max-h-64 overflow-y-auto text-sm text-foreground whitespace-pre-wrap">
                      {draft.body}
                    </div>
                  </div>
                </div>

                {/* Recipient Email */}
                <div className="space-y-2">
                  <label htmlFor="recipientEmail" className="text-sm font-medium text-foreground">
                    Send to
                  </label>
                  <Input
                    id="recipientEmail"
                    type="email"
                    placeholder={`${recipientLabels[selectedRecipient]}'s email address`}
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                  />
                </div>
              </>
            ) : null}

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}
          </div>
        )}

        <DialogFooter className="gap-2">
          {!success && (
            <>
              <Button
                variant="outline"
                onClick={() => {
                  onOpenChange(false);
                  setDraft(null);
                  setRecipientEmail("");
                  setError("");
                }}
              >
                Cancel
              </Button>
              {!draft ? (
                <Button onClick={handleDraftEmail} disabled={loading}>
                  {loading ? "Drafting..." : "Draft Email"}
                </Button>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setDraft(null)}
                    disabled={sending}
                  >
                    Edit
                  </Button>
                  <Button onClick={handleSendEmail} disabled={sending || !recipientEmail.trim()}>
                    {sending ? "Sending..." : "Send Email"}
                  </Button>
                </>
              )}
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
