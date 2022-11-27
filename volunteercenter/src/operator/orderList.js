import React, { useEffect } from "react";
import { Order } from "./listDisplay";

function NoOrder(props) {
    return (
        <>
            <h4 className="my-4">{props.text}</h4>
        </>
    );
}

export function OrderList(props) {
    if (props.isShow == "True") {
        const [recievedOpen, setRecievedOpen] = React.useState([]);
        const [processingOpen, setProcessingOpen] = React.useState([]);
        const [acceptedAssigned, setAcceptedAssigned] = React.useState([]);
        const [fulfilled, setFulfilled] = React.useState([]);
        const [openCount, setOpenCount] = React.useState(0);
        const [assignedCount, setAssignedCount] = React.useState(0);

        useEffect(() => {
            fetch(`api/op_orders`, {
                method: "POST",
            })
                .then((response) => response.json())
                .then((data) => {
                    setRecievedOpen(data.recieved_open);
                    setProcessingOpen(data.processing_open);
                    setAcceptedAssigned(data.accepted_assigned);
                    setFulfilled(data.fulfilled_assigned);
                    setAssignedCount(data.accepted_assigned.length);
                    setOpenCount(
                        data.recieved_open.length + data.processing_open.length
                    );
                });
        }, []);
        if (props.isAssigned == "False") {
            return (
                <div className="orders-container">
                    <ListView
                        recieved_open={recievedOpen}
                        processing_open={processingOpen}
                        isAssigned={props.isAssigned}
                        count={assignedCount}
                    />
                </div>
            );
        } else if (props.isAssigned == "True") {
            return (
                <div className="orders-container">
                    <ListView
                        accepted_assigned={acceptedAssigned}
                        fulfilled_assigned={fulfilled}
                        isAssigned={props.isAssigned}
                        count={openCount}
                    />
                </div>
            );
        }
    }
}
export function UnasignedDisplayButton(props) {
    function ChangeView() {
        document.getElementById("operator-orders").style.display = "none";
        document.getElementById("available-orders").style.display = "block";
    }
    return (
        <div className="pointer hover link row no-margin" onClick={ChangeView}>
            <h6 className="mr-2 mt-auto">Unasigned Orders</h6>
            <i className="fa-solid fa-2x fa-arrow-right"></i>
        </div>
    );
}

export function OrderDisplayButton(props) {
    function ChangeView() {
        document.getElementById("operator-orders").style.display = "block";
        document.getElementById("available-orders").style.display = "none";
    }
    return (
        <div className="pointer hover link row no-margin" onClick={ChangeView}>
            <i className="fa-solid fa-2x fa-arrow-left"></i>
            <h6 className="ml-2 mt-auto">Your Orders</h6>
        </div>
    );
}

export function ListView(props) {
    return (
        <div className="my-3 detail-list no-margin row d-block">
            {(() => {
                if (props.isAssigned == "True") {
                    return (
                        <>
                            {" "}
                            <h3>Assigned To You</h3>
                            <div className="row no-margin">
                                <h6 className="mr-2 mt-auto">
                                    ({props.count})
                                </h6>
                                <UnasignedDisplayButton
                                    count={
                                        props.count
                                    }></UnasignedDisplayButton>
                            </div>
                        </>
                    );
                } else {
                    return (
                        <>
                            <h3>Unassigned Orders</h3>
                            <div className="row no-margin">
                                <OrderDisplayButton count={props.count} />
                                <h6 className="ml-2 mt-auto">
                                    ({props.count})
                                </h6>
                            </div>
                        </>
                    );
                }
            })()}
            {(() => {
                if (props.recieved_open) {
                    if (props.recieved_open.length > 0) {
                        return (
                            <>
                                <h4 className="my-4">New Orders</h4>
                                <Order
                                    isAssigned={props.isAssigned}
                                    order={props.recieved_open}
                                />
                            </>
                        );
                    } else {
                        return <NoOrder text="No New Orders" />;
                    }
                }
            })()}
            {(() => {
                if (props.processing_open) {
                    if (props.processing_open.length > 0) {
                        return (
                            <>
                                <h4 className="my-4">Processing</h4>
                                <Order
                                    isAssigned={props.isAssigned}
                                    order={props.processing_open}
                                />
                            </>
                        );
                    } else {
                        return <NoOrder text="" />;
                    }
                }
            })()}
            {(() => {
                if (
                    props.accepted_assigned &&
                    props.accepted_assigned.length > 0
                ) {
                    return (
                        <>
                            <h4 className="my-4">Accepted</h4>
                            <Order
                                isAssigned={props.isAssigned}
                                order={props.accepted_assigned}
                            />
                        </>
                    );
                }
            })()}
            {(() => {
                if (props.fulfilled_assigned) {
                    if (props.fulfilled_assigned.length > 0) {
                        return (
                            <>
                                <h4 className="my-4">Fulfilled</h4>
                                <Order
                                    isAssigned={props.isAssigned}
                                    order={props.fulfilled_assigned}
                                />
                            </>
                        );
                    } else {
                        return <NoOrder text="" />;
                    }
                }
            })()}
        </div>
    );
}
