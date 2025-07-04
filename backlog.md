## 🎯 Project Overview

Transform the Accessible Astro Starter into a multilingual marketing landing page for Withinly, maintaining WCAG 2.2 AA compliance while implementing early access signup functionality.

---

## 📋 Task Breakdown

### Phase 1: Internationalization Foundation

#### Task 1.1: Set up i18n infrastructure

**File:** `src/utils/i18n.js`

```
- Create i18n utility functions for language detection
- Implement language switching logic
- Set up URL routing for /en and /lt paths
- Create language persistence (localStorage/cookie)
- Add hreflang tag generation
```

#### Task 1.2: Create translation structure

**Files:** `src/data/translations/en.json`, `src/data/translations/lt.json`

```
- Create JSON structure for all text content
- Organize by sections (hero, features, pricing, etc.)
- Include meta descriptions and page titles
- Add form validation messages
- Include email templates for both languages
```

#### Task 1.3: Create translation hook/component

**File:** `src/components/hooks/useTranslation.js`

```
- Create useTranslation hook for components
- Implement fallback logic for missing translations
- Add translation key validation in dev mode
- Create T component for inline translations
```

#### Task 1.4: Update Astro config for i18n

**File:** `astro.config.mjs`

```
- Configure i18n routing
- Set up language-specific builds
- Add redirect rules for root to default language
- Configure sitemap for multiple languages
```

---

### Phase 2: Core Components

#### Task 2.1: Create LanguagePicker component

**File:** `src/components/LanguagePicker.astro`

```
- Design accessible language switcher
- Maintain current page context when switching
- Add proper ARIA labels
- Style to match existing navigation
- Position in header next to DarkMode toggle
```

#### Task 2.2: Modify Hero component for Withinly

**File:** `src/components/HeroWitkinly.astro`

```
- Adapt existing Hero.astro structure
- Add email signup form integration
- Include trust signals section
- Make fully translatable
- Optimize for conversion
```

#### Task 2.3: Create EmailSignup component

**File:** `src/components/EmailSignup.astro`

```
- Create accessible form with email validation
- Add loading states and error handling
- Include success message display
- Make fully translatable
- Add honeypot for spam protection
```

#### Task 2.4: Create FeatureComparison component

**File:** `src/components/FeatureComparison.astro`

```
- Build pricing/feature comparison table
- Ensure mobile responsiveness
- Add "Free vs Premium" sections
- Make accessible with proper table markup
- Include hover states and highlights
```

#### Task 2.5: Create TestimonialSlider component

**File:** `src/components/TestimonialSlider.astro`

```
- Build accessible testimonial carousel
- Add pause on hover/focus
- Include proper ARIA labels
- Add manual navigation controls
- Ensure works without JavaScript
```

#### Task 2.6: Create TrustSignals component

**File:** `src/components/TrustSignals.astro`

```
- Display privacy badges and guarantees
- Include user count (if applicable)
- Add security certifications
- Make visually balanced
- Ensure accessible alt texts
```

---

### Phase 3: Page Implementation

#### Task 3.1: Create landing page

**File:** `src/pages/index.astro`

```
- Implement all sections from copy document
- Integrate all new components
- Add proper semantic HTML structure
- Include schema.org markup
- Optimize for performance
```

#### Task 3.2: Create Lithuanian landing page

**File:** `src/pages/lt/index.astro`

```
- Duplicate structure with Lithuanian content
- Ensure proper language attributes
- Add hreflang links
- Test all functionality
```

#### Task 3.3: Update navigation

**File:** `src/components/Navigation.astro`

```
- Add language picker integration
- Update menu items for Withinly
- Remove unnecessary items (blog, portfolio)
- Add early access CTA button
```

#### Task 3.4: Create privacy page

**File:** `src/pages/privacy.astro`, `src/pages/lt/privacy.astro`

```
- Add comprehensive privacy policy
- Make bilingual
- Include GDPR compliance info
- Style consistently with site
```

---

