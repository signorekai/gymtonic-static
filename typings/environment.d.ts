declare global {
  namespace NodeJS {
    interface ProcessEnv {
      CONTACT_EMAIL: string;
      CONTACT_EMAIL_PASS: string;
      CONTACT_EMAIL_HOST: string;
      CONTACT_EMAIL_PORT: number;
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
