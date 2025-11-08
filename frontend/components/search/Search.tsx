'use client'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function Search() {
  return (
    <div className="flex w-full max-w-sm items-center space-x-2">
      <Input type="text" placeholder="Enter Product Name" />
      <Button type="submit">Search</Button>
    </div>
  )
}

