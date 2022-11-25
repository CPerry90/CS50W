import React, { useEffect } from "react";
import { operatorRoot } from "./operator";

export function OperatorDetails(props) {
    const [op, setOp] = React.useState([]);
    useEffect(() => {
        fetch("api/user_details", {
            method: "POST",
            body: JSON.stringify({
                id: "",
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                setOp(data.user);
            });
    }, []);
    return (
        <>
            <div className="client-details-container">
                <div className="row no-margin">
                    <h2 className="mr-2">
                        {op.last_name}, {op.first_name}
                    </h2>
                    <EditUserButton user={op} />
                </div>
                <p className="cap">
                    {op.phone_number}
                    <br></br>
                    {op.user_type}
                    <br></br>
                    {op.department}
                </p>
            </div>
        </>
    );
}

function EditUserButton(props) {
    return (
        <div className="hover">
            <i
                onClick={() => editUser(props.user)}
                className="pointer fa-regular fa-pen-to-square"></i>
        </div>
    );
}

function editUser(props) {
    operatorRoot.render(<EditUserDiv op={props} />);
}

function EditUserDiv(props) {
    const [state, setState] = React.useState({
        first_name: props.op.first_name,
        last_name: props.op.last_name,
        email: props.op.email,
        phone_number: props.op.phone_number,
        address_1: props.op.address_1,
        address_2: props.op.address_2,
        city: props.op.city,
        county: props.op.county,
        postcode: props.op.postcode,
    });
    function handleChange(evt) {
        const value = evt.target.value;
        setState({
            ...state,
            [evt.target.name]: value,
        });
    }
    function submitClient(evt) {
        evt.preventDefault();
        fetch("api/edit_client", {
            method: "POST",
            body: JSON.stringify({
                id: props.op.id,
                first_name: state.first_name,
                last_name: state.last_name,
                email: state.email,
                phone_number: state.phone_number,
                address_1: state.address_1,
                address_2: state.address_2,
                city: state.city,
                county: state.county,
                postcode: state.postcode,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                location.reload();
            });
    }
    return (
        <div className="client-details-container" id="">
            <div id="form">
                <form onSubmit={submitClient}>
                    <div>
                        <input
                            type="text"
                            placeholder="First Name"
                            name="first_name"
                            value={state.first_name}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <input
                            type="text"
                            placeholder="Last Name"
                            name="last_name"
                            value={state.last_name}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <input
                            type="text"
                            name="email"
                            placeholder="Email"
                            value={state.email}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <input
                            type="text"
                            placeholder="Phone Number"
                            name="phone_number"
                            value={state.phone_number}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <input
                            type="text"
                            name="address_1"
                            placeholder="Address Line 1"
                            value={state.address_1}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <input
                            type="text"
                            name="address_2"
                            placeholder="Address Line 2"
                            value={state.address_2}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <input
                            type="text"
                            name="city"
                            placeholder="City"
                            value={state.city}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <input
                            type="text"
                            name="county"
                            placeholder="County"
                            value={state.county}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <input
                            type="text"
                            name="postcode"
                            placeholder="Postcode"
                            value={state.postcode}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="text-right">
                        <button
                            type="submit"
                            id="completed-task"
                            className="savebutton">
                            <i className="fa-solid fa-2x fa-floppy-disk"></i>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
