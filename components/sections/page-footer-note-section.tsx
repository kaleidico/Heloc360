import Link from 'next/link'

export type PageFooterNoteValue = {
  _type: 'pageFooterNote'
  _key: string
  text?: string
  showReturnHome?: boolean
}

export function PageFooterNoteSection({ value }: { value: PageFooterNoteValue }) {
  const showReturnHome = value.showReturnHome !== false
  return (
    <div className="text-center mt-12 pt-8 border-t border-gray-200">
      {value.text && <p className="text-sm text-gray-600">{value.text}</p>}
      {showReturnHome && (
        <p className="text-sm text-gray-600 mt-2">
          <Link href="/" className="text-[#1a71b6] hover:text-[#007a5e] transition-colors">
            Return to Home
          </Link>
        </p>
      )}
    </div>
  )
}
