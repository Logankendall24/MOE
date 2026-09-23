import { Controller } from "@hotwired/stimulus"

// Drives the cover's slide-out info panels. The design rendered one panel at a
// time from React state; here all panels are in the DOM and toggled.
export default class extends Controller {
  static targets = ["panel"]

  openPanel(event) {
    const name = event.currentTarget.dataset.panel
    this.panelTargets.forEach((panel) => {
      panel.hidden = panel.dataset.panel !== name
    })
  }

  closePanel() {
    this.panelTargets.forEach((panel) => { panel.hidden = true })
  }
}
