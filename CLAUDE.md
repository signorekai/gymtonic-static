# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Start development server**: `npm run dev` (available at http://localhost:3000)
- **Build for production**: `npm run build`
- **Start production server**: `npm start -p 8080`
- **Linting**: `npm run lint` (ESLint with Airbnb TypeScript config, auto-fixes enabled)
- **Clean build artifacts**: `npm run clean`

## Architecture Overview

This is a **Next.js 12** headless frontend for GymTonic, a fitness platform connecting with WordPress as a content management system via the **WPEngine Headless Framework**.

### Key Technologies
- **Frontend**: React 17, Next.js 12, Tailwind CSS 2.2
- **CMS Integration**: WordPress via @wpengine/headless framework and GraphQL
- **Animation**: Framer Motion for parallax effects and video scrolling
- **Styling**: Tailwind CSS with custom viewport height units (`--vh`) and SCSS
- **Forms**: React Hook Form with ValidatorJS validation
- **Email**: Nodemailer integration for signup form submissions

### Architecture Patterns

**Higher-Order Component (HOC) Pattern**: Core functionality is implemented through HOCs that wrap page components:
- `withLayout`: Provides common layout, header management, and mobile responsiveness
- `withLoader`: Manages loading states during navigation
- `withMobileNav`: Handles mobile navigation functionality 
- `withSignUpForm`: Manages signup form modal state

Example usage: `export default withSignUpForm(withLoader(withMobileNav(withLayout(Page))))`

**WordPress Integration**: 
- Content is fetched from WordPress backend using GraphQL queries
- Page templates in `wp-templates/` directory correspond to WordPress page types
- Dynamic routing handled via `[[...page]].jsx` for WordPress content

**Custom Viewport Management**: Uses CSS custom properties for responsive viewport heights:
- `--vh` unit calculated in JavaScript for consistent mobile viewport handling
- Tailwind extends with viewport-based measurements (`screen-1/2`, `screen-3/4`, etc.)

### Directory Structure

- `wp-templates/`: WordPress page templates (front-page, category, single post, etc.)
- `components/`: Reusable React components including HOCs
- `pages/api/`: Next.js API routes (email handling, WordPress auth)
- `assets/`: Static images and fonts
- `public/`: Static assets served directly (videos, images, favicons)
- `scss/`: Global styles and typography definitions

### Key Components

- **VideoScroll**: Complex parallax video component with frame-by-frame scrolling
- **RightParallaxCard**: Animated content cards with video backgrounds
- **SignUpForm**: Multi-step form with conditional validation for self vs. senior registration
- **MapContainer**: Google Maps integration with gym location markers

### Environment Variables

Required for functionality:
- `WORDPRESS_URL` or `NEXT_PUBLIC_WORDPRESS_URL`: WordPress backend endpoint
- `WP_HEADLESS_SECRET`: WordPress authentication secret
- Email service: `CONTACT_EMAIL`, `CONTACT_EMAIL_HOST`, `CONTACT_EMAIL_PASS`, `CONTACT_EMAIL_PORT`
- `NEXT_PUBLIC_GOOGLE_API_KEY`: Google Maps integration
- `GOOGLE_ANALYTICS_KEY`: Analytics tracking

### Form Processing

Signup forms submit to `/api/email.js` which:
1. Validates form data using ValidatorJS with different rules for self vs. senior registration
2. Queries WordPress GraphQL API for location-specific email templates
3. Sends confirmation email to user and notification to admin
4. Handles both individual and caregiver signup flows

### Image Handling

- Uses Next.js Image component with `unoptimized` flag enabled
- Configured domains: `gymtonic.local`, `demo.sulphur.com.sg`, `backend.gymtonic.sg`
- Custom device sizes and image sizes defined in next.config.js

### Styling Notes

- Custom Tailwind configuration with brand colors (red: #E62D2D)
- Custom cursor styles for different page sections
- Responsive typography with custom font sizes and breakpoints
- Uses Gotham HTF and Noto Sans SC fonts