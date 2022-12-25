import React from 'react'

type Props = {
  children: React.ReactNode
}

const LandingRootLayout = ({ children }: Props) => {
  return (
    <div>{children}</div>
  )
}

export default LandingRootLayout