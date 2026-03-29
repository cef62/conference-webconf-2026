import { useEffect, useState } from "react"
import { Input } from "@chakra-ui/react"
import { useDebouncedValue } from "../hooks/useDebouncedValue"

interface SearchFilterProps {
  onSearch: (query: string) => void
  debounceMs?: number
}

export function SearchFilter({ onSearch, debounceMs = 300 }: SearchFilterProps) {
  const [rawValue, setRawValue] = useState("")
  const debouncedValue = useDebouncedValue(rawValue, debounceMs)

  useEffect(() => {
    onSearch(debouncedValue)
  }, [debouncedValue, onSearch])

  return (
    <Input
      data-testid="search-filter-input"
      placeholder="Search tickets..."
      value={rawValue}
      onChange={(e) => setRawValue(e.target.value)}
    />
  )
}
