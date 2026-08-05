import { iconSize, Search, X } from "@atlure/icons";
import { Pressable } from "react-native";

import { touchTargetHitSlop } from "../../lib/touch-target";
import { searchBarIconClassName } from "../../variants/search-bar-variants";
import { Input, type InputProps } from "../input/input";
import { useDebouncedCallback } from "./hooks/use-debounced-callback";

export interface SearchBarProps
  extends Omit<InputProps, "leadingIcon" | "trailingIcon" | "isMultiline" | "value"> {
  value: string;
  onChangeText: (value: string) => void;
  onChangeDebounced?: (value: string) => void;
  debounceMs?: number;
  clearAccessibilityLabel: string;
}

export function SearchBar({
  value,
  onChangeText,
  onChangeDebounced,
  debounceMs = 300,
  clearAccessibilityLabel,
  ...inputProps
}: SearchBarProps) {
  const { schedule, flush } = useDebouncedCallback(onChangeDebounced, debounceMs);

  const handleChangeText = (nextValue: string) => {
    onChangeText(nextValue);
    schedule(nextValue);
  };

  const handleClear = () => {
    onChangeText("");
    flush("");
  };

  return (
    <Input
      value={value}
      onChangeText={handleChangeText}
      returnKeyType="search"
      clearButtonMode="never"
      leadingIcon={<Search size={iconSize.md} className={searchBarIconClassName} />}
      trailingIcon={
        value.length > 0 ? (
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
