import { iconSize, Search, X } from "@atlure/icons";
import { useState } from "react";
import { Pressable } from "react-native";

import { touchTargetHitSlop } from "../../lib/touch-target";
import { searchBarIconClassName } from "../../variants/search-bar-variants";
import { Input, type InputProps } from "../input/input";
import { useDebouncedCallback } from "./hooks/use-debounced-callback";

export interface SearchBarProps
  extends Omit<InputProps, "leadingIcon" | "trailingIcon" | "isMultiline" | "value"> {
  value?: string;
  defaultValue?: string;
  onChangeText?: (value: string) => void;
  onChangeDebounced?: (value: string) => void;
  onCommit?: (value: string) => void;
  debounceMs?: number;
  clearAccessibilityLabel: string;
}

export function SearchBar({
  value,
  defaultValue,
  onChangeText,
  onChangeDebounced,
  onCommit,
  debounceMs = 300,
  clearAccessibilityLabel,
  ...inputProps
}: SearchBarProps) {
  const isUncontrolled = defaultValue !== undefined;
  const [draft, setDraft] = useState(defaultValue ?? "");
  const currentValue = isUncontrolled ? draft : (value ?? "");

  const debouncedTarget = isUncontrolled ? onCommit : onChangeDebounced;
  const { schedule, flush } = useDebouncedCallback(debouncedTarget, debounceMs);

  const handleChangeText = (nextValue: string) => {
    if (isUncontrolled) {
      setDraft(nextValue);
    }
    onChangeText?.(nextValue);
    schedule(nextValue);
  };

  const handleClear = () => {
    if (isUncontrolled) {
      setDraft("");
    }
    onChangeText?.("");
    flush("");
  };

  return (
    <Input
      value={currentValue}
      onChangeText={handleChangeText}
      returnKeyType="search"
      clearButtonMode="never"
      leadingIcon={<Search size={iconSize.md} className={searchBarIconClassName} />}
      trailingIcon={
        currentValue.length > 0 ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={clearAccessibilityLabel}
            hitSlop={touchTargetHitSlop("icon")}
            onPress={handleClear}
          >
            <X size={iconSize.md} className={searchBarIconClassName} />
          </Pressable>
        ) : undefined
      }
      {...inputProps}
    />
  );
}
