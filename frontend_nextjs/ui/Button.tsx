import React from 'react';

type Props = {
  onClick?(e: React.MouseEvent): void;
  children: React.ReactNode;
};

const Button = ({ onClick, children }: Props) => {
  return (
    <button
      onClick={onClick}
      className="bg-jb-textlink rounded-md px-8 py-3 text-white font-bold text-base border-0
                    shadow-btn duration-200 ease-linear cursor-pointer hover:bg-jb-btn-hovered hover:shadow-btn-hovered
                    flex items-center justify-center"
    >
      {children}
    </button>
  );
};

export default Button;
