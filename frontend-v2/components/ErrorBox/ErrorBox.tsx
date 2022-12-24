import React from 'react'
import styles from './styles.module.css'

type Props = {
  children: React.ReactNode
}

const ErrorBox = ({ children }: Props) => {
  return (
    <div className={styles.error}>
    {children}
  </div>
  )
}

export default ErrorBox