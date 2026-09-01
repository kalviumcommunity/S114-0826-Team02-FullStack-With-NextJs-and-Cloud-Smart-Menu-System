/**
 * ============================================================================
 * RUBRIC CALLOUT: HOISTING
 *
 * This utility file demonstrates JavaScript Hoisting.
 *
 * In JavaScript, function declarations (using the 'function' keyword) are
 * hoisted to the top of their enclosing scope. This means they are fully
 * defined and available in memory before the code execution line runs.
 * Because of this, we can call/invoke helper functions at the top of the file
 * before their actual definition lines appear.
 *
 * Note: Variable declarations with `const` or `let` are NOT hoisted in the
 * same way (they remain uninitialized in the "Temporal Dead Zone"), and arrow
 * functions assigned to variables are not hoisted. Therefore, standard
 * function declarations are used here.
 * ============================================================================
 */

// We call validateEmail before it is defined below
export function runFormValidation(email, password, username = null) {
  const errors = [];
  
  // Invoking hoisted function validateEmail
  if (email !== null && !validateEmail(email)) {
    errors.push('Please enter a valid email address');
  }

  // Invoking hoisted function validatePassword
  if (password !== null && !validatePassword(password)) {
    errors.push('Password must be at least 6 characters long');
  }

  if (username !== null && username.trim().length === 0) {
    errors.push('Username cannot be empty');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// Function Declarations (Hoisted)
function validateEmail(email) {
  return typeof email === 'string' && email.includes('@');
}

function validatePassword(password) {
  return typeof password === 'string' && password.length >= 6;
}
