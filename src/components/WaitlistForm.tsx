"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/lib/constants";

export function WaitlistForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsapp_number: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE_URL}/api/cohorts/waitlist/join/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 409) {
          throw new Error("Horay baad iska diiwaangelisay liiska sugitaanka.");
        }
        throw new Error(data.error || "Waxbaa khaldamay. Fadlan mar kale isku day.");
      }

      // Success: Redirect to confirmation page with position
      router.push(`/waitlist-confirmed?position=${data.position}&email=${encodeURIComponent(formData.email)}&phone=${encodeURIComponent(formData.whatsapp_number)}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto w-full p-6 rounded-3xl border border-border bg-card shadow-xl">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold mb-2">Ku biir liiska sugitaanka</h3>
        <p className="text-sm text-muted-foreground">
          Cohort-ka hadda waa buuxsamay. Is-diiwaangeli si aan kuu wargelino marka kooxda xigta la furayo.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="name">Magacaaga oo buuxa</Label>
          <Input
            id="name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Tusaale: Axmed Cali"
            className="rounded-xl"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">Email-kaaga</Label>
          <Input
            id="email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="email@example.com"
            className="rounded-xl"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="whatsapp">Lambarka WhatsApp-ka</Label>
          <Input
            id="whatsapp"
            type="tel"
            required
            value={formData.whatsapp_number}
            onChange={(e) => setFormData({ ...formData, whatsapp_number: e.target.value })}
            placeholder="+252..."
            className="rounded-xl"
          />
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium text-center">
            {error}
          </div>
        )}

        <Button 
          type="submit" 
          disabled={loading} 
          className="w-full h-12 rounded-xl font-bold transition-all"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Ku biir liiska sugitaanka →"}
        </Button>
      </form>
    </div>
  );
}
