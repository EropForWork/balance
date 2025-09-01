import type { GoogleUser, GoogleAuthResponse } from '../types';

export class GoogleAuthService {
  private static readonly CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

  /**
   * Initialize Google Identity Services
   */
  static initialize(): Promise<void> {
    return new Promise((resolve) => {
      if (typeof window !== 'undefined' && window.google) {
        window.google.accounts.id.initialize({
          client_id: this.CLIENT_ID,
          callback: () => {}, // Will be set per component
          auto_select: false,
          cancel_on_tap_outside: true,
        });
        resolve();
      } else {
        // Wait for Google Identity Services to load
        const checkGoogle = () => {
          if (window.google) {
            window.google.accounts.id.initialize({
              client_id: this.CLIENT_ID,
              callback: () => {}, // Will be set per component
              auto_select: false,
              cancel_on_tap_outside: true,
            });
            resolve();
          } else {
            setTimeout(checkGoogle, 100);
          }
        };
        checkGoogle();
      }
    });
  }

  /**
   * Prompt Google One Tap login
   */
  static promptOneTap(callback: (response: GoogleAuthResponse) => void): void {
    if (!window.google) {
      console.error('Google Identity Services not loaded');
      return;
    }

    window.google.accounts.id.initialize({
      client_id: this.CLIENT_ID,
      callback,
      auto_select: false,
      cancel_on_tap_outside: true,
    });

    window.google.accounts.id.prompt((notification: any) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        console.log('Google One Tap was not displayed or was skipped');
      }
    });
  }

  /**
   * Render Google Sign-In button
   */
  static renderButton(
    containerId: string,
    callback: (response: GoogleAuthResponse) => void,
    options?: {
      theme?: 'outline' | 'filled_blue' | 'filled_black';
      size?: 'large' | 'medium' | 'small';
      text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
      shape?: 'rectangular' | 'pill' | 'circle' | 'square';
      logo_alignment?: 'left' | 'center';
      width?: string;
    }
  ): void {
    if (!window.google) {
      console.error('Google Identity Services not loaded');
      return;
    }

    // Check if Client ID is properly configured
    if (!this.CLIENT_ID || this.CLIENT_ID.trim() === '') {
      console.error('Google Client ID is not configured. Please set VITE_GOOGLE_CLIENT_ID environment variable.');
      return;
    }

    window.google.accounts.id.initialize({
      client_id: this.CLIENT_ID,
      callback,
      auto_select: false,
      cancel_on_tap_outside: true,
    });

    // Convert percentage width to pixel width if needed
    let buttonWidth = options?.width || '384'; // Default to 384px for large buttons
    if (buttonWidth === '100%') {
      buttonWidth = '384'; // Standard full-width button size
    } else if (buttonWidth.endsWith('%')) {
      // Convert other percentages to pixels (assuming container width of 400px)
      const percentage = parseInt(buttonWidth.replace('%', ''));
      buttonWidth = Math.round((percentage / 100) * 400).toString();
    }

    window.google.accounts.id.renderButton(
      document.getElementById(containerId)!,
      {
        theme: options?.theme || 'filled_blue',
        size: options?.size || 'large',
        text: options?.text || 'signin_with',
        shape: options?.shape || 'rectangular',
        logo_alignment: options?.logo_alignment || 'left',
        width: buttonWidth,
      }
    );
  }

  /**
   * Parse JWT token to extract user information
   */
  static parseJWT(token: string): GoogleUser | null {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      
      const payload = JSON.parse(jsonPayload);
      
      return {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
        given_name: payload.given_name,
        family_name: payload.family_name,
      };
    } catch (error) {
      console.error('Error parsing JWT token:', error);
      return null;
    }
  }

  /**
   * Sign out from Google
   */
  static signOut(): void {
    if (window.google) {
      window.google.accounts.id.disableAutoSelect();
    }
  }

  /**
   * Revoke Google access
   */
  static revoke(accessToken?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!accessToken) {
        resolve();
        return;
      }

      window.google?.accounts.oauth2.revoke(accessToken, (response: any) => {
        if (response.error) {
          reject(new Error(response.error));
        } else {
          resolve();
        }
      });
    });
  }

  /**
   * Check if Google Identity Services is available
   */
  static isAvailable(): boolean {
    return typeof window !== 'undefined' && !!window.google;
  }

  /**
   * Check if Google Authentication is properly configured
   */
  static isConfigured(): boolean {
    return this.CLIENT_ID && this.CLIENT_ID.trim() !== '' && this.CLIENT_ID !== 'your_google_client_id_here.apps.googleusercontent.com';
  }

  /**
   * Get current client ID
   */
  static getClientId(): string {
    return this.CLIENT_ID;
  }
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    google: any;
  }
}

export default GoogleAuthService;