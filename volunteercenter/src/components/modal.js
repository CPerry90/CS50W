import React from "react";
import Modal from "react-modal";
import { DeleteOrder } from "./orderDetails";

const customStyles = {
    content: {
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        marginRight: "-50%",
        transform: "translate(-50%, -50%)",
    },
};

// Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement("#delete-modal");

export function DeleteModal(props) {
    let subtitle;
    const [modalIsOpen, setIsOpen] = React.useState(false);

    function openModal() {
        setIsOpen(true);
    }

    function afterOpenModal() {
        // references are now sync'd and can be accessed.
        subtitle.style.color = "#1a2d40";
    }

    function closeModal() {
        setIsOpen(false);
    }

    return (
        <div>
            <i
                onClick={openModal}
                className="fa-regular fa-2x fa-trash-can pointer"></i>

            <Modal
                isOpen={modalIsOpen}
                onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Delete"
                className="Modal"
                overlayClassName="Overlay">
                <h2 ref={(_subtitle) => (subtitle = _subtitle)}>
                    Are you sure you want to delete this order?
                </h2>
                <p className="mb-3">
                    Deleting this order will make it inaccessible and cannot be
                    undone.
                </p>
                <i
                    onClick={closeModal}
                    className="mr-2 red fa-solid fa-2x fa-xmark pointer"></i>
                <DeleteOrder order={props.order} user={props.user} />
            </Modal>
        </div>
    );
}
