import React from 'react';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type ProfileCardProps = {
  name: string;
  title: string;
  involvement: string;
  funFact: string;
  linkedin: string;
  gh: string;
  photo: string;
};

const ProfileCard = ({
  name,
  title,
  involvement,
  funFact,
  linkedin,
  gh,
  photo
}: ProfileCardProps) => {
  return (
    <div>
      <div className="flex mb-16">
        {name !== '' && (
          <>
            {/* Left View */}
            <div className="w-24 h-24">
              <img alt={name} src={photo} className="w-28 h-28" />
              <div className="flex justify-items-center gap-3 mt-6">
                <a 
                href={linkedin} 
                target="__blank"
                className="transition-transform duration-300 hover:translate-y-[-4px]">
                  <FontAwesomeIcon 
                  icon={faLinkedin} 
                  size="2x" 
                  className="text-blue-700 h-8" />
                </a>
                <a 
                href={gh} 
                target="__blank" 
                className="transition-transform duration-300 hover:translate-y-[-4px]">
                  <FontAwesomeIcon 
                  icon={faGithub} 
                  size="2x" 
                  className="h-8" />
                </a>
              </div>
            </div>
            {/* Right View */}
            <div className="pl-5 text-left w-80 h-72">
              <div className="font-bold text-3xl text-jb-headings mx-4 sm:mx-0 mb-2">{name}</div>
              <div className="font-bold text-jb-headings mx-4 sm:mx-0">{title}</div>
              <p className="font-bold text-jb-headings mx-4 sm:mx-0 mb-4">{involvement}</p>
              <p className="text-lg text-jb-subheadings mx-4 sm:mx-0">{funFact}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;
