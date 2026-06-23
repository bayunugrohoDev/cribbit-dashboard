"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createAgentAccount } from "@/app/actions/agents";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Field, FieldLabel, FieldContent } from "@/components/ui/field";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? "Creating..." : "Create Agent"}
    </Button>
  );
}

interface CreateAgentSheetProps {
  children?: React.ReactNode;
}

export function CreateAgentSheet({ children }: CreateAgentSheetProps) {
  const [open, setOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  async function action(formData: FormData) {
    setErrorMsg("");
    setSuccessMsg("");

    const res = await createAgentAccount(formData);

    if (res.success) {
      setSuccessMsg(res.message);
      // close after a bit
      setTimeout(() => {
        setOpen(false);
        setSuccessMsg("");
      }, 1500);
    } else {
      setErrorMsg(res.message);
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {children || <Button>Add Agent</Button>}
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Create Agent Profile</SheetTitle>
          <SheetDescription>
            Enter the details below to manually create an agent account.
          </SheetDescription>
        </SheetHeader>

        <form action={action} className="mt-3 space-y-6 px-4">
          <Field>
            <FieldLabel htmlFor="fullName">Full Name</FieldLabel>
            <FieldContent>
              <Input
                id="fullName"
                name="fullName"
                placeholder="John Doe"
                required
              />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel htmlFor="email">Email Address</FieldLabel>
            <FieldContent>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john@example.com"
                required
              />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
            <FieldContent>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+46123456789"
                required
              />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel htmlFor="companyName">Company / Agency Name</FieldLabel>
            <FieldContent>
              <Input
                id="companyName"
                name="companyName"
                placeholder="Fastighet AB"
                required
              />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel htmlFor="region">Region</FieldLabel>
            <FieldContent>
              <Input
                id="region"
                name="region"
                placeholder="Stockholm"
                required
              />
            </FieldContent>
          </Field>

          {successMsg && (
            <div className="text-sm font-medium text-green-600 bg-green-50 p-3 rounded-md">
              {successMsg}
            </div>
          )}

          {errorMsg && (
            <div className="text-sm font-medium text-red-600 bg-red-50 p-3 rounded-md">
              {errorMsg}
            </div>
          )}

          <SubmitButton />
        </form>
      </SheetContent>
    </Sheet>
  );
}
