"use client";

import React from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useI18n } from "@/i18n/I18nProvider";

export default function UnitSystemToggle({ className }: { className?: string }) {
  const { dict, unitSystem, setUnitSystem } = useI18n();

  return (
    <div className={className}>
      <ToggleGroup
        type="single"
        value={unitSystem}
        onValueChange={(v) => {
          if (v === "metric" || v === "imperial") setUnitSystem(v);
        }}
        aria-label={dict.common.unitSystem}
        className="inline-flex bg-gray-100 dark:bg-gray-800 p-1 rounded-md"
      >
        <ToggleGroupItem 
          value="metric" 
          className="h-7 px-3 text-xs font-medium data-[state=on]:bg-white dark:data-[state=on]:bg-gray-700 data-[state=on]:text-gray-900 dark:data-[state=on]:text-white data-[state=on]:shadow-sm transition-all"
        >
          {dict.common.unitSystemMetric}
        </ToggleGroupItem>
        <ToggleGroupItem 
          value="imperial" 
          className="h-7 px-3 text-xs font-medium data-[state=on]:bg-white dark:data-[state=on]:bg-gray-700 data-[state=on]:text-gray-900 dark:data-[state=on]:text-white data-[state=on]:shadow-sm transition-all"
        >
          {dict.common.unitSystemImperial}
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}

