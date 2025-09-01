"use client";

import { useId, useMemo } from "react";
import { Input } from "../input/input";
import type { InputRangeProps } from "./input-range.types";

export const InputRange = ({ 
  tickMarks, 
  min = 0, 
  max = 100, 
  step = 1, 
  ...props 
}: InputRangeProps) => {
  const datalistId = useId();
  
  const generatedTickMarks = useMemo(() => {
    if (!tickMarks) return [];
    
    const marks = [];
    const range = max - min;
    const stepCount = Math.floor(range / step);
    
    // Generate tick marks at regular intervals
    // Limit to reasonable number of ticks (max 20)
    const maxTicks = 20;
    const tickInterval = Math.max(1, Math.ceil(stepCount / maxTicks));
    
    for (let i = 0; i <= stepCount; i += tickInterval) {
      const value = min + (i * step);
      if (value <= max) {
        marks.push({ value, label: value.toString() });
      }
    }
    
    // Always include the max value if it's not already included
    if (marks.length > 0 && marks[marks.length - 1].value !== max) {
      marks.push({ value: max, label: max.toString() });
    }
    
    return marks;
  }, [tickMarks, min, max, step]);

  return (
    <>
      <Input 
        {...props} 
        type="range" 
        min={min}
        max={max}
        step={step}
        list={generatedTickMarks.length > 0 ? datalistId : undefined}
      />
      {generatedTickMarks.length > 0 && (
        <datalist id={datalistId}>
          {generatedTickMarks.map((tick) => (
            <option 
              key={tick.value} 
              value={tick.value} 
              label={tick.label}
            />
          ))}
        </datalist>
      )}
    </>
  );
};
InputRange.displayName = "InputRange";
