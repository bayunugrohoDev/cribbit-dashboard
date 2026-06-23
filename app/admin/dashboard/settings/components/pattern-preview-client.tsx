"use client";

import React, { useState, useEffect } from "react";
import { getPatterns, getCountries } from "@/app/actions/address-patterns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Globe } from "lucide-react";

export function PatternPreviewClient() {
  const [patterns, setPatterns] = useState<any[]>([]);
  const [countries, setCountries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const p = await getPatterns();
        const c = await getCountries();
        setPatterns(p);
        setCountries(c);
      } catch (err) {
        console.error("Failed to load pattern preview", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  if (isLoading) {
    return <div className="p-8 text-center text-sm text-muted-foreground animate-pulse">Loading active patterns...</div>;
  }

  if (patterns.length === 0) {
    return <div className="p-8 text-center text-sm text-muted-foreground">No patterns found.</div>;
  }

  // Sort patterns: DEFAULT first, then alphabetical
  const sortedPatterns = [...patterns].sort((a, b) => {
    if (a.id === "PATTERN_WESTERN_DEFAULT") return -1;
    if (b.id === "PATTERN_WESTERN_DEFAULT") return 1;
    return (a.name || "").localeCompare(b.name || "");
  });

  return (
    <div className="border rounded-md w-full max-w-xl mx-auto bg-card shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/40">
          <TableRow>
            <TableHead>Active Pattern Group</TableHead>
            <TableHead className="text-right">Countries Mapped</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedPatterns.map((p) => {
            const mappedCount = countries.filter((c) => c.pattern_id === p.id && c.country_code !== "DEFAULT").length;
            const isDefault = p.id === "PATTERN_WESTERN_DEFAULT";

            return (
              <TableRow key={p.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {p.name}
                    {isDefault && <Badge variant="secondary" className="text-[10px] uppercase font-semibold">Global Default</Badge>}
                  </div>
                </TableCell>
                <TableCell className="text-right text-muted-foreground">
                  <div className="flex items-center justify-end gap-1.5 text-sm">
                    <Globe className="w-3.5 h-3.5 opacity-70" />
                    {isDefault ? (
                      <span className="italic">Rest of the world</span>
                    ) : (
                      <span>{mappedCount} {mappedCount === 1 ? 'Country' : 'Countries'}</span>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
