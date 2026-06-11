export type PageHeaderBandValue = {
  _type: 'pageHeaderBand'
  _key: string
  heading: string
  body?: string
}

// Verbatim from the home-equity-estimator page header. The source page wraps
// everything in one `bg-gray-50` container with py-8 and gives the header
// mb-8; split into standalone bands, that becomes pt-8 + pb-8 here so the
// assembled page keeps identical spacing.
export function PageHeaderBandSection({ value }: { value: PageHeaderBandValue }) {
  return (
    <div className="bg-gray-50">
      <div className="container mx-auto px-4 pt-8 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">{value.heading}</h1>
            {value.body && <p className="text-lg text-gray-600 max-w-3xl mx-auto">{value.body}</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
