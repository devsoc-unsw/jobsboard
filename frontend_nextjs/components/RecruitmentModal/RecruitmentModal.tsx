import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Modal from 'components/Modal/Modal';
import React from 'react';

type RecruitmentModalProps = {
  open: boolean;
  onClose(): void;
};

const RecruitmentModal = ({ open, onClose }: RecruitmentModalProps) => {
  return (
    <Modal open={open}>
      <div className="relative bg-white rounded-lg shadow dark:bg-gray-700 max-h-[80%] my-auto overflow-auto">
        {/* <!-- Modal header --> */}
        <div className="flex justify-between items-center p-5 rounded-t border-b dark:border-gray-600">
          <h2 className="text-xl font-bold text-jb-headings dark:text-white">
            Are you looking to get involved?
          </h2>
          <button
            type="button"
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
            onClick={onClose}
          >
            <FontAwesomeIcon icon={faXmark} size="2x" />
          </button>
        </div>
        {/* <!-- Modal body --> */}
        <div className="flex items-start flex-col p-6 space-y-6 text-jb-subheadings text-lg text-justify">
          <p>
            Here at Jobs Board, we pride ourselves on our great work ethic, teamwork and
            camaraderie. Some of our members have even gone on to work for companies such as Canva
            and Optiver! As such, we are always on the look out for keen-minded individuals who are
            as passionate about the project as we are. If you have experience in the following, do
            consider applying.
          </p>
          <div className="flex w-full justify-center gap-28 py-5">
            <div>
              <p className="font-bold text-jb-headings text-xl">Frontend</p>
              <ul className="text-left ml-5">
                <li>VueJS</li>
                <li>Tailwind CSS</li>
                <li>TypeScript</li>
              </ul>
            </div>
            <div>
              <p className="font-bold text-jb-headings text-xl">Backend</p>
              <ul className="text-left ml-5">
                <li>TypeScript</li>
                <li>PostgreSQL</li>
              </ul>
            </div>
          </div>
          <p>
            Additionally, if you have prior experience writing unit tests using Jest, end-to-end
            testing using Cypress, Docker or Kubernetes, that would be a bonus.
          </p>
          <p>
            If you are looking for a frontend role, you are required to complete the Vue Frontend
            Assessment, which can be found&nbsp;
            <a
              className="text-jb-textlink font-bold transition-colors duration-200 ease-linear
                  cursor-pointer hover:text-jb-textlink-hovered"
              href="https://github.com/csesoc/vue-frontend-assessment"
              target="_blank"
              rel="noreferrer"
            >
              here
            </a>
            &nbsp;and provide a link to your repository in the application.
          </p>

          <div>
            <p className="font-bold text-center bg-yellow-300 p-3 rounded-md mt-2">
              Unfortunately, we are not accepting applications at the moment. But don&apos;t worry
              as Projects does rolling recruitment so check back again later.
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default RecruitmentModal;
