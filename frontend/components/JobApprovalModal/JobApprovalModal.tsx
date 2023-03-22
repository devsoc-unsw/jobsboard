import React from 'react';

import Modal from 'components/Modal/Modal';

type JobApprovalModal = {
    open: boolean;
    onClose(): void;
  };

const JobApprovalModal = ({open, onClose}: JobApprovalModal) => {
    return (
        <Modal open = {open}>
            
        </Modal>

    );
}