"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DEFAULT_WHATSAPP_DIAL,
  WHATSAPP_DIAL_OPTIONS,
} from "@/lib/whatsapp-countries";
import { cn } from "@/lib/utils";

type Props = {
  dial: string;
  local: string;
  onDialChange: (dial: string) => void;
  onLocalChange: (local: string) => void;
  disabled?: boolean;
  idPrefix?: string;
  /** Smaller padding for dense layouts */
  compact?: boolean;
};

export function WhatsAppPhoneFields({
  dial,
  local,
  onDialChange,
  onLocalChange,
  disabled,
  idPrefix = "wa",
  compact,
}: Props) {
  const selId = `${idPrefix}-country`;
  const localId = `${idPrefix}-local`;

  return (
    <div className="space-y-2">
      <div>
        <Label
          htmlFor={selId}
          className={cn(
            "text-sm font-semibold text-foreground",
            compact && "text-xs"
          )}
        >
          WhatsApp Number{" "}
          <span className="font-normal text-muted-foreground">(Ikhtiyaari)</span>
        </Label>
        <p className="text-xs text-muted-foreground mt-0.5 mb-2">
          So we can reach you on WhatsApp
        </p>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
        <Select
          value={dial || DEFAULT_WHATSAPP_DIAL}
          onValueChange={onDialChange}
          disabled={disabled}
        >
          <SelectTrigger
            id={selId}
            className={cn(
              "w-full sm:w-[200px] rounded-xl border-border/80 bg-muted/40 dark:bg-slate-800/60",
              compact && "h-10"
            )}
          >
            <SelectValue placeholder="Country" />
          </SelectTrigger>
          <SelectContent>
            {WHATSAPP_DIAL_OPTIONS.map((o) => (
              <SelectItem key={o.dial} value={o.dial}>
                {o.label} ({o.dial})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          id={localId}
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          placeholder="61 XXX XXXX"
          value={local}
          onChange={(e) => onLocalChange(e.target.value)}
          disabled={disabled}
          className={cn(
            "flex-1 rounded-xl border-border/80 bg-muted/40 px-4 text-base dark:bg-slate-800/60",
            compact && "h-10 text-sm"
          )}
        />
      </div>
    </div>
  );
}
