"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

export function HomeSetupForm() {
  const [address, setAddress] = useState("");
  const [yearBuilt, setYearBuilt] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase
      .from("homes")
      .insert({
        address,
        year_built: yearBuilt ? parseInt(yearBuilt) : null,
        phase: "inspection_complete",
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating home:", error);
      setLoading(false);
      return;
    }

    router.push(`/home/${data.id}`);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="address" className="text-sm font-medium text-foreground">Address</Label>
        <Input
          id="address"
          placeholder="123 Main St, Anytown, CA"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
          className="h-12 bg-background border-border/80 focus:border-primary focus:ring-primary/20"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="yearBuilt" className="text-sm font-medium text-foreground">Year Built</Label>
        <Input
          id="yearBuilt"
          type="number"
          placeholder="1953"
          value={yearBuilt}
          onChange={(e) => setYearBuilt(e.target.value)}
          className="h-12 bg-background border-border/80 focus:border-primary focus:ring-primary/20"
        />
      </div>
      <Button type="submit" disabled={loading} className="w-full h-12 text-base font-medium">
        {loading ? "Creating..." : "Get Started"}
      </Button>
    </form>
  );
}
