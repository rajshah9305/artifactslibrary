/**
 * Simple validation utility
 */
class Validator {
  constructor(data = {}) {
    this.data = data;
    this.errors = {};
  }
  
  // Set data to validate
  setData(data) {
    this.data = data;
    this.errors = {};
    return this;
  }
  
  // Check if a field exists and is not empty
  required(field, message = `${field} is required`) {
    const value = this.getValue(field);
    
    if (value === undefined || value === null || value === '') {
      this.addError(field, message);
    }
    
    return this;
  }
  
  // Check if a field is a string
  string(field, message = `${field} must be a string`) {
    const value = this.getValue(field);
    
    if (value !== undefined && value !== null && typeof value !== 'string') {
      this.addError(field, message);
    }
    
    return this;
  }
  
  // Check if a field is a number
  number(field, message = `${field} must be a number`) {
    const value = this.getValue(field);
    
    if (value !== undefined && value !== null && typeof value !== 'number') {
      this.addError(field, message);
    }
    
    return this;
  }
  
  // Check if a field is a boolean
  boolean(field, message = `${field} must be a boolean`) {
    const value = this.getValue(field);
    
    if (value !== undefined && value !== null && typeof value !== 'boolean') {
      this.addError(field, message);
    }
    
    return this;
  }
  
  // Check if a field is an array
  array(field, message = `${field} must be an array`) {
    const value = this.getValue(field);
    
    if (value !== undefined && value !== null && !Array.isArray(value)) {
      this.addError(field, message);
    }
    
    return this;
  }
  
  // Check if a field is an object
  object(field, message = `${field} must be an object`) {
    const value = this.getValue(field);
    
    if (value !== undefined && value !== null && 
        (typeof value !== 'object' || Array.isArray(value))) {
      this.addError(field, message);
    }
    
    return this;
  }
  
  // Check if a field has a minimum length
  minLength(field, min, message = `${field} must be at least ${min} characters`) {
    const value = this.getValue(field);
    
    if (value !== undefined && value !== null && 
        (typeof value === 'string' || Array.isArray(value)) && 
        value.length < min) {
      this.addError(field, message);
    }
    
    return this;
  }
  
  // Check if a field has a maximum length
  maxLength(field, max, message = `${field} must be at most ${max} characters`) {
    const value = this.getValue(field);
    
    if (value !== undefined && value !== null && 
        (typeof value === 'string' || Array.isArray(value)) && 
        value.length > max) {
      this.addError(field, message);
    }
    
    return this;
  }
  
  // Check if a field matches a regular expression
  matches(field, regex, message = `${field} format is invalid`) {
    const value = this.getValue(field);
    
    if (value !== undefined && value !== null && 
        typeof value === 'string' && !regex.test(value)) {
      this.addError(field, message);
    }
    
    return this;
  }
  
  // Check if a field is an email
  email(field, message = `${field} must be a valid email`) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return this.matches(field, emailRegex, message);
  }
  
  // Check if a field is a URL
  url(field, message = `${field} must be a valid URL`) {
    const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
    return this.matches(field, urlRegex, message);
  }
  
  // Check if a field is in a list of allowed values
  oneOf(field, values, message = `${field} must be one of: ${values.join(', ')}`) {
    const value = this.getValue(field);
    
    if (value !== undefined && value !== null && !values.includes(value)) {
      this.addError(field, message);
    }
    
    return this;
  }
  
  // Custom validation function
  custom(field, fn, message = `${field} is invalid`) {
    const value = this.getValue(field);
    
    if (!fn(value, this.data)) {
      this.addError(field, message);
    }
    
    return this;
  }
  
  // Get a value from the data object (supports dot notation)
  getValue(field) {
    const keys = field.split('.');
    let value = this.data;
    
    for (const key of keys) {
      if (value === undefined || value === null) {
        return undefined;
      }
      value = value[key];
    }
    
    return value;
  }
  
  // Add an error for a field
  addError(field, message) {
    if (!this.errors[field]) {
      this.errors[field] = [];
    }
    
    this.errors[field].push(message);
  }
  
  // Check if validation passed
  passes() {
    return Object.keys(this.errors).length === 0;
  }
  
  // Check if validation failed
  fails() {
    return !this.passes();
  }
  
  // Get all errors
  getErrors() {
    return this.errors;
  }
}

export default Validator;