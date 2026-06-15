/**
 * Environment Variable Validation
 * Ensures all required environment variables are present at startup
 */

const REQUIRED_ENV_VARS = [
  "DATABASE_URL",
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
];

const OPTIONAL_ENV_VARS = ["BETTER_AUTH_SECRET", "NEXTAUTH_URL", "NODE_ENV"];

interface ValidationResult {
  valid: boolean;
  missing: string[];
  message: string;
}

/**
 * Validate that all required environment variables are set
 */
export function validateEnvironment(): ValidationResult {
  const missing: string[] = [];

  // Check required variables
  for (const envVar of REQUIRED_ENV_VARS) {
    if (!process.env[envVar]) {
      missing.push(envVar);
    }
  }

  if (missing.length > 0) {
    const message = `Missing required environment variables: ${missing.join(", ")}`;
    console.error(`❌ ${message}`);
    return {
      valid: false,
      missing,
      message,
    };
  }

  console.log("✅ All required environment variables are set");
  return {
    valid: true,
    missing: [],
    message: "Environment validation passed",
  };
}

/**
 * Get environment variable with fallback and validation
 */
export function getEnvVar(key: string, fallback?: string): string {
  const value = process.env[key] || fallback;

  if (!value && REQUIRED_ENV_VARS.includes(key)) {
    throw new Error(`Required environment variable "${key}" is not set`);
  }

  return value || "";
}
