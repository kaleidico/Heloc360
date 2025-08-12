"use client"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface BlogSearchProps {
  searchTerm: string
  selectedCategory: string
  selectedTag: string
  onSearchChange: (term: string) => void
  onCategoryChange: (category: string) => void
  onTagChange: (tag: string) => void
  onClearFilters: () => void
  availableTags: string[]
  categories?: { id: string; name: string }[]
}

export default function BlogSearch({
  searchTerm,
  selectedCategory,
  selectedTag,
  onSearchChange,
  onCategoryChange,
  onTagChange,
  onClearFilters,
  availableTags,
  categories,
}: BlogSearchProps) {
  const hasActiveFilters = searchTerm || selectedCategory || selectedTag
  const activeFilterCount = [searchTerm, selectedCategory, selectedTag].filter(Boolean).length
  const categoryList = categories || []

  return (
    <div className="mb-8">
      {/* Main Search and Filter Bar */}
      <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center bg-white border border-gray-200 rounded-lg p-4">
        {/* Search Input */}
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 border-0 shadow-none focus-visible:ring-0 bg-gray-50"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 lg:gap-2">
          {/* Category Filter */}
          <Select value={selectedCategory || 'all'} onValueChange={onCategoryChange}>
            <SelectTrigger className="w-full sm:w-[180px] border-gray-200">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categoryList.map((category) => (
                <SelectItem key={category.id} value={category.name}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Tag Filter */}
          <Select value={selectedTag || 'all'} onValueChange={onTagChange}>
            <SelectTrigger className="w-full sm:w-[140px] border-gray-200">
              <SelectValue placeholder="Tag" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tags</SelectItem>
              {availableTags.map((tag) => (
                <SelectItem key={tag} value={tag}>
                  {tag}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-gray-600 hover:text-gray-800 px-3"
            >
              Clear
              {activeFilterCount > 1 && (
                <span className="ml-1 bg-gray-200 text-gray-700 rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {activeFilterCount}
                </span>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Active Filters Pills */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mt-3">
          {searchTerm && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#1b75bc] text-white rounded-full text-sm">
              "{searchTerm}"
              <button
                onClick={() => onSearchChange("")}
                className="ml-1 hover:bg-white/20 rounded-full p-0.5 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {selectedCategory && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#02c39a] text-white rounded-full text-sm">
              {selectedCategory}
              <button
                onClick={() => onCategoryChange("")}
                className="ml-1 hover:bg-white/20 rounded-full p-0.5 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {selectedTag && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-500 text-white rounded-full text-sm">
              {selectedTag}
              <button
                onClick={() => onTagChange("")}
                className="ml-1 hover:bg-white/20 rounded-full p-0.5 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  )
}
