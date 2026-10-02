// Escapes text for an HTML element body or a quoted attribute value. Every value interpolated into an HTML string
// assigned to innerHTML goes through this.
const ENTITIES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }

export function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (ch) => ENTITIES[ch])
}
