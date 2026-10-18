export const config = {
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    publishableKey:
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      '',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
    get isConfigured(): boolean {
      return Boolean(this.url && this.publishableKey);
    },
  },
} as const;
