import { apiClient, setAuthToken, setRefreshToken } from "../../../core/apiClient";
import { LoginInput, AuthResponse } from "../../types";

/**
 * Login user with credentials
 * @endpoint /api/auth/login (POST)
 */
export const postLogin = async (credentials: LoginInput): Promise<AuthResponse> => {
  try {
    console.log('[Login Debug] Making login request with:', {
      email: credentials.email,
      hasPassword: !!credentials.password
    });
    
    const response = await apiClient.post('/api/auth/login', credentials);
    
    // Log entire response for debugging
    console.log('[Login Debug] FULL login response:', response);
    console.log('[Login Debug] Response data structure:', {
      keys: Object.keys(response.data || {}),
      hasUserObject: !!response.data?.user,
      userKeys: response.data?.user ? Object.keys(response.data.user) : 'no user object',
      tokenType: typeof response.data?.token,
      refreshTokenType: typeof response.data?.refreshToken,
    });
    
    console.log('[Login Debug] Login response:', {
      status: response.status,
      hasToken: !!response.data.token,
      hasRefreshToken: !!response.data.refreshToken,
      tokenPreview: response.data.token ? response.data.token.substring(0, 10) + '...' : 'none'
    });
    
    // Set the tokens in localStorage for global access
    if (response.data.token) {
      // Use the helper function that handles errors and fallbacks
      setAuthToken(response.data.token);
      
      // Verify storage worked immediately
      console.log('[Login Debug] Verification of token storage:', {
        'auth_token in localStorage': !!localStorage.getItem('auth_token'),
        'authToken in localStorage': !!localStorage.getItem('authToken'),
        'auth_token value': localStorage.getItem('auth_token')?.substring(0, 10) + '...',
        'authToken value': localStorage.getItem('authToken')?.substring(0, 10) + '...'
      });
    } else {
      console.error('[Login Debug] No token received in login response');
    }
    
    // Also store refresh token if available
    if (response.data.refreshToken) {
      setRefreshToken(response.data.refreshToken);
      console.log('[Login Debug] Refresh token stored using helper');
    }
    
    // Store user data if available
    if (response.data.user) {
      try {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('auth_user', JSON.stringify(response.data.user));
        console.log('[Login Debug] User data stored in localStorage with keys: user, auth_user');
      } catch (e) {
        console.error('[Login Debug] Error storing user data:', e);
      }
    }
    
    // Dispatch event to notify other components about token change
    try {
      window.dispatchEvent(new Event('auth_token_changed'));
      console.log('[Login Debug] Dispatched auth_token_changed event');
    } catch (e) {
      console.error('[Login Debug] Error dispatching auth_token_changed event:', e);
    }
    
    return response.data;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

export default postLogin; 