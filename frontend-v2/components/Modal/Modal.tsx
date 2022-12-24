import React from 'react'

type Props = {
  open: boolean
  children: React.ReactNode
}

const Modal = ({ open, children }: Props) => {
  if (!open) return null;

  return (
    <div>
    {/* <!-- Modal backdrop --> */}
    <div className='opacity-50 fixed inset-0 z-40 bg-black' />
    {/* <!-- Modal --> */}
    <div
      tabIndex={-1}
      className='overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none'
    >
      <div className='flex p-4 w-full max-w-3xl m-auto h-full'>
        {children}
      </div>
    </div>
  </div>
  )
}

export default Modal