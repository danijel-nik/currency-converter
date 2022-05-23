import React, {useContext} from 'react';
import { Modal, Button } from 'react-materialize';
import {GlobalContext} from '../context/GlobalState';

const ModalMessage = (props) => {
    const context = useContext(GlobalContext);

    return (
        (context.store.modalOpened) ?
            <Modal
                actions={[
                    <Button flat modal="close" node="button" waves="green" onClick={context.closeModal}>{context.store.modalCloseTxt}</Button>
                ]}
                bottomSheet={false}
                fixedFooter={false}
                header={context.store.modalHeader}
                id="modal-0"
                options={{
                    dismissible: true,
                    startingTop: '4%',
                    endingTop: '10%',
                    inDuration: 250,
                    onCloseEnd: context.closeModal,
                    onCloseStart: null,
                    onOpenEnd: null,
                    onOpenStart: null,
                    opacity: 0.5,
                    outDuration: 250,
                    preventScrolling: true
                }}
                open={context.store.modalOpened}>
                <p>
                    {context.store.modalContent}
                </p>
            </Modal> : ""
    )   
}

export default ModalMessage;