import React from 'react';
import ReactDOM from 'react-dom';
import { RootState } from '../../store';
import { useAppDispatch, useAppSelector } from '../../store/hook';
import { hide, showWithComponent } from '../../store/Modal/slice';
import {
  Overlay,
  Modal,
  ModalHeader,
  CloseButton,
  None,
} from './ModalElements';

export const RootModal = () => {
  const modalRoot = document.getElementById('modal-root') as HTMLElement;
  const { isShown, component } = useAppSelector(
    (state: RootState) => state.modal
  );

  const dispatch = useAppDispatch();

  return !isShown ? (
    <None />
  ) : (
    ReactDOM.createPortal(
      <>
        <Overlay />
        <Modal>
          <ModalHeader>
            <CloseButton
              onClick={() => {
                dispatch(hide());
              }}
            >
              X
            </CloseButton>
          </ModalHeader>
          {component}
        </Modal>
      </>,
      modalRoot
    )
  );
};
