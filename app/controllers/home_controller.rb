class HomeController < ApplicationController
  # Copy lifted verbatim from the supplied design (docs/design-imports/). Treat as
  # design content — if the design file changes, re-sync these rather than editing
  # them here.
  NAV_TABS = [
    { reo: "Mō tēnei", label: "About", action: :panel, panel: "about" },
    { reo: "Ngā hoahoa", label: "Diagrams", action: :panel, panel: "diagrams" },
    { reo: "Te Tāhuhu o te Mātauranga", label: "Ministry of Education", action: :external, href: "https://www.education.govt.nz/" },
    { reo: "Whakapā mai", label: "Contact", action: :panel, panel: "contact" },
    { reo: "Hākoritanga", label: "Animation", action: :replay }
  ].freeze

  PANELS = {
    "about" => {
      title: "About this tool",
      blocks: [
        { label: "Purpose", text: "A selector for the Ministry of Education standard designs for primary and intermediate schools. Answer five questions about the school and the tool returns the standard configurations that meet the requirement." },
        { label: "Catalogue", text: "Standard designs for primary and intermediate schools, Version 1.0, June 2026. Every building is composed from standard modules on a 7.2 m × 12.0 m bay." },
        { label: "Status", text: "An indicative planning tool. Provision, site fit and technical requirements must be confirmed with your Ministry property advisor and project team." }
      ]
    },
    "diagrams" => {
      title: "Standard diagrams",
      blocks: [
        { label: "Teaching modules", text: "A1.p teaching space, 7.2 m × 12.0 m, 82 m² net. Layouts A to D cover tiered seating, shared enclosed wet space, integrated wet area, and shared dry breakout." },
        { label: "Support modules", text: "B1 amenities and resource full bay, B1.h half bay, L1 library module, C1 administration module, S.st stair and lift module." },
        { label: "Building types", text: "Type R relocatable, S1 single-depth single-storey, S2 two-storey, S3 three-storey, plus standard library and administration layouts." }
      ]
    },
    "contact" => {
      title: "Contact",
      blocks: [
        { label: "Property advisor", text: "Your Ministry of Education property advisor is the first point of contact for any project using the standard designs." },
        { label: "Ministry of Education", text: "General enquiries and regional office details are published at education.govt.nz." },
        { label: "This tool", text: "Feedback on the selector itself goes to the standard designs team through your property advisor." }
      ]
    }
  }.freeze

  def index
  end
end
