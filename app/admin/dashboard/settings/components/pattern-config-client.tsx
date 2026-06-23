"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createPattern,
  deletePattern,
  savePatternSettings,
  updatePatternName,
  getPatterns,
  getCountries,
} from "@/app/actions/address-patterns";
import {
  IconGripVertical,
  IconX,
  IconPlus,
  IconTrash,
  IconEdit,
  IconCheck,
} from "@tabler/icons-react";
import { GOOGLE_ADDRESS_TAGS, ISO_COUNTRIES } from "@/lib/constants";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function SortableItem({ id, value, onChange, onRemove, onFocus }: any) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 bg-card relative z-10"
    >
      <div
        {...attributes}
        {...listeners}
        className="p-2 border rounded text-muted-foreground cursor-grab active:cursor-grabbing hover:bg-muted"
      >
        <IconGripVertical size={16} />
      </div>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        className="font-mono text-sm"
        placeholder="{route} {street_number}"
      />
      <Button variant="ghost" size="icon" onClick={onRemove}>
        <IconX size={16} className="text-red-500" />
      </Button>
    </div>
  );
}

export function PatternConfigClient() {
  const [initialPatterns, setInitialPatterns] = useState<any[]>([]);
  const [initialCountries, setInitialCountries] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const [selectedPatternId, setSelectedPatternId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        const p = await getPatterns();
        const c = await getCountries();
        setInitialPatterns(p);
        setInitialCountries(c);
        if (p.length > 0) setSelectedPatternId(p[0].id);
      } catch (err) {
        toast.error("Failed to load address patterns data");
      } finally {
        setIsLoadingData(false);
      }
    };
    loadData();
  }, []);

  const selectedPattern = initialPatterns.find(
    (p) => p.id === selectedPatternId,
  );

  // States
  const [templates, setTemplates] = useState<{ id: string; value: string }[]>(
    [],
  );

  const [assignedCountries, setAssignedCountries] = useState<string[]>([]);
  const [newCountryInput, setNewCountryInput] = useState("");

  // active input for tag insertion
  const [activeInputIndex, setActiveInputIndex] = useState<number | null>(null);

  // Dialog states
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newPatternName, setNewPatternName] = useState("");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editPatternName, setEditPatternName] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // Switch pattern
  const handlePatternChange = (id: string) => {
    setSelectedPatternId(id);
    const pattern = initialPatterns.find((p) => p.id === id);
    setTemplates(
      (pattern?.title_fallbacks || []).map((t: string, i: number) => ({
        id: `id-${Math.random()}`,
        value: t,
      })),
    );
    setAssignedCountries(
      initialCountries
        .filter((c) => c.pattern_id === id && c.country_code !== "DEFAULT")
        .map((c) => c.country_code),
    );
  };

  useEffect(() => {
    if (selectedPattern) {
        setTemplates((selectedPattern.title_fallbacks || []).map((t: string, i: number) => ({
            id: `id-${i}`,
            value: t,
        })));
        setAssignedCountries(
            initialCountries
              .filter((c) => c.pattern_id === selectedPattern.id && c.country_code !== "DEFAULT")
              .map((c) => c.country_code),
          );
    }
  }, [selectedPatternId]);

  // Drag End
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setTemplates((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over?.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleCreatePattern = async () => {
    if (!newPatternName) return;
    try {
      await createPattern(newPatternName);
      alert("Pattern created successfully!");
      window.location.reload();
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleUpdateName = async () => {
    if (!editPatternName || !selectedPatternId) return;
    try {
      await updatePatternName(selectedPatternId, editPatternName);
      alert("Name updated successfully!");
      window.location.reload();
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleDelete = async () => {
    if (!selectedPatternId) return;
    if (
      confirm(
        "Are you sure? Countries mapped to this pattern will default back to the Default Pattern.",
      )
    ) {
      try {
        await deletePattern(selectedPatternId);
        alert("Pattern deleted successfully!");
        window.location.reload();
      } catch (e: any) {
        alert(e.message);
      }
    }
  };

  const handleSaveSettings = async () => {
    if (!selectedPatternId) return;
    setIsSaving(true);
    try {
      const fallbacks = templates
        .map((t) => t.value)
        .filter((t) => t.trim() !== "");
      await savePatternSettings(
        selectedPatternId,
        fallbacks,
        assignedCountries,
      );
      alert("Settings saved successfully!");
      window.location.reload();
    } catch (e: any) {
      alert("Error: " + e.message);
    } finally {
      setIsSaving(false);
    }
  };

  const getCountryLabel = (code: string) =>
    ISO_COUNTRIES.find((c) => c.value === code)?.label || code;

  const handleAddCountry = () => {
    if (!newCountryInput) return;

    // Check if country is assigned to another pattern in initial data
    const existingMapping = initialCountries.find(
      (c) =>
        c.country_code === newCountryInput &&
        c.pattern_id !== selectedPatternId &&
        c.country_code !== "DEFAULT",
    );
    if (existingMapping) {
      const patternName =
        initialPatterns.find((p) => p.id === existingMapping.pattern_id)
          ?.name || existingMapping.pattern_id;
      alert(
        `Cannot add ${getCountryLabel(newCountryInput)}. It is already mapped to "${patternName}". Please remove it from there first.`,
      );
      setNewCountryInput("");
      return;
    }

    if (!assignedCountries.includes(newCountryInput)) {
      setAssignedCountries([...assignedCountries, newCountryInput]);
      setNewCountryInput("");
    }
  };

  const insertTag = (tag: string) => {
    if (activeInputIndex === null) return;
    const newT = [...templates];
    newT[activeInputIndex].value = newT[activeInputIndex].value + `{${tag}} `;
    setTemplates(newT);
  };

  // Sort patterns so DEFAULT is always first
  const sortedPatterns = [...initialPatterns].sort((a, b) => {
    if (a.id === "PATTERN_WESTERN_DEFAULT") return -1;
    if (b.id === "PATTERN_WESTERN_DEFAULT") return 1;
    return (a.name || "").localeCompare(b.name || "");
  });

  if (isLoadingData) {
    return <div className="p-4 text-center text-muted-foreground">Loading configurations...</div>;
  }

  if (!selectedPattern) return null;

  return (
    <div className="flex flex-col xl:flex-row gap-6 mt-6">
      {/* Sidebar Patterns */}
      <div className="w-full xl:w-1/3 flex flex-col gap-3">
        <div className="border rounded-lg bg-card overflow-hidden">
          <div className="p-4 bg-muted/30 border-b font-semibold flex justify-between items-center">
            Pattern Groups
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                  <IconPlus size={16} />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Pattern</DialogTitle>
                </DialogHeader>
                <div className="flex gap-3 mt-4">
                  <Input
                    value={newPatternName}
                    onChange={(e) => setNewPatternName(e.target.value)}
                    placeholder="Pattern Name"
                  />
                  <Button onClick={handleCreatePattern}>Create</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="flex flex-col">
            {sortedPatterns.map((p) => {
              const isDefault = p.id === "PATTERN_WESTERN_DEFAULT";
              return (
                <button
                  key={p.id}
                  onClick={() => handlePatternChange(p.id)}
                  className={`p-4 text-left hover:bg-muted transition-colors flex justify-between items-center ${selectedPatternId === p.id ? "bg-primary/10 border-l-4 border-primary font-medium" : "border-l-4 border-transparent"}`}
                >
                  <span>{p.name}</span>
                  {isDefault && (
                    <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                      Default
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Editor */}
      <div className="w-full xl:w-2/3 flex flex-col gap-6">
        {/* Header Editor */}
        <div className="flex justify-between items-end border-b pb-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-3">
              {selectedPattern.name}
              <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditPatternName(selectedPattern.name)}
                  >
                    <IconEdit size={18} className="text-muted-foreground" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Pattern Name</DialogTitle>
                  </DialogHeader>
                  <div className="flex gap-3 mt-4">
                    <Input
                      value={editPatternName}
                      onChange={(e) => setEditPatternName(e.target.value)}
                    />
                    <Button onClick={handleUpdateName}>Save</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              ID: {selectedPattern.id}
            </p>
          </div>

          <div className="flex gap-2">
            {selectedPattern.id !== "PATTERN_WESTERN_DEFAULT" && (
              <Button variant="destructive" onClick={handleDelete}>
                <IconTrash size={16} className="mr-2" /> Delete
              </Button>
            )}
            <Button onClick={handleSaveSettings} disabled={isSaving}>
              <IconCheck size={16} className="mr-2" />{" "}
              {isSaving ? "Saving..." : "Save Settings"}
            </Button>
          </div>
        </div>

        {/* Templates Editor */}
        <div className="border rounded-lg bg-card shadow-sm flex flex-col lg:flex-row">
          <div className="w-full lg:w-2/3 p-4 border-r">
            <h2 className="text-lg font-semibold mb-4">Fallback Templates</h2>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={templates}
                strategy={verticalListSortingStrategy}
              >
                <div className="flex flex-col gap-3">
                  {templates.map((t, index) => (
                    <SortableItem
                      key={t.id}
                      id={t.id}
                      value={t.value}
                      onChange={(v: string) => {
                        const newT = [...templates];
                        newT[index].value = v;
                        setTemplates(newT);
                      }}
                      onRemove={() =>
                        setTemplates(templates.filter((_, i) => i !== index))
                      }
                      onFocus={() => setActiveInputIndex(index)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
            <Button
              variant="outline"
              className="w-fit mt-4"
              onClick={() =>
                setTemplates([
                  ...templates,
                  { id: `id-${Math.random()}`, value: "" },
                ])
              }
            >
              <IconPlus size={16} className="mr-2" /> Add Template
            </Button>
          </div>

          {/* Cheat Sheet */}
          <div className="w-full lg:w-1/3 p-4 bg-muted/20">
            <h3 className="font-semibold text-sm mb-3">Google Maps Tags</h3>
            <p className="text-xs text-muted-foreground mb-2">
              Focus an input on the left, then click a tag below to insert it.
            </p>
            <a
              href="https://developers.google.com/maps/documentation/geocoding/requests-geocoding#Types"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-blue-600 hover:underline mb-4 inline-block"
            >
              See Google Maps official explanations &rarr;
            </a>
            <div className="flex flex-wrap gap-1">
              {GOOGLE_ADDRESS_TAGS.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => insertTag(tag.id)}
                  title={tag.label}
                  className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded border hover:bg-primary/20 transition-colors hover:cursor-pointer"
                >
                  {tag.id}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Assigned Countries */}
        {selectedPattern.id !== "PATTERN_WESTERN_DEFAULT" && (
          <div className="border rounded-lg bg-card shadow-sm">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">Assigned Countries</h2>
              <p className="text-sm text-muted-foreground">
                Select a country from the dropdown to map it to this pattern.
              </p>
            </div>
            <div className="p-4">
              <div className="flex flex-wrap gap-2 mb-4">
                {assignedCountries.map((code) => (
                  <div
                    key={code}
                    className="flex items-center bg-blue-100 text-blue-800 border border-blue-200 rounded-md px-3 py-1 text-sm font-medium"
                  >
                    {getCountryLabel(code)} ({code})
                    <button
                      onClick={() =>
                        setAssignedCountries(
                          assignedCountries.filter((c) => c !== code),
                        )
                      }
                      className="ml-2 text-blue-500 hover:text-blue-900"
                    >
                      <IconX size={14} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Select
                  value={newCountryInput}
                  onValueChange={setNewCountryInput}
                >
                  <SelectTrigger className="w-[300px]">
                    <SelectValue placeholder="Select Country..." />
                  </SelectTrigger>
                  <SelectContent>
                    {ISO_COUNTRIES.filter(
                      (c) => !assignedCountries.includes(c.value),
                    ).map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={handleAddCountry} variant="secondary">
                  Add Country
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
