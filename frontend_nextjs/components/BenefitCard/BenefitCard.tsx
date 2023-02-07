import React from 'react';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type BenefitCardProps = {
  title: string;
  description: string;
  icon: IconDefinition;
};

const BenefitCard = ({ title, description, icon }: BenefitCardProps) => {
  return (
    <div className="w-64 md:w-auto md:my-3">
      <FontAwesomeIcon icon={icon} />
      <br />
      <h1 className="text-xl text-jb-headings font-bold mb-2">{title}</h1>
      <p>{description}</p>
    </div>
  );
};

export default BenefitCard;
