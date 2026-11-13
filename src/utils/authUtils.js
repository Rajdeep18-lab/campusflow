/**
 * Maps Firebase Auth error codes to user-friendly messages.
 */
export const getAuthErrorMessage = (error) => {
  if (!error) return 'An unexpected error occurred.';
  const code = error.code || '';

  switch (code) {
    case 'auth/email-already-in-use':
      return 'An account already exists with this email address. Please sign in instead.';
    case 'auth/invalid-email':
      return 'The email address is invalid. Please check the spelling.';
    case 'auth/operation-not-allowed':
      return 'Email/Password sign-in is not enabled in the Firebase Console.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters long.';
    case 'auth/user-disabled':
      return 'This account has been disabled. Please contact support.';
    case 'auth/user-not-found':
      return 'No account found with this email address.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again or reset your password.';
    case 'auth/invalid-credential':
      return 'Invalid email or password. Please verify your details.';
    case 'auth/too-many-requests':
      return 'Access temporarily disabled due to too many failed attempts. Please try again later.';
    case 'auth/network-request-failed':
      return 'Network connection issue. Please check your internet connection.';
    default:
      return error.message || 'Authentication failed. Please try again.';
  }
};
