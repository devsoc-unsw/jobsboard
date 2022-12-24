import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { WorkingRights } from 'constants/jobFields'
import { useRouter } from 'next/navigation'
import React from 'react'
import styles from './styles.module.css'

type Props = {
  title: string
  description: string
  tag: string[]
  imgSrc: string
}

const FeaturedJobCard = ({ title, description, tag, imgSrc }: Props) => {
  const router = useRouter()

  return (
    <div
    className='flex flex-col justify-between w-[300px] shadow-card mb-4 rounded-lg min-h-[550px] bg-white relative hover-anim'
    onClick={() => router.push('/login/student')}
  >
    <div>
      <div className='flex justify-center min-w-0 mx-5'>
        {imgSrc ?
          <img
          src={imgSrc}
          className='select-none pointer-events-none object-contain w-full py-4 min-h-[180px]'
          alt='sponsor logo'
        /> : <FontAwesomeIcon
        icon='building'
        className='select-none pointer-events-none object-contain w-full py-4 min-h-[180px]'
        />
        }
      </div>
      <h3 className='text-xl font-bold mx-4 mb-4'>
        {title}
      </h3>
      <div className='flex flex-row flex-wrap m-0 justify-evenly items-center mx-2 my-2 xs:flex-col'>
        {tag.map((tag, idx) => <div key={tag} className='flex justify-center items-center rounded-md my-1 mx-1 px-2 h-6 bg-jb-tags text-base'>
            {WorkingRights[tag as keyof typeof WorkingRights]}
          </div>)}
      </div>
      <p
        className='text-base m-0 py-4 px-5 text-left text-jb-placeholder h-[200px] overflow-hidden text-ellipsis'
        dangerouslySetInnerHTML={{
          __html: description
        }}
      />
    </div>
    <div className='flex-justify-center mt-5'>
      <button className={styles.learnMoreBtn}>Learn More</button>
    </div>
  </div>
  )
}

export default FeaturedJobCard