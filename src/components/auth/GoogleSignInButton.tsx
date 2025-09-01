import { useEffect, useRef } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { showErrorNotification } from '../../stores/uiStore';
import GoogleAuthService from '../../services/GoogleAuthService';
import type { GoogleAuthResponse } from '../../types';

interface GoogleSignInButtonProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  theme?: 'outline' | 'filled_blue' | 'filled_black';
  size?: 'large' | 'medium' | 'small';
  text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
  shape?: 'rectangular' | 'pill' | 'circle' | 'square';
  width?: string;
  disabled?: boolean;
}

export const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({
  onSuccess,
  onError,
  theme = 'filled_blue',
  size = 'large',
  text = 'signin_with',
  shape = 'rectangular',
  width = '100%',
  disabled = false,
}) => {
  const { loginWithGoogle, isLoading } = useAuthStore();
  const buttonContainerRef = useRef<HTMLDivElement>(null);
  const buttonId = useRef(`google-signin-button-${Math.random().toString(36).substr(2, 9)}`);

  useEffect(() => {
    if (!disabled && !isLoading && buttonContainerRef.current) {
      // \u041e\u0447\u0438\u0441\u0442\u043a\u0430 \u043a\u043e\u043d\u0442\u0435\u0439\u043d\u0435\u0440\u0430
      buttonContainerRef.current.innerHTML = '';
      
      // \u0421\u043e\u0437\u0434\u0430\u043d\u0438\u0435 \u043d\u043e\u0432\u043e\u0433\u043e \u044d\u043b\u0435\u043c\u0435\u043d\u0442\u0430 \u0434\u043b\u044f \u043a\u043d\u043e\u043f\u043a\u0438
      const buttonDiv = document.createElement('div');
      buttonDiv.id = buttonId.current;
      buttonContainerRef.current.appendChild(buttonDiv);

      const handleGoogleResponse = async (response: GoogleAuthResponse) => {
        try {
          await loginWithGoogle(response);
          onSuccess?.();
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : '\u041e\u0448\u0438\u0431\u043a\u0430 \u0432\u0445\u043e\u0434\u0430 \u0447\u0435\u0440\u0435\u0437 Google';
          showErrorNotification('\u041e\u0448\u0438\u0431\u043a\u0430 \u0430\u0432\u0442\u043e\u0440\u0438\u0437\u0430\u0446\u0438\u0438', errorMessage);
          onError?.(errorMessage);
        }
      };

      // \u041e\u0442\u043a\u043b\u0430\u0434\u044b\u0432\u0430\u0435\u043c \u0440\u0435\u043d\u0434\u0435\u0440 \u043a\u043d\u043e\u043f\u043a\u0438 \u043d\u0430 \u0441\u043b\u0435\u0434\u0443\u044e\u0449\u0438\u0439 \u0442\u0438\u043a
      setTimeout(() => {
        if (!GoogleAuthService.isAvailable()) {
          console.error('Google Identity Services \u043d\u0435 \u0434\u043e\u0441\u0442\u0443\u043f\u043d\u044b');
          showErrorNotification(
            '\u041e\u0448\u0438\u0431\u043a\u0430',
            'Google Identity Services \u043d\u0435 \u0434\u043e\u0441\u0442\u0443\u043f\u043d\u044b. \u041f\u0440\u043e\u0432\u0435\u0440\u044c\u0442\u0435 \u043f\u043e\u0434\u043a\u043b\u044e\u0447\u0435\u043d\u0438\u0435 \u043a \u0438\u043d\u0442\u0435\u0440\u043d\u0435\u0442\u0443.'
          );
          return;
        }

        if (!GoogleAuthService.isConfigured()) {
          console.warn('Google Client ID \u043d\u0435 \u043d\u0430\u0441\u0442\u0440\u043e\u0435\u043d');
          // \u041d\u0435 \u043f\u043e\u043a\u0430\u0437\u044b\u0432\u0430\u0435\u043c \u043e\u0448\u0438\u0431\u043a\u0443 \u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u0442\u0435\u043b\u044e, \u043f\u0440\u043e\u0441\u0442\u043e \u043d\u0435 \u0440\u0435\u043d\u0434\u0435\u0440\u0438\u043c \u043a\u043d\u043e\u043f\u043a\u0443
          return;
        }

        GoogleAuthService.renderButton(buttonId.current, handleGoogleResponse, {
          theme,
          size,
          text,
          shape,
          width,
        });
      }, 100);
    }
  }, [disabled, isLoading, theme, size, text, shape, width, loginWithGoogle, onSuccess, onError]);

  if (disabled || isLoading) {
    return (
      <div className="w-full">
        <button
          disabled
          className="w-full flex items-center justify-center px-4 py-3 rounded-lg shadow-sm bg-white text-gray-500 cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-500 mr-2"></div>
              Вход через Google...
            </>
          ) : (
            'Вход через Google недоступен'
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div ref={buttonContainerRef} className="w-full" />
    </div>
  );
};