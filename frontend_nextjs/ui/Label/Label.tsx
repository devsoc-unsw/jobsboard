import React from 'react';

type LabelProps = {
  htmlFor: string;
  children: React.ReactNode;
};

const Label = ({ htmlFor, children }: LabelProps) => {
  return (
    <label
      htmlFor={htmlFor}
      className="transform transition-all duration-400 absolute top-7 left-0 h-full flex items-center font-bold text-lg text-jb-placeholder/60 pl-6 pb-[3.75rem]
                group-focus-within:text-base group-focus-within:h-1/2 group-focus-within:-translate-y-full
                group-focus-within:pl-2 group-focus-within:pb-10 group-focus-within:text-jb-textlink
                peer-valid:text-base peer-valid:h-1/2 peer-valid:-translate-y-full peer-valid:pl-2 peer-valid:pb-10 peer-valid:text-jb-textlink"
    >
      {children}
    </label>
  );
};

export default Label;
