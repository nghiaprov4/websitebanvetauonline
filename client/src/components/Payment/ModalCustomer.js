import { Modal, Button } from "antd";
import { useState } from "react";

const ModalCustomer = ({ visible, handleOk, handleCancel, content }) => {
    const { data } = content;
    return (
        <div>
            <Modal visible={visible} onOk={handleOk} onCancel={handleCancel}>
                <p>{data}</p>
            </Modal>
        </div>
    );
};

export default ModalCustomer;
