import { useState, useCallback } from 'react';

interface ValidationRule {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    custom?: (value: string) => boolean;
    message: string;
}

interface ValidationRules {
    [key: string]: ValidationRule[];
}

export function useFormValidation(rules: ValidationRules) {
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = useCallback((field: string, value: string): boolean => {
        const fieldRules = rules[field];
        if (!fieldRules) return true;

        for (const rule of fieldRules) {
            if (rule.required && !value.trim()) {
                setErrors(prev => ({ ...prev, [field]: rule.message }));
                return false;
            }

            if (rule.minLength && value.length < rule.minLength) {
                setErrors(prev => ({ ...prev, [field]: rule.message }));
                return false;
            }

            if (rule.maxLength && value.length > rule.maxLength) {
                setErrors(prev => ({ ...prev, [field]: rule.message }));
                return false;
            }

            if (rule.pattern && !rule.pattern.test(value)) {
                setErrors(prev => ({ ...prev, [field]: rule.message }));
                return false;
            }

            if (rule.custom && !rule.custom(value)) {
                setErrors(prev => ({ ...prev, [field]: rule.message }));
                return false;
            }
        }

        setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[field];
            return newErrors;
        });
        return true;
    }, [rules]);

    const validateAll = useCallback((data: Record<string, string>): boolean => {
        let isValid = true;
        Object.keys(rules).forEach(field => {
            if (!validate(field, data[field] || '')) {
                isValid = false;
            }
        });
        return isValid;
    }, [rules, validate]);

    const clearError = useCallback((field: string) => {
        setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[field];
            return newErrors;
        });
    }, []);

    return { errors, validate, validateAll, clearError };
}
