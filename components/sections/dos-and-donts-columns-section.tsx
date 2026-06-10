import { CheckCircle, AlertTriangle } from 'lucide-react'

type ColumnItem = { _key: string; title: string; body: string }

export type DosAndDontsColumnsValue = {
  _type: 'dosAndDontsColumns'
  _key: string
  anchorId?: string
  heading: string
  dosHeading?: string
  dos?: ColumnItem[]
  dontsHeading?: string
  donts?: ColumnItem[]
}

// Full-width white band, constrained max-w-4xl, with two columns: a "smart uses"
// column (green CheckCircle, blue heading) and an "avoid" column (red
// AlertTriangle, red heading). Each item is an icon + bold title + small body.
// Reproduces the heloc-101 "Common Uses for HELOCs" section.
export function DosAndDontsColumnsSection({ value }: { value: DosAndDontsColumnsValue }) {
  return (
    <section id={value.anchorId} className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-[#1b75bc] mb-8">{value.heading}</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              {value.dosHeading && (
                <h3 className="text-xl font-semibold text-[#1b75bc] mb-4">{value.dosHeading}</h3>
              )}
              <div className="space-y-4">
                {(value.dos || []).map((item) => (
                  <div key={item._key} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#02c39a] mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">{item.title}</h4>
                      <p className="text-gray-600 text-sm">{item.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              {value.dontsHeading && (
                <h3 className="text-xl font-semibold text-red-600 mb-4">{value.dontsHeading}</h3>
              )}
              <div className="space-y-4">
                {(value.donts || []).map((item) => (
                  <div key={item._key} className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">{item.title}</h4>
                      <p className="text-gray-600 text-sm">{item.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
