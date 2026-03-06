"use client";

import { useCallback, useEffect, useState } from "react";

import { Button } from "@uiid/buttons";
import { Input } from "@uiid/forms";
import { Select } from "@uiid/forms";
import { Switch } from "@uiid/forms";
import { Field } from "@uiid/forms";
import {
  ChevronUpIcon,
  ChevronDownIcon,
  PlusIcon,
  Trash2Icon,
} from "@uiid/icons";
import { Stack, Group } from "@uiid/layout";
import { Badge } from "@uiid/indicators";
import { Text } from "@uiid/typography";

import type { BlocksConfig, SourceEntry } from "@/lib/sources";

import styles from "./source-settings.module.css";

export const SourceSettings = () => {
  const [config, setConfig] = useState<BlocksConfig | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchConfig = useCallback(async () => {
    try {
      const res = await fetch("/api/config");
      if (res.ok) {
        const data = await res.json();
        setConfig(data);
      }
    } catch {
      setError("Failed to load configuration");
    }
  }, []);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  const saveConfig = async (updated: BlocksConfig) => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      if (res.ok) {
        const data = await res.json();
        setConfig(data);
      } else {
        const err = await res.json();
        setError(err.error || "Failed to save");
      }
    } catch {
      setError("Failed to save configuration");
    } finally {
      setSaving(false);
    }
  };

  const updateSource = (index: number, updates: Partial<SourceEntry>) => {
    if (!config) return;
    const sources = config.sources.map((s, i) =>
      i === index ? { ...s, ...updates } : s,
    );
    const updated = { ...config, sources };
    setConfig(updated);
    saveConfig(updated);
  };

  const addSource = () => {
    if (!config) return;
    const newSource: SourceEntry = {
      type: "local",
      path: "./blocks",
      label: "New Source",
      mode: "read-write",
      enabled: true,
    };
    const updated = { ...config, sources: [...config.sources, newSource] };
    setConfig(updated);
    saveConfig(updated);
  };

  const removeSource = (index: number) => {
    if (!config) return;
    const updated = {
      ...config,
      sources: config.sources.filter((_, i) => i !== index),
    };
    setConfig(updated);
    saveConfig(updated);
  };

  const moveSource = (index: number, direction: "up" | "down") => {
    if (!config) return;
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= config.sources.length) return;
    const sources = [...config.sources];
    [sources[index], sources[newIndex]] = [sources[newIndex], sources[index]];
    const updated = { ...config, sources };
    setConfig(updated);
    saveConfig(updated);
  };

  if (!config) {
    return (
      <Stack ax="center" ay="center" fullheight fullwidth>
        <Text shade="muted">Loading configuration...</Text>
      </Stack>
    );
  }

  return (
    <Stack
      ax="center"
      fullwidth
      fullheight
      p={8}
      gap={8}
      className={styles.page}
    >
      <Stack gap={4} fullwidth maxw={768}>
        <Text size={4} weight="bold">
          Settings
        </Text>
        <Text shade="muted">
          Configure where blocks are loaded from and saved to. Sources are
          checked in order — the first source with a matching block wins.
        </Text>
      </Stack>

      {error && (
        <Stack fullwidth maxw={768}>
          <Badge tone="critical">{error}</Badge>
        </Stack>
      )}

      <Stack gap={4} fullwidth maxw={768}>
        {config.sources.map((source, index) => (
          <SourceCard
            key={index}
            source={source}
            index={index}
            total={config.sources.length}
            onUpdate={(updates) => updateSource(index, updates)}
            onRemove={() => removeSource(index)}
            onMove={(dir) => moveSource(index, dir)}
            saving={saving}
          />
        ))}

        <Button onClick={addSource} variant="outlined" size="small">
          <PlusIcon />
          Add Source
        </Button>
      </Stack>
    </Stack>
  );
};
SourceSettings.displayName = "SourceSettings";

type SourceCardProps = {
  source: SourceEntry;
  index: number;
  total: number;
  onUpdate: (updates: Partial<SourceEntry>) => void;
  onRemove: () => void;
  onMove: (direction: "up" | "down") => void;
  saving: boolean;
};

const SourceCard = ({
  source,
  index,
  total,
  onUpdate,
  onRemove,
  onMove,
  saving,
}: SourceCardProps) => {
  const isBundled = source.type === "bundled";

  return (
    <Stack className={styles.card} gap={4} p={6} b={1} radius={2}>
      <Group ay="center" ax="space-between">
        <Group gap={2} ay="center">
          <Text weight="bold">{source.label}</Text>
          <Badge size="small">{source.type}</Badge>
          <Badge size="small">{source.mode}</Badge>
        </Group>
        <Group gap={1}>
          <Button
            onClick={() => onMove("up")}
            disabled={index === 0 || saving}
            variant="ghost"
            size="small"
            tooltip="Move up (higher priority)"
            aria-label={`Move ${source.label} up`}
          >
            <ChevronUpIcon />
          </Button>
          <Button
            onClick={() => onMove("down")}
            disabled={index === total - 1 || saving}
            variant="ghost"
            size="small"
            tooltip="Move down (lower priority)"
            aria-label={`Move ${source.label} down`}
          >
            <ChevronDownIcon />
          </Button>
        </Group>
      </Group>

      <Group gap={4} ay="end">
        <Field label="Label" style={{ flex: 1 }}>
          <Input
            value={source.label}
            onChange={(e) => onUpdate({ label: e.target.value })}
            disabled={saving}
          />
        </Field>

        {!isBundled && (
          <Field label="Type">
            <Select
              value={source.type}
              onValueChange={(val) =>
                onUpdate({ type: val as SourceEntry["type"] })
              }
              disabled={saving}
            >
              <option value="local">Local</option>
              <option value="url">URL</option>
            </Select>
          </Field>
        )}

        {!isBundled && source.type === "local" && (
          <Field label="Path" style={{ flex: 1 }}>
            <Input
              value={source.path ?? ""}
              onChange={(e) => onUpdate({ path: e.target.value })}
              placeholder="./blocks"
              disabled={saving}
            />
          </Field>
        )}
      </Group>

      <Group ay="center" ax="space-between">
        <Group gap={4} ay="center">
          <Switch
            label="Enabled"
            checked={source.enabled}
            onCheckedChange={(checked) => onUpdate({ enabled: checked })}
            disabled={saving}
          />
          {!isBundled && (
            <Switch
              label="Writable"
              checked={source.mode === "read-write"}
              onCheckedChange={(checked) =>
                onUpdate({ mode: checked ? "read-write" : "read" })
              }
              disabled={saving}
            />
          )}
        </Group>

        {!isBundled && (
          <Button
            onClick={onRemove}
            variant="ghost"
            size="small"
            tone="critical"
            disabled={saving}
            tooltip="Remove source"
            aria-label={`Remove ${source.label}`}
          >
            <Trash2Icon />
          </Button>
        )}
      </Group>
    </Stack>
  );
};
SourceCard.displayName = "SourceCard";
