import React from 'react';
import Spinner from 'ui/Spinner/Spinner';

type ButtonProps = {
  onClick?(e: React.MouseEvent): void;
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  variant: 'primary' | 'secondary' | 'tertiary' | 'danger' | 'success';
};

const Button = ({ onClick, children, disabled, loading, variant }: ButtonProps) => {
  const getBgColor = () => {
    if (variant === 'primary') {
      return 'bg-jb-textlink';
    } else if (variant === 'secondary') {
      return 'bg-gray-200';
    } else if (variant === 'tertiary') {
      return 'bg-none';
    } else if (variant === 'danger') {
      return 'bg-jb-red';
    } else if (variant === 'success') {
      return 'bg-jb-green';
    }
  };

  const getTextColor = () => {
    if (variant === 'primary') {
      return 'text-white';
    }
    return 'text-jb-subheadings';
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`${getBgColor()} ${getTextColor()} rounded-md px-8 py-3 font-bold text-base border-0
                    shadow-btn duration-200 ease-linear ${
                      loading ? 'cursor-wait' : 'cursor-pointer'
                    } hover:bg-jb-btn-hovered hover:shadow-btn-hovered hover:text-white
                    flex items-center justify-center`}
    >
      {loading ? <Spinner /> : children}
    </button>
  );
};

export default Button;
