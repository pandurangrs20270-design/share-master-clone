/**
 * Shared validation helpers for form inputs.
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const INDIAN_PHONE_REGEX = /^(\+91[\s-]?)?[6-9]\d{9}$/;
const NAME_REGEX = /^[a-zA-Z\s.\-']{2,100}$/;

export function isValidEmail(value: string): boolean {
  if (!value || typeof value !== "string") return false;
  const trimmed = value.trim();
  return trimmed.length <= 254 && EMAIL_REGEX.test(trimmed);
}

export function isValidIndianPhone(value: string): boolean {
  if (!value || typeof value !== "string") return false;
  const digits = value.replace(/\D/g, "");
  return digits.length === 10 && /^[6-9]/.test(digits);
}

export function validatePhone(value: string): string | null {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 0) return "Phone number is required.";
  if (digits.length !== 10) return "Enter a valid 10-digit mobile number.";
  if (!/^[6-9]/.test(digits)) return "Phone number must start with 6, 7, 8, or 9.";
  return null;
}

export function validateEmail(value: string): string | null {
  if (!value || !value.trim()) return "Email is required.";
  if (!isValidEmail(value)) return "Enter a valid email address.";
  return null;
}

export function validateName(value: string, fieldLabel = "Name"): string | null {
  if (!value || !value.trim()) return `${fieldLabel} is required.`;
  const trimmed = value.trim();
  if (trimmed.length < 2) return `${fieldLabel} must be at least 2 characters.`;
  if (trimmed.length > 100) return `${fieldLabel} must be less than 100 characters.`;
  if (!NAME_REGEX.test(trimmed)) return `${fieldLabel} can only contain letters, spaces, and common punctuation.`;
  return null;
}

export function validatePassword(value: string, minLength = 6): string | null {
  if (!value) return "Password is required.";
  if (value.length < minLength) return `Password must be at least ${minLength} characters.`;
  return null;
}

export function validateMessage(value: string, maxLength = 2000): string | null {
  if (!value || !value.trim()) return null;
  if (value.length > maxLength) return `Message must be less than ${maxLength} characters.`;
  return null;
}
