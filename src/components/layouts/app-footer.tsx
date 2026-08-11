import {
  LOGO_SRC,
  TEAM_MEMBERS,
  UNIVERSITY_SHORT,
} from '@/lib/project-info'

const AppFooter = () => {
  return (
    <footer className="border-border bg-card mt-auto border-t">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 md:flex-row md:items-center md:justify-between md:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <img
            src={LOGO_SRC}
            alt={`Logo ${UNIVERSITY_SHORT}`}
            className="h-12 w-auto object-contain md:h-14"
          />

        </div>

        <div className="md:text-right">
          <p className="text-foreground text-xs font-semibold tracking-wide uppercase">
            Equipo del proyecto
          </p>
          <ul className="text-muted-foreground mt-2 flex flex-wrap gap-x-3 gap-y-1 text-sm md:justify-end">
            {TEAM_MEMBERS.map((member) => (
              <li key={member}>{member}</li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}

export default AppFooter
