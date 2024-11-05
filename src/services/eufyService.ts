import { EufySecurityClient, Device, Station } from 'eufy-security-client';

class EufyService {
  private client: EufySecurityClient | null = null;
  private isInitialized = false;

  async initialize() {
    if (this.isInitialized) return;

    try {
      this.client = new EufySecurityClient({
        username: import.meta.env.VITE_EUFY_USERNAME,
        password: import.meta.env.VITE_EUFY_PASSWORD,
        country: 'US',
        language: 'en',
        persistentDir: './persistent'
      });

      await this.client.connect();
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize Eufy client:', error);
      throw error;
    }
  }

  // ... rest of the service implementation remains the same
}