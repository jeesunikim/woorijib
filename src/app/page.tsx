import { HomeSetupForm } from "@/components/home-setup-form";

export default function Home() {
  return (
    <main className="min-h-screen p-8 max-w-4xl mx-auto">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">WooriJib</h1>
          <p className="text-muted-foreground mt-1">
            우리집 — Your AI home diagnosis agent
          </p>
        </div>
        <p className="text-lg">
          Upload your inspection photos, contractor recordings, and reports.
          Get structured, cited diagnoses you can actually act on.
        </p>
        <HomeSetupForm />
      </div>
    </main>
  );
}
