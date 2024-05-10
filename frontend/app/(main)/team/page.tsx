import React from 'react';
import ProfileCard from 'components/ProfileCard/ProfileCard';

const TeamPage = () => {
  const members = [
    {
      name: 'Adam Tizzone',
      title: 'Founder & 2018-2021 Jobsboard Director',
      involvement: 'UI Design, Frontend & Backend',
      funFact:
        'Some fun facts would be that I was a project lead in the first year of CSESoc Projects. I also met one of the researchers on the team that eventually developed the technology we now know as Wi-Fi.',
      linkedin: 'https://au.linkedin.com/in/adam-tizzone',
      gh: 'https://github.com/ad-t',
      photo:
        'https://media-exp1.licdn.com/dms/image/D5603AQHM0dMmj2SBaQ/profile-displayphoto-shrink_800_800/0/1666852544286?e=1675900800&v=beta&t=yjcDTMAzz9fQw1HtwQfqU7lEpqfIwdYdVKJa27dFHcg'
    },
    {
      name: '',
      title: '',
      involvement: '',
      funFact: '',
      linkedin: '',
      gh: '',
      photo: ''
    },
    {
      name: 'Darian Lee',
      title: '2022 Jobsboard Director',
      involvement: 'UI Design, Frontend',
      funFact:
        "Hiya! I'm one of the leads who stresses about the project way more than I should. Outside of uni, I love watching sitcoms. Fun fact: I won 1st place in a 'The Big Bang Theory' trivia once.",
      linkedin: 'https://www.linkedin.com/in/darianlmj/',
      gh: 'https://github.com/Darianlmj/',
      photo:
        'https://media-exp1.licdn.com/dms/image/C5603AQHleS3ZgEf5SQ/profile-displayphoto-shrink_800_800/0/1629992435756?e=1675900800&v=beta&t=IstogZPeV4ZUj4yHNjQbeKcNC300wONmx5xX58U8y6A'
    },
    {
      name: 'Joanna He',
      title: '2022 Jobsboard Director',
      involvement: 'Backend',
      funFact: 'Avid tennis enjoyer and all things software development',
      linkedin: 'https://www.linkedin.com/in/joannaahe/',
      gh: 'https://github.com/joanna209',
      photo:
        'https://media-exp1.licdn.com/dms/image/D5603AQGD5oy4Kked9A/profile-displayphoto-shrink_800_800/0/1668496417144?e=1675900800&v=beta&t=zhCARbVUOd8ROCdE55kyYZYH7bJx4f9zs_2LEJnNn20'
    },
    {
      name: 'Matthew Liu',
      title: '2023 Jobsboard Director',
      involvement: 'Backend',
      funFact:
        'Aspiring software engineer particularly interested working with the backend. My wildest dream would be to see Arsenal win the Champions League.',
      linkedin: 'https://www.linkedin.com/in/matthew-liu-cs/',
      gh: 'https://github.com/matth3wliuu',
      photo: 'https://i.imgur.com/GpvRH5G.png'
    },
    {
      name: 'Gabriel Ting',
      title: '2023 Jobsboard Director',
      involvement: 'Frontend',
      funFact: 'I love circles 🟣 and squares 🟪',
      linkedin: 'https://www.linkedin.com/in/gabriel-ting/',
      gh: 'https://github.com/gtangelo',
      photo:
        'https://media-exp1.licdn.com/dms/image/C5603AQEia_BIGgbOww/profile-displayphoto-shrink_400_400/0/1648716681245?e=1675900800&v=beta&t=k8_6WX-iJCU3Aucwu-Y5i4HpxEwgHxmp3xWjYDNMKFE'
    },
    {
      name: 'Richard Bao',
      title: '2024 Jobsboard Director',
      involvement: 'Backend',
      funFact: ' ',
      linkedin: 'https://www.linkedin.com/in/richard-bao/',
      gh: 'https://github.com/RichardBao1',
      photo: ''
    },
    {
      name: 'Flynn Lambrechts',
      title: '2024 Jobsboard Director',
      involvement: 'Frontend',
      funFact: ' ',
      linkedin: 'https://www.linkedin.com/in/flynn-lambrechts/',
      gh: 'https://github.com/flynnlambrechts',
      photo:
        'https://media.licdn.com/dms/image/C4D03AQE2Zp0kmjG88g/profile-displayphoto-shrink_800_800/0/1617330448714?e=1718841600&v=beta&t=2WcPeCLEmOl_0Mv3duajr9pSqtre2pSZwLWWP-NzeSM'
    },
    {
      name: 'Brian Nhan',
      title: '2024 Jobsboard Subcommittee',
      involvement: 'Frontend',
      funFact: ' ',
      linkedin: 'https://www.linkedin.com/in/briannhan/',
      gh: 'https://github.com/brnhan',
      photo:
        'https://media.licdn.com/dms/image/D5603AQHzNvWNa9xfEg/profile-displayphoto-shrink_800_800/0/1680748247930?e=1720656000&v=beta&t=V0e93sDY_5rjVVaOOGNCjERw78ebQeJWGrodBB7dXAo'
    }
  ];

  return (
    <div>
      <div className="text-center">
        <h2 className="font-bold text-4xl drop-shadow-xl mb-10 text-jb-headings mt-4">
          Interested about the people behind <br />
          Jobsboard?
        </h2>
        <h4 className="mb-3 text-jb-subheadings text-xl">
          Hi there! We&apos;re the jobsboard team and we want <br />
          to help you find your dream student job!
        </h4>
      </div>
      <div className="w-80 h-1 bg-gray-300 m-auto mt-10 mb-20" />
      {/* <!-- items-center --> */}
      <div className="justify-items-center grid grid-cols-2 grid-flow-row lg:grid-cols-1">
        {members.map((m) => (
          <ProfileCard
            name={m.name}
            title={m.title}
            involvement={m.involvement}
            funFact={m.funFact}
            linkedin={m.linkedin}
            gh={m.gh}
            photo={m.photo}
            key={m.name}
          />
        ))}
      </div>

      <div
        className="border-t-[10px] border-blue-300 box-border m-auto w-8/12 rounded-md mb-24
              shadow-card bg-white text-center"
      >
        <div className="flex flex-col items-center px-10 pt-4 pb-8">
          <p className="text-jb-subheadings my-4 text-lg">
            Still interested? Want to be part of this exciting team? If so, then keep an eye out for
            our recruitment announcements on CSESoc&apos;s socials. We&apos;re always looking for
            keen and passionate people with a drive to learn and contribute.
          </p>
          <p className="text-jb-subheadings text-lg">
            Otherwise, you can also contribute by suggesting cool new features or even coding them
            yourself and making a pull request on the jobsboard repo.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TeamPage;
