import React, {TextareaHTMLAttributes} from 'react';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
}

export const TextArea: React.FC<TextAreaProps> = ({
  label,
  helperText,
  required,
  id,
  className = '',
  ...props
}) => {
  return (
    <div className={`w-full mb-8 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-samu-text mb-1.5" htmlFor={id}>
          {label}
          {helperText && (
            <span className="text-samu-neutral font-normal ml-1">({helperText})</span>
          )}
          {required && <span className="text-samu-danger ml-1">*</span>}
        </label>
      )}
      <textarea
        id={id}
        required={required}
        className="w-full min-h-25 resize-y rounded-xl border border-samu-border bg-samu-bg/30 px-4 py-3 text-samu-text outline-none focus:border-samu-primary focus:ring-1 focus:ring-samu-primary transition-all"
        {...props}
      />
    </div>
  );
};
