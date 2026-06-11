export type LabeledDisclaimersValue = {
  _type: 'labeledDisclaimers'
  _key: string
  variant?: 'yellowCard' | 'grayBand'
  heading?: string
  items?: { _key?: string; label?: string; body?: string }[]
}

// Two verbatim disclaimer treatments from the calculator pages. The trailing
// colon after each bold label is rendered here, not stored in content.
export function LabeledDisclaimersSection({ value }: { value: LabeledDisclaimersValue }) {
  const items = value.items ?? []

  if (value.variant === 'grayBand') {
    // Verbatim from the debt-consolidation disclaimer section.
    return (
      <section className="bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {value.heading && <h2 className="text-2xl font-bold mb-6 text-center">{value.heading}</h2>}
            <div className="bg-white rounded-lg p-8 shadow-sm">
              <div className="prose max-w-none">
                {items.map((item, i) => (
                  <p
                    key={item._key ?? i}
                    className={i < items.length - 1 ? 'text-sm text-gray-600 mb-4' : 'text-sm text-gray-600'}
                  >
                    {item.label && <strong>{item.label}:</strong>} {item.body}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  // Verbatim from the home-equity-estimator disclaimer card. The source gives
  // the card mt-8 inside the shared py-8 page container; as a standalone band
  // that becomes container pt-8 + pb-8.
  return (
    <div className="bg-gray-50">
      <div className="container mx-auto px-4 pt-8 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            {value.heading && <h3 className="text-lg font-semibold text-yellow-800 mb-2">{value.heading}</h3>}
            <div className="text-sm text-yellow-700 space-y-2">
              {items.map((item, i) => (
                <p key={item._key ?? i}>
                  {item.label && <strong>{item.label}:</strong>} {item.body}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
