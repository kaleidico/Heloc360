"use client"

import { useCallback } from "react"
import { Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

type ShareButtonProps = {
  title: string
  url: string
  text?: string
  className?: string
}

export default function ShareButton({ title, url, text, className }: ShareButtonProps) {
  const onShare = useCallback(async () => {
    try {
      const shareData = { title, text: text || title, url }

      if (typeof navigator !== "undefined" && (navigator as any).share) {
        await (navigator as any).share(shareData)
        toast.success("Shared successfully")
        return
      }

      await navigator.clipboard.writeText(url)
      toast.success("Link copied to clipboard")
    } catch (err) {
      try {
        await navigator.clipboard.writeText(url)
        toast.success("Link copied to clipboard")
      } catch {
        toast.error("Unable to share. Please copy the URL from the address bar.")
      }
    }
  }, [title, url, text])

  return (
    <Button variant="outline" size="sm" className={className} onClick={onShare} aria-label="Share this article">
      <Share2 className="w-4 h-4 mr-2" />
      Share
    </Button>
  )
}


