# Standard Designs Navigator

A decision-support prototype that helps NZ schools navigate Ministry of Education
standard building designs — see [docs/PROJECT_PLAN.md](docs/PROJECT_PLAN.md) for the
full data model, user journey, matching logic, and provenance rules this app follows.

**This is not an official Ministry of Education product.** See the in-app disclaimer.

## Requirements

- Ruby 3.3 (installed via RubyInstaller+DevKit on this machine — `ruby -v` to check)
- No Node.js needed — CSS is built by the `tailwindcss-rails` gem's standalone binary.

## Running locally

```powershell
# one-time setup (installs gems, creates + migrates + seeds the sqlite db)
bundle install
ruby bin/rails db:prepare
ruby bin/rails db:seed

# day-to-day: runs the Rails server + Tailwind watcher together
foreman start -f Procfile.dev
```

Then open http://localhost:3000.

If `ruby`/`bundle`/`foreman` aren't found in a fresh terminal, it's because PATH was
updated by the installer after that terminal opened — open a new terminal window (or
`refreshenv` if using Chocolatey) and it'll resolve.

**Windows-specific note:** always invoke Rails as `ruby bin\rails ...`, not `bin\rails
...` on its own — the extensionless script silently no-ops when run directly from
PowerShell on this setup.

## Data

Ministry standard-design data lives in `db/data/*.yml`, loaded by `db/seeds.rb`, and is
kept completely separate from the application code (models/controllers/views) so it can
be corrected or expanded without touching the app itself. Every record carries a
`status` (`prototype_placeholder` vs `verified`) and cites its `Source` — see the
provenance rules in `docs/PROJECT_PLAN.md` before adding anything not confirmed by a
supplied Ministry PDF.

Drop Ministry PDFs in `docs/source-pdfs/` when you have them.

## Git

A local git repo has been initialized but nothing is committed yet — review `git status`
and make the first commit when ready.
