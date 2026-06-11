export type InfoSplitCardValue = {
  _type: 'infoSplitCard'
  _key: string
  heading?: string
  topics?: { _key?: string; heading?: string; body?: string }[]
  listHeading?: string
  bullets?: string[]
}

// Verbatim from the home-equity-estimator "Understanding Home Equity" card.
// The source gives the card mt-12 inside the shared page container; as a
// standalone band that becomes container pt-12. All topic paragraphs except
// the last carry mb-4, matching the source stack.
export function InfoSplitCardSection({ value }: { value: InfoSplitCardValue }) {
  const topics = value.topics ?? []
  const bullets = value.bullets ?? []
  return (
    <div className="bg-gray-50">
      <div className="container mx-auto px-4 pt-12">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-6">
            {value.heading && <h2 className="text-2xl font-bold text-gray-900 mb-4">{value.heading}</h2>}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                {topics.map((topic, i) => (
                  <div key={topic._key ?? i}>
                    {topic.heading && (
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{topic.heading}</h3>
                    )}
                    {topic.body && (
                      <p className={i < topics.length - 1 ? 'text-gray-600 mb-4' : 'text-gray-600'}>
                        {topic.body}
                      </p>
                    )}
                  </div>
                ))}
              </div>
              <div>
                {value.listHeading && (
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{value.listHeading}</h3>
                )}
                {bullets.length > 0 && (
                  <ul className="text-gray-600 space-y-2">
                    {bullets.map((bullet, i) => (
                      <li key={i}>• {bullet}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
