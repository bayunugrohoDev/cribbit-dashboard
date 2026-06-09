"use client";

import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
} from "@/components/ui/dialog";
import { fetchSettings, updateSettings, SystemSetting } from "@/lib/api/settings";
import { toast } from "sonner";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";

export default function SettingsPage() {
  const queryClient = useQueryClient();
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

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Configuration Settings</h1>
        <p className="text-muted-foreground text-sm">
          Manage integrations, secrets, pricing, and notification emails for the Cribbit platform.
        </p>
      </div>

      <Tabs defaultValue="postcard" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="postcard">Postcard Configuration</TabsTrigger>
          <TabsTrigger value="stripe">Stripe Settings</TabsTrigger>
          <TabsTrigger value="email">Email Notification (Resend)</TabsTrigger>
        </TabsList>

        {/* Tab 1: Postcard Settings */}
        <TabsContent value="postcard">
          <Card>
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
        </TabsContent>

        {/* Tab 2: Stripe Integration */}
        <TabsContent value="stripe">
          <Card>
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
        </TabsContent>

        {/* Tab 3: Email Settings */}
        <TabsContent value="email">
          <Card>
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
        </TabsContent>
      </Tabs>

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
