import React from 'react'

type Props = {
  title: string;
  description: string;
}

const BenefitCard = ({ title, description }: Props) => {
  return (
    <div className='w-64 md:w-auto md:my-3'>
    {/* <font-awesome-icon :icon='icon' /> */}
    <br />
    <h1 className='text-xl text-jb-headings font-bold mb-2'>
      {title}
    </h1>
    <p>{description}</p>
  </div>
  )
}

export default BenefitCard