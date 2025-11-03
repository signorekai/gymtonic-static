# Gymtonic Frontend

## Setup

The following environment variables are required:

- WORDPRESS_URL / NEXT_PUBLIC_WORDPRESS_URL
  Either **WORDPRESS_URL** or **NEXT_PUBLIC_WORDPRESS_URL** need to be populated. Not both!
  Setting WORDPRESS_URL instead of NEXT_PUBLIC_WORDPRESS_URL will limit requests to the WordPress backend to only come from the Node.js server.
  Setting NEXT_PUBLIC_WORDPRESS_URL instead of WORDPRESS_URL will allow requests to come from the client-side which may reduce site performance and put extra load on the WordPress backend.
- WP_HEADLESS_SECRET
- CONTACT_EMAIL
- CONTACT_EMAIL_HOST
- CONTACT_EMAIL_PASS
- CONTACT_EMAIL_PORT
- GOOGLE_ANALYTICS_KEY
- NEXT_PUBLIC_GOOGLE_API_KEY
- NEXT_PUBLIC_WORDPRESS_URL

## Local development

```bash
npm install
npm run dev
```

[http://localhost:3000]()
