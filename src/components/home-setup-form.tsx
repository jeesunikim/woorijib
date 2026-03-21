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
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          placeholder="473 Corbett Ave, San Francisco, CA"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="yearBuilt">Year Built</Label>
        <Input
          id="yearBuilt"
          type="number"
          placeholder="1953"
          value={yearBuilt}
          onChange={(e) => setYearBuilt(e.target.value)}
        />
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create Home Profile"}
      </Button>
    </form>
  );
}
