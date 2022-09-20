<template>
  <GeneralPageTemplate>
    <Breadcrumbs class='w-1/4' />
    <h2 class='font-bold text-4xl drop-shadow-xl mb-10 text-jb-headings mt-4'>
      Interested about the people behind <br>
      Jobs Board?
    </h2>
    <h4 class='mb-3 text-jb-subheadings text-xl'>
      Hi there! We're the jobsboard team and we want <br>
      to help you find your dream student job!
    </h4>

    <div class='w-80 h-1 bg-gray-300 m-auto mt-10 mb-20' />
    <!-- items-center -->
    <div class='justify-items-center grid grid-cols-2 grid-flow-row lg:grid-cols-1'>
      <ProfileCard
        v-for='member in members'
        :key='member.name'
        :member='member'
      />
    </div>

    <div
      class='interestBox box-border m-auto w-8/12 rounded-md mb-24
                shadow-card bg-white'
    >
      <div class='flex flex-col items-center px-10 pt-4 pb-8'>
        <p class='text-jb-subheadings my-4 text-lg'>
          Still interested? Want to be part of this exciting team? If so,
          then keep an eye out for our recruitment announcements on CSESoc's socials.
          We're always looking for keen and passionate people with a drive to learn and contribute.
        </p>
        <p class='text-jb-subheadings text-lg'>
          Otherwise, you can also contribute by suggesting cool new features or even coding them
          yourself and making a pull request on the jobsboard repo.
        </p>
      </div>
    </div>
  </GeneralPageTemplate>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';

import ProfileCard from '@/components/ProfileCard.vue';
import GeneralPageTemplate from '@/components/GeneralPageTemplate.vue';
import Breadcrumbs from '@/components/Breadcrumbs.vue';

const members = [
  {
    name: 'Adam Tizzone',
    title: 'Founder & 2018-2021 Project Lead',
    involvement: 'UI Design, Frontend & Backend',
    funFact: 'Some fun facts would be that I was a project lead in the first year of CSESoc Projects. I also met one of the researchers on the team that eventually developed the technology we now know as Wi-Fi.',
    in: 'https://au.linkedin.com/in/adam-tizzone',
    gh: 'https://github.com/ad-t',
    photo: 'https://electralink.com/wp-content/uploads/2015/12/leadership-profile.png',
  },
  {
    name: 'Darian Lee',
    title: '2022 Project Lead',
    involvement: 'UI Design, Frontend',
    funFact: 'Hiya! I\'m one of the leads who stresses about the project way more than I should. Outside of uni, I love watching sitcoms. Fun fact: I won 1st place in a \'The Big Bang Theory\' trivia once.',
    in: 'https://www.linkedin.com/in/darianlmj/',
    gh: 'https://github.com/Darianlmj/',
    photo: 'https://electralink.com/wp-content/uploads/2015/12/leadership-profile.png',
  },
  {
    name: 'Joanna He',
    title: '2022 Project Lead',
    involvement: 'Backend',
    funFact: 'Hi there! I\'m one of the project leads for Jobs Board. In my spare time, I enjoy playing tennis, cafe hopping and travelling. Keen to see how Jobs Board can help you take the first step towards your career goals.',
    in: 'https://www.linkedin.com/in/joannaahe/',
    gh: 'https://github.com/joanna209',
    photo: 'https://electralink.com/wp-content/uploads/2015/12/leadership-profile.png',
  },
  {
    name: 'Matthew Liu',
    title: '2022 Subcomittee Member',
    involvement: 'Backend',
    funFact: 'Aspiring software engineer particularly interested working with the backend. My wildest dream would be to see Arsenal win the Champions League.',
    in: 'https://www.linkedin.com/in/matthew-liu-cs/',
    gh: 'https://github.com/matth3wliuu',
    photo: 'https://electralink.com/wp-content/uploads/2015/12/leadership-profile.png',
  },
  {
    name: 'Sunny Wang',
    title: '2022 Subcomittee Member',
    involvement: 'Backend',
    funFact: '// TODO: write an interesting fact about yourself 😆😆',
    in: 'https://www.linkedin.com/in/sunny-wang-033a19206/',
    gh: 'https://github.com/casio987',
    photo: 'https://electralink.com/wp-content/uploads/2015/12/leadership-profile.png',
  },
  {
    name: 'Sam Yu',
    title: '2022 Subcomittee Member',
    involvement: 'Frontend',
    funFact: 'Hello! When I am not doing work for university or Jobs Board I like to either go out and play badminton with my local club or spend my time watching netflix.',
    in: 'https://www.linkedin.com/in/jihaoy/',
    gh: 'https://github.com/samyu1204',
    photo: 'https://electralink.com/wp-content/uploads/2015/12/leadership-profile.png',
  },
  {
    name: 'Avijit Prasad',
    title: '2022 Subcomittee Member',
    involvement: 'Backend',
    funFact: 'Fun Fact...',
    in: 'https://www.linkedin.com/in/avijits01/',
    gh: 'https://github.com/avijits01',
    photo: 'https://electralink.com/wp-content/uploads/2015/12/leadership-profile.png',
  },
];

onMounted(() => {
  // Change the page title
  document.title = useRoute().meta.title;
});
</script>

<style scoped lang="scss">
.interestBox {
  border-top: 10px solid rgba(0, 117, 255, 0.5);
}
</style>
