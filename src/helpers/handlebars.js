/**
 * Custom Handlebars helpers for the dashboard generator
 */

import { camelCase, pascalCase, kebabCase, snakeCase, constantCase } from 'change-case';
import { fieldTypeToTsType, fieldTypeToInputType } from '../config/defaults.js';

/**
 * Register all custom helpers with Plop
 */
export function registerHelpers(plop) {
  // ============================================================================
  // Case Conversion Helpers
  // ============================================================================

  plop.setHelper('camelCase', (text) => camelCase(text));
  plop.setHelper('pascalCase', (text) => pascalCase(text));
  plop.setHelper('kebabCase', (text) => kebabCase(text));
  plop.setHelper('snakeCase', (text) => snakeCase(text));
  plop.setHelper('constantCase', (text) => constantCase(text));
  plop.setHelper('lowerCase', (text) => text?.toLowerCase() ?? '');
  plop.setHelper('upperCase', (text) => text?.toUpperCase() ?? '');

  // ============================================================================
  // Comparison Helpers
  // ============================================================================

  plop.setHelper('eq', (a, b) => a === b);
  plop.setHelper('neq', (a, b) => a !== b);
  plop.setHelper('gt', (a, b) => a > b);
  plop.setHelper('gte', (a, b) => a >= b);
  plop.setHelper('lt', (a, b) => a < b);
  plop.setHelper('lte', (a, b) => a <= b);
  plop.setHelper('and', (...args) => args.slice(0, -1).every(Boolean));
  plop.setHelper('or', (...args) => args.slice(0, -1).some(Boolean));
  plop.setHelper('not', (value) => !value);

  // ============================================================================
  // Array Helpers
  // ============================================================================

  plop.setHelper('join', (arr, separator) => {
    if (!Array.isArray(arr)) return '';
    return arr.join(typeof separator === 'string' ? separator : ', ');
  });

  plop.setHelper('first', (arr) => {
    if (!Array.isArray(arr)) return null;
    return arr[0];
  });

  plop.setHelper('last', (arr) => {
    if (!Array.isArray(arr)) return null;
    return arr[arr.length - 1];
  });

  plop.setHelper('length', (arr) => {
    if (!Array.isArray(arr)) return 0;
    return arr.length;
  });

  plop.setHelper('includes', (arr, value) => {
    if (!Array.isArray(arr)) return false;
    return arr.includes(value);
  });

  // Filter array by property value
  plop.setHelper('filterBy', function (arr, prop, value, options) {
    if (!Array.isArray(arr)) return '';
    const filtered = arr.filter((item) => item[prop] === value);
    return filtered.map((item) => options.fn(item)).join('');
  });

  // ============================================================================
  // Type Conversion Helpers
  // ============================================================================

  // Convert field type to TypeScript type
  plop.setHelper('tsType', (field) => {
    if (!field) return 'unknown';

    const { type, enumValues, required } = field;

    let tsType;
    if (type === 'enum' && enumValues && enumValues.length > 0) {
      tsType = enumValues.map((v) => `'${v}'`).join(' | ');
    } else {
      tsType = fieldTypeToTsType[type] || 'unknown';
    }

    return required ? tsType : `${tsType} | null`;
  });

  // Convert field type to TypeScript type (without null handling)
  plop.setHelper('tsTypeRaw', (type, enumValues) => {
    if (type === 'enum' && enumValues && enumValues.length > 0) {
      return enumValues.map((v) => `'${v}'`).join(' | ');
    }
    return fieldTypeToTsType[type] || 'unknown';
  });

  // Convert field type to HTML input type
  plop.setHelper('inputType', (type) => {
    return fieldTypeToInputType[type] || 'text';
  });

  // ============================================================================
  // String Helpers
  // ============================================================================

  plop.setHelper('quote', (text) => `'${text}'`);
  plop.setHelper('doubleQuote', (text) => `"${text}"`);

  plop.setHelper('pluralize', (text) => {
    if (!text) return '';
    if (text.endsWith('y')) {
      return text.slice(0, -1) + 'ies';
    }
    if (text.endsWith('s') || text.endsWith('x') || text.endsWith('ch') || text.endsWith('sh')) {
      return text + 'es';
    }
    return text + 's';
  });

  plop.setHelper('singularize', (text) => {
    if (!text) return '';
    if (text.endsWith('ies')) {
      return text.slice(0, -3) + 'y';
    }
    if (text.endsWith('es')) {
      return text.slice(0, -2);
    }
    if (text.endsWith('s')) {
      return text.slice(0, -1);
    }
    return text;
  });

  // ============================================================================
  // Conditional Block Helpers
  // ============================================================================

  // Check if field type is a specific type
  plop.setHelper('isFieldType', function (field, type, options) {
    if (field.type === type) {
      return options.fn(this);
    }
    return options.inverse(this);
  });

  // Check if field should render as specific input
  plop.setHelper('ifInputType', function (type, targetType, options) {
    const inputType = fieldTypeToInputType[type];
    if (inputType === targetType) {
      return options.fn(this);
    }
    return options.inverse(this);
  });

  // ============================================================================
  // Formatting Helpers
  // ============================================================================

  // Format as currency
  plop.setHelper('currency', (value) => {
    if (typeof value !== 'number') return value;
    return `$${value.toFixed(2)}`;
  });

  // Generate indent
  plop.setHelper('indent', (count) => {
    return '  '.repeat(count);
  });

  // JSON stringify
  plop.setHelper('json', (obj) => {
    return JSON.stringify(obj, null, 2);
  });

  // ============================================================================
  // Code Generation Helpers
  // ============================================================================

  // Generate import statement
  plop.setHelper('importStatement', (name, path) => {
    return `import { ${name} } from '${path}';`;
  });

  // Generate field validation rules
  plop.setHelper('validationRules', (field) => {
    const rules = [];

    if (field.required) {
      rules.push(`required: '${field.label} is required'`);
    }
    if (field.minLength) {
      rules.push(`minLength: { value: ${field.minLength}, message: 'Minimum ${field.minLength} characters' }`);
    }
    if (field.maxLength) {
      rules.push(`maxLength: { value: ${field.maxLength}, message: 'Maximum ${field.maxLength} characters' }`);
    }
    if (field.min !== undefined) {
      rules.push(`min: { value: ${field.min}, message: 'Minimum value is ${field.min}' }`);
    }
    if (field.max !== undefined) {
      rules.push(`max: { value: ${field.max}, message: 'Maximum value is ${field.max}' }`);
    }
    if (field.pattern) {
      rules.push(`pattern: { value: /${field.pattern}/, message: 'Invalid format' }`);
    }
    if (field.type === 'email') {
      rules.push(`pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}$/i, message: 'Invalid email address' }`);
    }
    if (field.type === 'url') {
      rules.push(`pattern: { value: /^https?:\\/\\/.+/, message: 'Invalid URL' }`);
    }

    return rules.length > 0 ? `{ ${rules.join(', ')} }` : '{}';
  });

  // Generate mock value based on field type
  plop.setHelper('mockValue', (field, index = 0) => {
    const { type, name, enumValues } = field;

    switch (type) {
      case 'string':
      case 'text':
        return `"${pascalCase(name)} ${index + 1}"`;
      case 'number':
        return (index + 1) * 10;
      case 'boolean':
        return index % 2 === 0;
      case 'date':
        return `"2024-0${(index % 9) + 1}-${String((index % 28) + 1).padStart(2, '0')}"`;
      case 'datetime':
        return `"2024-0${(index % 9) + 1}-${String((index % 28) + 1).padStart(2, '0')}T10:00:00Z"`;
      case 'email':
        return `"user${index + 1}@example.com"`;
      case 'url':
        return `"https://example.com/${index + 1}"`;
      case 'enum':
        if (enumValues && enumValues.length > 0) {
          return `"${enumValues[index % enumValues.length]}"`;
        }
        return `"option${index + 1}"`;
      case 'relation':
        return `"rel-${index + 1}"`;
      default:
        return `"value-${index + 1}"`;
    }
  });

  // ============================================================================
  // Special Helpers
  // ============================================================================

  // Raw block helper (no escaping)
  plop.setHelper('raw', function (options) {
    return options.fn(this);
  });

  // Conditional newline
  plop.setHelper('newline', () => '\n');

  // Comment helper
  plop.setHelper('comment', (text) => `// ${text}`);

  // Block comment helper
  plop.setHelper('blockComment', (text) => `/* ${text} */`);
}

export default registerHelpers;
