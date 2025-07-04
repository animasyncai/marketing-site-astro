# AI Relationship Consultant Site - Development Instructions

## Project Context

Building a multilingual (English/Lithuanian) marketing website for an AI relationship consultant service using the Accessible Astro Starter foundation. The site must maintain WCAG 2.2 AA accessibility standards while adding modern multilingual functionality.

## Core Requirements

### 1. Multilingual Architecture

- Support English (default) and Lithuanian languages
- URL structure: `/` for English, `/lt/` for Lithuanian
- All user-facing text must be translatable
- Use JSON translation files in `src/data/translations/`
- Implement language switching without losing page context
- Add proper hreflang tags for SEO

### 2. Maintain Existing Foundation

- Keep all existing Accessible Astro Starter patterns and components
- Preserve WCAG 2.2 AA compliance
- Maintain existing design system (colors, spacing, typography)
- Keep existing component library integration
- Preserve TypeScript support and path aliases
- Maintain existing build process and optimizations

### 3. Content Strategy

- Extend existing content collections for services and testimonials
- Create multilingual content using collection filters
- Maintain existing blog/portfolio structure as examples
- Add AI consultant-specific content types

### 4. Component Architecture

- Create reusable multilingual components that extend existing patterns
- Build marketing-focused sections (hero, services, testimonials, pricing)
- Add language picker component following existing navigation patterns
- Implement contact forms with proper validation and accessibility

### 5. Accessibility Standards

- All new components must meet WCAG 2.2 AA standards
- Maintain semantic HTML structure
- Ensure proper focus management for language switching
- Add appropriate ARIA labels for multilingual content
- Test with screen readers for both languages

## Technical Guidelines

### File Organization

- Follow existing `src/` structure
- Add `src/data/translations/` for language files
- Create `src/utils/i18n.js` for internationalization utilities
- Extend existing layouts rather than replacing them
- Add marketing components to `src/components/sections/`

### Coding Standards

- Use modern JavaScript (ES2022+) patterns
- Follow existing TypeScript conventions
- Maintain consistent naming conventions with existing code
- Use existing SCSS patterns and design tokens
- Follow existing component prop interface patterns

### Performance Requirements

- Maintain existing Astro optimizations
- Implement proper lazy loading for new images
- Ensure minimal JavaScript bundle impact
- Use existing CSS optimization patterns
- Maintain current Lighthouse scores

### SEO Considerations

- Add proper meta tags for both languages
- Implement hreflang tags correctly
- Maintain existing structured data patterns
- Ensure proper URL canonicalization
- Add language-specific sitemaps

## Marketing Site Specific Requirements

### Content Types Needed

- Hero sections with CTAs
- Service descriptions and benefits
- Client testimonials with ratings
- Pricing tables with multiple tiers
- Contact forms with service selection
- About sections with team information

### Conversion Optimization

- Clear call-to-action buttons following existing button patterns
- Trust indicators and social proof
- Progressive disclosure of information
- Mobile-first responsive design
- Fast loading times

### Brand Consistency

- Use existing color palette as base
- Maintain accessibility contrast ratios
- Follow existing typography scales
- Keep consistent spacing and layout patterns
- Preserve existing animation and interaction patterns

## Quality Assurance

### Testing Requirements

- Cross-browser compatibility (Chrome, Firefox, Safari, Edge)
- Mobile responsiveness on all device sizes
- Accessibility testing with screen readers
- Language switching functionality
- Form validation and submission
- Performance metrics maintenance

### Validation Checklist

- HTML validation for both languages
- WCAG 2.2 AA compliance verification
- Color contrast ratio checks
- Keyboard navigation testing
- Translation accuracy review
- SEO meta tag validation

## Development Workflow

### Implementation Approach

- Start with core i18n utilities
- Extend existing components incrementally
- Add new marketing sections one at a time
- Test accessibility after each component
- Validate translations before deployment

### File Naming Conventions

- Use existing component naming patterns
- Add language suffix for content files (`-en.mdx`, `-lt.mdx`)
- Follow existing URL structure patterns
- Maintain consistent translation key naming

### Code Review Standards

- Ensure all text is translatable
- Verify accessibility compliance
- Check performance impact
- Validate responsive design
- Test language switching
- Review translation accuracy

## Deployment Considerations

### Build Process

- Maintain existing Astro build configuration
- Ensure proper static generation for both languages
- Verify all translations are included in build
- Check language-specific meta tags
- Validate URL routing for both languages

### Production Requirements

- Proper caching headers for translation files
- CDN configuration for multilingual content
- Analytics setup for language tracking
- Error handling for missing translations
- Fallback language support

## Maintenance Guidelines

### Translation Management

- Keep translation files organized and consistent
- Document translation key naming conventions
- Implement fallback text for missing translations
- Plan for future language additions
- Establish translation review process

### Content Updates

- Use existing content collection patterns
- Maintain version control for translations
- Document content update procedures
- Establish workflow for bilingual content creation
- Plan for content synchronization between languages

---

**Key Success Metrics:**

- WCAG 2.2 AA compliance maintained
- Both languages fully functional
- Performance scores unchanged
- Conversion optimization implemented
- Professional marketing site achieved

**Remember:** Always extend existing patterns rather than replacing them. The goal is to add multilingual capability while preserving all the accessibility and performance benefits of the Accessible Astro Starter foundation.
