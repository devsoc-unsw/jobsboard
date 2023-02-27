import React from 'react';
import styles from './styles.module.css';

type ErrorBoxProps = {
  children: React.ReactNode;
};

const ErrorBox = ({ children }: ErrorBoxProps) => {
  return <div className={styles.error}>{children}</div>;
};

export default ErrorBox;
