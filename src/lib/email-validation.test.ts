import { describe, it, expect } from 'vitest';
import { validateEmail } from './email-validation';

describe('validateEmail', () => {
    it('should return valid for correct email', () => {
        const result = validateEmail('abshir@gmail.com');
        expect(result.isValid).toBe(true);
    });

    it('should return error for invalid email missing @', () => {
        const result = validateEmail('testexample.com');
        expect(result.isValid).toBe(false);
        expect(result.error).toBeDefined();
    });

    it('should return error for empty email', () => {
        const result = validateEmail('');
        expect(result.isValid).toBe(false);
    });

    it('should handle Somali-style email input (if specific logic exists)', () => {
        // Example test for consistency
        const result = validateEmail('abshir@garaad.com');
        expect(result.isValid).toBe(true);
    });
});
