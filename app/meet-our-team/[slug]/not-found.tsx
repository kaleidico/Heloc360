import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-[#1b75bc] mb-4">Team Member Not Found</h1>
        <p className="text-gray-600 mb-8">Sorry, we couldn't find the team member you're looking for.</p>
        <div className="space-x-4">
          <Button asChild>
            <Link href="/about#team">View All Team Members</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">Go Home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
