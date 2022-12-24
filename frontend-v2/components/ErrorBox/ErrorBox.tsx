import React from 'react'
import styles from './styles.module.css'

const ErrorBox = ({ children }) => {
  return (
    <div className={styles.error}>
    {children}
  </div>
  )
}

export default ErrorBox