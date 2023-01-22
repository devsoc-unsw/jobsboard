import React from 'react';

type ButtonProps = {
  onClick?(e: React.MouseEvent): void;
  disabled?: boolean;
  // loading?: boolean;
  children: React.ReactNode;
};

const Button = ({ onClick, children, disabled }: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="bg-jb-textlink rounded-md px-8 py-3 text-white font-bold text-base border-0
                    shadow-btn duration-200 ease-linear cursor-pointer hover:bg-jb-btn-hovered hover:shadow-btn-hovered
                    flex items-center justify-center"
    >
      {children}
    </button>
  );
};

export default Button;