### Phase 4: Backend Integration

#### Task 4.1: Set up Mailjet API endpoint

**File:** `src/pages/api/signup.js`

```
- Create serverless function for signups
- Integrate Mailjet Node.js SDK
- Add email validation
- Implement rate limiting
- Add error logging
```

#### Task 4.2: Configure environment variables

**File:** `.env.example`

```
- Add Mailjet API credentials
- Add rate limiting configs
- Include language defaults
- Add any feature flags
```

#### Task 4.3: Create email templates

**Files:** `src/emails/welcome-en.html`, `src/emails/welcome-lt.html`

```
- Design welcome email templates
- Ensure email client compatibility
- Include unsubscribe links
- Test with Mailjet's preview
```

---

### Phase 5: Styling & Polish

#### Task 5.1: Customize color scheme

**File:** `src/assets/scss/base/_root.scss`

```
- Update brand colors to match Withinly
- Ensure WCAG AA contrast ratios
- Test in both light/dark modes
- Update selection colors
```

#### Task 5.2: Add custom animations

**File:** `src/assets/scss/components/_animations.scss`

```
- Create subtle scroll animations
- Add hover effects for CTAs
- Implement loading states
- Ensure respects prefers-reduced-motion
```

#### Task 5.3: Optimize typography

**File:** `src/assets/scss/base/_font.scss`

```
- Adjust font scales for marketing content
- Optimize line heights for readability
- Add font loading optimization
- Test with both languages
```

#### Task 5.4: Mobile optimization

```
- Test all components on mobile devices
- Adjust spacing for small screens
- Ensure touch targets meet guidelines
- Optimize form inputs for mobile
```

---

### Phase 6: Testing & Optimization

#### Task 6.1: Accessibility audit

```
- Run axe DevTools on all pages
- Test with screen readers (NVDA/JAWS)
- Verify keyboard navigation
- Check color contrast ratios
- Test with both languages
```

#### Task 6.2: Performance optimization

```
- Run Lighthouse audits
- Optimize images with Astro Image
- Implement lazy loading
- Add resource hints
- Test Core Web Vitals
```

#### Task 6.3: Cross-browser testing

```
- Test in Chrome, Firefox, Safari, Edge
- Verify mobile browsers
- Check form functionality
- Test language switching
- Verify dark mode
```

#### Task 6.4: SEO optimization

```
- Add meta descriptions (both languages)
- Implement Open Graph tags
- Create XML sitemaps
- Add robots.txt
- Test with Google Search Console
```

---

### Phase 7: Deployment & Monitoring

#### Task 7.1: Set up analytics

```
- Add privacy-friendly analytics (Plausible/Fathom)
- Track conversion events
- Set up goal tracking
- Monitor by language
```

#### Task 7.2: Configure deployment

```
- Set up Vercel/Netlify deployment
- Configure environment variables
- Set up preview deployments
- Add deployment webhooks
```

#### Task 7.3: Set up monitoring

```
- Add uptime monitoring
- Set up error tracking (Sentry)
- Monitor API endpoints
- Create alerts for failures
```

#### Task 7.4: Create documentation

**File:** `docs/DEPLOYMENT.md`

```
- Document deployment process
- List all environment variables
- Include troubleshooting guide
- Add translation workflow
```

---

## 🚀 Implementation Order

1. **Week 1:** Phase 1 (i18n) + Phase 2 (Components)
2. **Week 2:** Phase 3 (Pages) + Phase 4 (Backend)
3. **Week 3:** Phase 5 (Styling) + Phase 6 (Testing)
4. **Week 4:** Phase 7 (Deployment) + Final polish

---

## ✅ Success Criteria

- [ ] WCAG 2.2 AA compliance maintained
- [ ] Both languages fully functional
- [ ] Email signup working with Mailjet
- [ ] Mobile responsive
- [ ] Page loads under 3 seconds
- [ ] All interactive elements keyboard accessible
- [ ] Dark mode working properly
- [ ] 90+ Lighthouse scores
