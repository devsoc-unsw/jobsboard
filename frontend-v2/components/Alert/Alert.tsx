import { faCircleInfo, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import styles from './styles.module.css';

export type AlertType = 'error' | 'success';

type Props = {
  open: boolean;
  type?: AlertType;
  message: string;
  onClose?: () => void;
};

const Alert = ({ open, type = 'error', message, onClose }: Props) => {
  const getContainerStyles = () => {
    return type === 'error' ? styles.errorContainer : styles.successContainer;
  };
  const getTextStyles = () => {
    return type === 'error' ? styles.errorText : styles.successText;
  };
  const getButtonStyles = () => {
    return type === 'error' ? styles.errorButton : styles.successButton;
  };

  return (
    <div>
      {open && (
        <div
          className={`flex items-center p-4 mb-8 mt-2 rounded-lg ${getContainerStyles()}`}
          role="alert"
        >
          <FontAwesomeIcon icon={faCircleInfo} className={getTextStyles()} />
          <div className={`ml-3 text-md ${getTextStyles()}`}>{message}</div>
          <button
            type="button"
            className={`ml-auto -mx-1.5 -my-1.5 rounded-lg focus:ring-2 p-1.5 inline-flex justify-center items-center h-8 w-8 ${getButtonStyles()}`}
            aria-label="Close"
            onClick={onClose}
          >
            <span className="sr-only">Close</span>
            <FontAwesomeIcon icon={faXmark} className={getTextStyles()} />
          </button>
        </div>
      )}
    </div>
  );
};

export default Alert;
