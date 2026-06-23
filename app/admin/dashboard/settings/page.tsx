"use client";

import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";
import { fetchSettings, updateSettings, SystemSetting } from "@/lib/api/settings";
import { toast } from "sonner";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { PatternConfigClient } from "./components/pattern-config-client";
import { PatternPreviewClient } from "./components/pattern-preview-client";

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = React.useState("address");
  const [formValues, setFormValues] = React.useState<Record<string, string>>({});
  
  // Confirmation Modal State
  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);
  const [pendingKeys, setPendingKeys] = React.useState<string[] | null>(null);

  const {
    data: settings = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["settings"],
    queryFn: fetchSettings,
  });

  // Initialize form values from settings data
  React.useEffect(() => {
    if (settings && settings.length > 0) {
      const values: Record<string, string> = {};
      settings.forEach((s) => {
        // Convert postcard_amount_cents to SEK for display
        if (s.key === "postcard_amount_cents") {
          const cents = parseInt(s.value, 10) || 0;
          values[s.key] = String(cents / 100);
        } else {
          values[s.key] = s.value;
        }
      });
      setFormValues(values);
    }
  }, [settings]);

  const mutation = useMutation({
    mutationFn: updateSettings,
    onSuccess: () => {
      toast.success("Settings updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to update settings.");
    },
  });

  const handleInputChange = (key: string, value: string) => {
    setFormValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const triggerConfirmSave = (keysToSave: string[]) => {
    setPendingKeys(keysToSave);
    setIsConfirmOpen(true);
  };

  const handleConfirmSave = () => {
    if (pendingKeys) {
      const payload = pendingKeys.map((key) => {
        let finalValue = formValues[key] || "";
        // Convert SEK back to cents for postcard_amount_cents
        if (key === "postcard_amount_cents") {
          const valSEK = parseFloat(finalValue) || 0;
          finalValue = String(Math.round(valSEK * 100));
        }
        return { key, value: finalValue };
      });

      mutation.mutate(payload);
    }
    setIsConfirmOpen(false);
    setPendingKeys(null);
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <LoadingSkeleton />
      </div>
    );
  }

  if (isError) {
    console.error("Error loading settings:", error);
    return (
      <div className="text-red-500 p-6">
        Error loading configuration. Please try again later.
      </div>
    );
  }

  const navItems = [
    { id: "address", title: "Address Patterns" },
    { id: "postcard", title: "Postcard Configuration" },
    { id: "stripe", title: "Stripe Settings" },
    { id: "email", title: "Email Notification" },
  ];

  return (
    <div className="p-6 w-full max-w-5xl mx-auto space-y-6">
      <div className="mb-6 space-y-0.5">
        <h1 className="text-2xl font-bold tracking-tight">Configuration Settings</h1>
        <p className="text-muted-foreground text-sm">
          Manage integrations, secrets, pricing, and notification emails for the Cribbit platform.
        </p>
      </div>

      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-8 lg:space-y-0 w-full">
        <aside className="lg:w-64 shrink-0">
          <div className="border rounded-xl p-2 bg-card shadow-sm">
            <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
            {navItems.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "justify-start whitespace-nowrap",
                  activeTab === item.id
                    ? "bg-muted hover:bg-muted"
                    : "hover:bg-transparent hover:underline"
                )}
              >
                {item.title}
              </Button>
            ))}
            </nav>
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          {/* Content 1: Postcard Settings */}
          {activeTab === "postcard" && (
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Postcard Pricing & Currency</CardTitle>
              <CardDescription>
                Configure the unit price and currency users pay for sending physical postcards.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="postcard_amount_cents">Postcard Price (in SEK)</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="postcard_amount_cents"
                    type="number"
                    value={formValues.postcard_amount_cents || ""}
                    onChange={(e) => handleInputChange("postcard_amount_cents", e.target.value)}
                    placeholder="50"
                  />
                  <span className="text-sm font-semibold">SEK</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  The price will be processed in cents on Stripe (e.g., 50.00 SEK = 5000 cents).
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="postcard_currency">Currency Code</Label>
                <Input
                  id="postcard_currency"
                  type="text"
                  value={formValues.postcard_currency || ""}
                  onChange={(e) => handleInputChange("postcard_currency", e.target.value)}
                  placeholder="sek"
                  className="uppercase"
                />
                <p className="text-xs text-muted-foreground">
                  Must be lowercase in the database, e.g. "sek".
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => triggerConfirmSave(["postcard_amount_cents", "postcard_currency"])}
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Saving..." : "Save Postcard Settings"}
              </Button>
            </CardFooter>
          </Card>
          )}

          {/* Content 2: Stripe Integration */}
          {activeTab === "stripe" && (
          <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div className="space-y-1.5">
                <CardTitle>Stripe Credentials</CardTitle>
                <CardDescription>
                  Configure Stripe API keys and Webhook secret. Secrets are hidden for security.
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <a href="https://dashboard.stripe.com/apikeys" target="_blank" rel="noopener noreferrer">
                  Stripe Dashboard
                </a>
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="stripe_publishable_key">Stripe Publishable Key</Label>
                <Input
                  id="stripe_publishable_key"
                  type="text"
                  value={formValues.stripe_publishable_key || ""}
                  onChange={(e) => handleInputChange("stripe_publishable_key", e.target.value)}
                  placeholder="pk_test_..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stripe_secret_key">Stripe Secret Key</Label>
                <Input
                  id="stripe_secret_key"
                  type="text"
                  value={formValues.stripe_secret_key || ""}
                  onChange={(e) => handleInputChange("stripe_secret_key", e.target.value)}
                  placeholder="sk_test_..."
                />
                <p className="text-xs text-muted-foreground">
                  Updating this field triggers a dynamic database write. Untouched masked strings are automatically preserved.
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="stripe_webhook_secret">Stripe Webhook Secret</Label>
                  <a href="https://dashboard.stripe.com/webhooks" target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline">
                    Manage Webhooks
                  </a>
                </div>
                <Input
                  id="stripe_webhook_secret"
                  type="text"
                  value={formValues.stripe_webhook_secret || ""}
                  onChange={(e) => handleInputChange("stripe_webhook_secret", e.target.value)}
                  placeholder="whsec_..."
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => triggerConfirmSave(["stripe_publishable_key", "stripe_secret_key", "stripe_webhook_secret"])}
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Saving..." : "Save Stripe Settings"}
              </Button>
            </CardFooter>
          </Card>
          )}

          {/* Content 3: Email Settings */}
          {activeTab === "email" && (
          <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div className="space-y-1.5">
                <CardTitle>Resend Email Credentials & Addresses</CardTitle>
                <CardDescription>
                  Configure the Resend API key and email routing.
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <a href="https://resend.com/api-keys" target="_blank" rel="noopener noreferrer">
                  Resend Console
                </a>
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="resend_api_key">Resend API Key</Label>
                <Input
                  id="resend_api_key"
                  type="text"
                  value={formValues.resend_api_key || ""}
                  onChange={(e) => handleInputChange("resend_api_key", e.target.value)}
                  placeholder="re_..."
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="postcard_email_from">From Email Address</Label>
                  <a href="https://resend.com/domains" target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline">
                    Verify Domain
                  </a>
                </div>
                <Input
                  id="postcard_email_from"
                  type="text"
                  value={formValues.postcard_email_from || ""}
                  onChange={(e) => handleInputChange("postcard_email_from", e.target.value)}
                  placeholder="Cribbit Vykort <onboarding@resend.dev>"
                />
                <p className="text-xs text-muted-foreground">
                  The verified sender address in your Resend account.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="postcard_admin_email">Admin Recipient Email Address</Label>
                <Input
                  id="postcard_admin_email"
                  type="email"
                  value={formValues.postcard_admin_email || ""}
                  onChange={(e) => handleInputChange("postcard_admin_email", e.target.value)}
                  placeholder="admin@cribbit.se"
                />
                <p className="text-xs text-muted-foreground">
                  The destination email address where order notifications will be sent.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => triggerConfirmSave(["resend_api_key", "postcard_email_from", "postcard_admin_email"])}
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Saving..." : "Save Email Settings"}
              </Button>
            </CardFooter>
          </Card>
          )}

          {/* Content 4: Address Patterns */}
          {activeTab === "address" && (
            <Card className="shadow-sm w-full">
              <CardHeader>
                <CardTitle>Address Pattern Configurator</CardTitle>
                <CardDescription>
                  Manage global address writing fallback logic and connect it with country codes.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-lg bg-muted/10 space-y-8">
                  <PatternPreviewClient />

                  <div className="space-y-4 text-center">
                    <p className="text-sm text-muted-foreground max-w-md mx-auto">
                      The configurator requires a wide workspace to manage templates and mappings.
                    </p>
                    <Dialog>
                    <DialogTrigger asChild>
                      <Button size="lg">Launch Configurator</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-[95vw] w-full h-[90vh] overflow-y-auto flex flex-col p-0">
                      <DialogHeader className="p-6 pb-0 shrink-0">
                        <DialogTitle>Address Pattern Configurator</DialogTitle>
                        <DialogDescription>
                          Drag and drop templates and define Google Maps tags fallbacks.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex-1 overflow-y-auto p-6 pt-0 min-h-0">
                        <PatternConfigClient />
                      </div>
                    </DialogContent>
                  </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Save Confirmation Dialog */}
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle className="text-red-600 dark:text-red-400">Save Configuration Changes?</DialogTitle>
            <DialogDescription className="pt-2">
              Are you sure you want to update the platform settings? 
              This will modify active database variables used by both this dashboard and the mobile applications in production.
              <br /><br />
              <strong className="text-destructive font-medium">Warning: This action cannot be undone.</strong>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </DialogClose>
            <Button type="button" variant="destructive" onClick={handleConfirmSave}>
              Confirm Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
