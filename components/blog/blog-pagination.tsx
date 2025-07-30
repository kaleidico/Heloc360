"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BlogPaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function BlogPagination({ currentPage, totalPages, onPageChange }: BlogPaginationProps) {
  const getPageNumbers = () => {
    const pages = []
    const showPages = 5 // Number of page buttons to show

    let startPage = Math.max(1, currentPage - Math.floor(showPages / 2))
    const endPage = Math.min(totalPages, startPage + showPages - 1)

    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < showPages) {
      startPage = Math.max(1, endPage - showPages + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    return pages
  }

  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center space-x-2 mt-12">
      {/* Previous Button */}
      <Button
        variant="outline"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-2"
      >
        <ChevronLeft className="w-4 h-4" />
        Previous
      </Button>

      {/* First Page */}
      {getPageNumbers()[0] > 1 && (
        <>
          <Button
            variant={1 === currentPage ? "default" : "outline"}
            onClick={() => onPageChange(1)}
            className={1 === currentPage ? "bg-[#1b75bc] hover:bg-[#1b75bc]/90" : ""}
          >
            1
          </Button>
          {getPageNumbers()[0] > 2 && <span className="px-2 text-gray-500">...</span>}
        </>
      )}

      {/* Page Numbers */}
      {getPageNumbers().map((page) => (
        <Button
          key={page}
          variant={page === currentPage ? "default" : "outline"}
          onClick={() => onPageChange(page)}
          className={page === currentPage ? "bg-[#1b75bc] hover:bg-[#1b75bc]/90" : ""}
        >
          {page}
        </Button>
      ))}

      {/* Last Page */}
      {getPageNumbers()[getPageNumbers().length - 1] < totalPages && (
        <>
          {getPageNumbers()[getPageNumbers().length - 1] < totalPages - 1 && (
            <span className="px-2 text-gray-500">...</span>
          )}
          <Button
            variant={totalPages === currentPage ? "default" : "outline"}
            onClick={() => onPageChange(totalPages)}
            className={totalPages === currentPage ? "bg-[#1b75bc] hover:bg-[#1b75bc]/90" : ""}
          >
            {totalPages}
          </Button>
        </>
      )}

      {/* Next Button */}
      <Button
        variant="outline"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center gap-2"
      >
        Next
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  )
}
