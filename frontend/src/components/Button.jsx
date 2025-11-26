import React from 'react';

const variants = {
  primary: 'bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 focus:ring-blue-500',
  success: 'bg-green-600 dark:bg-green-500 hover:bg-green-700 dark:hover:bg-green-600 focus:ring-green-500',
  danger: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
  gray: 'bg-gray-600 hover:bg-gray-700 focus:ring-gray-500',
};

function Button({
  type = 'button',
  variant = 'primary',
  loading = false,
  disabled = false,
  className = '',
  children,
  ...props
}) {
  const classes = `w-full ${variants[variant] || variants.primary} text-white dark:text-gray-50 py-3 px-4 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:bg-opacity-60 disabled:cursor-not-allowed transition-colors duration-200 transform hover:scale-[1.01] ${className}`;
  return (
    <button type={type} disabled={disabled || loading} className={classes} {...props}>
      {loading ? (
        <span className="inline-flex items-center gap-2">
          <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
          </svg>
          Procesando...
        </span>
      ) : (
        children
      )}
    </button>
  );
}

export default Button;
