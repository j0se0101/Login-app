import React from 'react';

function InputWithIcon({
  label,
  id,
  type = 'text',
  placeholder,
  disabled = false,
  error,
  leftIcon,
  rightAdornment,
  registerProps = {},
}) {
  const hasRight = Boolean(rightAdornment);
  return (
    <div>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 transition-colors">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-400 dark:text-gray-500">{leftIcon}</span>
          </div>
        )}
        <input
          id={id}
          name={id}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          className={`block w-full ${leftIcon ? 'pl-10' : 'pl-3'} ${hasRight ? 'pr-11' : 'pr-3'} py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 focus:border-transparent transition-colors duration-200 disabled:opacity-60`}
          {...registerProps}
          required
        />
        {rightAdornment && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {rightAdornment}
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400 transition-colors" role="alert" aria-live="polite">
          {error}
        </p>
      )}
    </div>
  );
}

export default InputWithIcon;
