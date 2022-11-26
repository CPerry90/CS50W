import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import { CallHandlerDetails } from "./clientSearch";
import { clientRoot, userRoot } from "./callhandler";
import { NewOrderDiv } from "../components/newOrder";
import { Exit } from "../components/buttons";

export function ClientDetails(props) {
    const [client, setClient] = React.useState([]);
    useEffect(() => {
        fetch("api/user_details", {
            method: "POST",
            body: JSON.stringify({
                id: props.client.id,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.msg) {
                    console.log(data.msg);
                } else {
                    setClient(data.user);
                }
            });
    }, []);
    return (
        <>
            <div className="client-details-container fade-in">
                <div className="row no-margin">
                    <h2 className="mr-2">
                        {client.last_name}, {client.first_name}
                    </h2>
                    <EditUserButton user={client} />
                </div>
                <p>{client.email}</p>
                <p>{client.phone_number}</p>
                <p className="cap">{client.address_1}</p>
                <p className="cap">{client.city}</p>
                <p className="cap">{client.county}</p>
                <p>{client.postcode}</p>
                <NewOrderButton client={client} />
                <Exit />
                {(() => {
                    if (props.newClient == "True") {
                        return (
                            <>
                                <h4 className="tmp">Temporary Password</h4>
                                <h5 className="text-center">
                                    {props.password}
                                </h5>
                            </>
                        );
                    }
                })()}
                <div id="selectDiv"></div>
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

export function NewOrderButton(props) {
    function clickHandler() {
        let root = createRoot(document.getElementById("selectDiv"));
        document.getElementById("order-details").style.display = "block";
        root.render(<NewOrderDiv props={props} root={root} />);
    }
    return (
        <div onClick={clickHandler} className="hover pointer my-3">
            <h3>
                New Order <i className="fa-solid fa-square-arrow-up-right"></i>
            </h3>
        </div>
    );
}

export function editUser(props) {
    if (props.ch == "True") {
        userRoot.render(<EditUserDiv client={props.user} ch="True" />);
    } else {
        clientRoot.render(<EditUserDiv client={props} />);
    }
}

function EditUserDiv(props) {
    const [state, setState] = React.useState({
        first_name: props.client.first_name,
        last_name: props.client.last_name,
        email: props.client.email,
        phone_number: props.client.phone_number,
        address_1: props.client.address_1,
        address_2: props.client.address_2,
        city: props.client.city,
        county: props.client.county,
        postcode: props.client.postcode,
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
                id: props.client.id,
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
                if (props.ch == "True") {
                    userRoot.render(<CallHandlerDetails ch="True" />);
                } else {
                    clientRoot.render(<ClientDetails client={data.client} />);
                }
            });
    }
    return (
        <div className="client-details-container" id="">
            <div id="form" className="fade-in">
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
