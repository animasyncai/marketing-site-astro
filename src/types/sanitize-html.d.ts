// Re-export types from @types/sanitize-html for default import compatibility
import * as sanitizeHtmlTypes from 'sanitize-html'

declare module 'sanitize-html' {
  const sanitizeHtml: typeof sanitizeHtmlTypes
  export = sanitizeHtml
}
