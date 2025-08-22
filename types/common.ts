/**
 * Common loading state
 */
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

/**
 * Form field validation state
 */
export interface FieldValidation {
  isValid: boolean;
  errors: string[];
  touched: boolean;
}

/**
 * Generic form state
 */
export interface FormState<T = Record<string, any>> {
  values: T;
  errors: Record<keyof T, string[]>;
  touched: Record<keyof T, boolean>;
  isValid: boolean;
  isSubmitting: boolean;
}

/**
 * Button variant types
 */
export type ButtonVariant = 'primary' | 'secondary' | 'text' | 'outline' | 'danger' | 'info' | 'black' | 'textBlack';

/**
 * Button size types
 */
export type ButtonSize = 'small' | 'medium' | 'large';

/**
 * Input types
 */
export type InputType = 'text' | 'email' | 'password' | 'phone' | 'number';

/**
 * Message types for notifications
 */
export type MessageType = 'success' | 'error' | 'warning' | 'info';

/**
 * Animation directions
 */
export type AnimationDirection = 'up' | 'down' | 'left' | 'right';

/**
 * Status types for subscriptions/memberships
 */
export type StatusType = 'active' | 'expired' | 'upcoming' | 'inactive';

/**
 * Theme color names
 */
export type ColorName = 
  | 'primary' | 'primaryDark' | 'background' | 'surface'
  | 'text' | 'textDisabled' | 'textSubtle'
  | 'error' | 'success' | 'warning' | 'info'
  | 'white' | 'black' | 'active' | 'inactive' | 'expired' | 'expiring';

/**
 * Generic callback function
 */
export type Callback<T = void> = () => T;

/**
 * Generic async callback function
 */
export type AsyncCallback<T = void> = () => Promise<T>;

/**
 * Event handler function
 */
export type EventHandler<T = any> = (event: T) => void;

/**
 * Generic operation result
 */
export interface OperationResult<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}
