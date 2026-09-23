# Claude Design v2 (24 Sep 2026): merge base

The design that's live, as exported from Claude Design, before any catalogue wiring:

- `export.html`: the standalone export. Run `rails "design:import[docs/design-imports/v2/export.html]"`
  to unpack it into `docs/design-imports/latest/`.
- `School Building Selector.dc.html`, `moe-data.js`, `moe-rules.js`: the project source.
- `HANDOFF.html`: the designer's handoff note and changelog.

When a new export arrives, three-way merge it: base = this version, mine =
`app/views/selector/show.html.erb`, theirs = the new export. That brings in the design's
changes unaltered and keeps the catalogue wiring layered on top.
