import Image from 'next/image'
import Link from 'next/link'
import { Users } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getAllTeamMembers, type TeamMember } from '@/lib/sanity/api'

export type TeamSectionValue = {
  _type: 'teamSection'
  _key: string
  anchorId?: string
  heading: string
  subheading?: string
  leadershipHeading?: string
  contributorsHeading?: string
  leadershipRoles?: string[]
  emptyHeading?: string
  emptyBody?: string
}

const DEFAULT_ROLES = ['ceo', 'founder', 'content studio director', 'senior account manager']

function MemberCard({ member }: { member: TeamMember }) {
  return (
    <Link
      key={member.id}
      href={`/meet-our-team/${member.slug}`}
      aria-label={`Learn more about ${member.name}`}
    >
      <Card className="text-center hover:shadow-lg transition-all duration-200 cursor-pointer group h-full flex flex-col">
        <CardHeader className="flex-shrink-0">
          <div className="relative w-32 h-32 mx-auto mb-4">
            <Image
              src={member.image || '/placeholder.svg'}
              alt={`${member.name} - ${member.title || 'Team Member'}`}
              fill
              className="rounded-full object-cover group-hover:scale-105 transition-transform duration-200"
              sizes="128px"
              loading="lazy"
              quality={70}
            />
          </div>
          <CardTitle className="text-xl text-[#1b75bc] group-hover:text-[#007a5e] transition-colors h-14 flex items-center justify-center">
            {member.name}
          </CardTitle>
          <p className="text-[#007a5e] font-medium h-6 flex items-center justify-center">{member.title}</p>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-between pt-0">
          <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-4">{member.bio}</p>
          <div className="inline-flex items-center text-[#1b75bc] group-hover:text-[#007a5e] transition-colors text-sm font-medium justify-center">
            <Users className="w-4 h-4 mr-2" />
            Learn More
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

// Verbatim reproduction of the about page "Meet the Team" section. Fetches team
// members at render time (async server component) and splits them into Leadership
// and Contributors using the configured role keywords.
export async function TeamSection({ value }: { value: TeamSectionValue }) {
  const teamMembers = await getAllTeamMembers()
  const roles = value.leadershipRoles && value.leadershipRoles.length > 0 ? value.leadershipRoles : DEFAULT_ROLES

  const isLeader = (member: TeamMember) =>
    roles.some((role) => member.title?.toLowerCase().includes(role))

  const leaders = teamMembers
    .filter(isLeader)
    .sort((a, b) => {
      const aIndex = roles.findIndex((role) => a.title?.toLowerCase().includes(role))
      const bIndex = roles.findIndex((role) => b.title?.toLowerCase().includes(role))
      return aIndex - bIndex
    })
  const contributors = teamMembers.filter((member) => !isLeader(member))

  return (
    <section id={value.anchorId || 'team'} className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1b75bc] mb-4">{value.heading}</h2>
            {value.subheading && <p className="text-lg text-gray-600">{value.subheading}</p>}
          </div>

          {teamMembers.length > 0 ? (
            <div>
              <div className="mb-12">
                <h3 className="text-2xl font-bold text-[#1b75bc] mb-8 text-center">
                  {value.leadershipHeading || 'Leadership & Management'}
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {leaders.map((member) => (
                    <MemberCard key={member.id} member={member} />
                  ))}
                </div>
              </div>

              {contributors.length > 0 && (
                <div>
                  <h3 className="text-2xl font-bold text-[#1b75bc] mb-8 text-center">
                    {value.contributorsHeading || 'Contributors'}
                  </h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {contributors.map((member) => (
                      <MemberCard key={member.id} member={member} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-4">
                <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {value.emptyHeading || 'Team information coming soon'}
              </h3>
              <p className="text-gray-600 mb-6">
                {value.emptyBody ||
                  "We're currently setting up our team profiles. Check back soon to meet our experts."}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
