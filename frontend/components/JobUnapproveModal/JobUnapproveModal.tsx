import React from 'react';

type JobUnapproveModal = {
    open: boolean;
    role: string;
    company: string;
    onConfirm(e: React.MouseEvent<HTMLButtonElement>): void;
    onCancel(): void;
  };

  const JobUnapproveModal = ({ open, role, company, onConfirm, onCancel }: JobUnapproveModal) => {
    return open ? (
      <div>
        {/* <!-- Modal backdrop --> */}
        <div className="opacity-25 fixed inset-0 z-40 bg-black" />
        {/* <!-- Modal --> */}
        <div
          tabIndex={-1}
          className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
        >
          <div className="relative p-4 w-1/2 mx-auto max-w-full">
            {/* <!-- Modal content --> */}
            <div className="relative rounded-lg bg-white text-jb-subheadings">
              {/* <!-- Modal header --> */}
              <div className="flex flex-col justify-between items-left p-5 rounded-t border-b border-gray-600">
                <h2 className="text-xl text-left mb-4 text-jb-headings font-bold">{role} at <span className="text-jb-subheadings">{company}</span></h2>
              </div>
              {/* <!-- Modal body --> */}
              <div className="flex w-full p-6">
                <div className="text-lg font-medium text-left">
                  Confirm unapproval of
                  <span className="text-jb-textlink font-bold"> {role} at {company}</span>? Keep in mind that this
                  action cannot be undone.
                </div>
              </div>
              {/* <!-- Modal footer --> */}
              <div className="flex flex-row justify-between p-6 space-x-2 rounded-b border-t border-gray-600">
                <div>
                  <button
                    type="button"
                    className="bg-jb-textlink rounded-md text-white font-bold text-base border-0 px-6 py-2 shadow-md duration-200 ease-linear cursor-pointer hover:bg-jb-btn-hovered hover:shadow-md-hovered"
                    onClick={onCancel}
                  >
                    Cancel
                  </button>
                </div>
                <div>
                  <button
                    type="button"
                    className="bg-jb-textlink rounded-md text-white font-bold text-base border-0 px-6 py-2 shadow-md duration-200 ease-linear cursor-pointer hover:bg-jb-btn-hovered hover:shadow-md-hovered"
                    onClick={onConfirm}
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ) : null;
  };

  export default JobUnapproveModal;