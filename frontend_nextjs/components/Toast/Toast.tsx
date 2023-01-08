import React from 'react';

export type ToastType = 'success' | 'error';

type ToastProps = {
  message: string;
  type: ToastType;
};

const Toast = ({ message, type }: ToastProps) => {
  return (
    <div
      className={`fixed bottom-10 left-10 px-5 py-4 max-w-md text-white rounded-md drop-shadow-2xl z-10 transition-all duration-500 ease-in-out bg-[#${
        type === 'success' ? '259E3B' : 'EB5837'
      }]`}
    >
      <p className="text-lg font-semibold">{message}</p>
    </div>
  );
};

export default Toast;
