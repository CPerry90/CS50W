import React from "react";
import { ClientDetails } from "./clientDetails";
import { Orders } from "../components/clientOrders";
import { orderListRoot } from "../components/roots";
import { clientRoot, root } from "./callhandler";
import { ClientSearch } from "./clientSearch";
export function Close(props) {
    function close() {
        document.getElementById("user-details").classList.remove("hide-m");
        root.render(<ClientSearch />);
    }
    return (
        <i
            onClick={close}
            className="float-right fa-regular fa-2x fa-circle-xmark pointer"></i>
    );
}

export function NewClientDiv(props) {
    document.getElementById("user-details").classList.add("hide-m");
    const [state, setState] = React.useState({
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        address_1: "",
        address_2: "",
        city: "",
        county: "",
        postcode: "",
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
        document.getElementById("search-main").style.display = "none";
        fetch("api/new_client", {
            method: "POST",
            body: JSON.stringify({
                first_name: state.first_name,
                last_name: state.last_name,
                email: state.email,
                phone_number: state.phone_number,
                address_1: state.address_1,
                address_2: state.address_2,
                city: state.city,
                county: state.county,
                postcode: state.postcode,
                password: Math.random().toString(36).slice(2, 10),
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data.client);
                clientRoot.render(
                    <ClientDetails
                        client={data.client}
                        newClient="True"
                        password={data.password}
                    />
                );
                orderListRoot.render(
                    <Orders isShow="True" user={data.client.id} />
                );
                document.getElementById("main").style.display = "block";
            });
    }
    return (
        <div className="row client-row new-client fade-in" id="">
            <div className="col-md-12" id="form">
                <Close />
                <form onSubmit={submitClient}>
                    <div>
                        <input
                            type="text"
                            placeholder="First Name"
                            required="True"
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
                            required="True"
                            value={state.last_name}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <input
                            type="email"
                            name="email"
                            required="True"
                            placeholder="Email"
                            value={state.email}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <input
                            type="tel"
                            pattern="[0-9]{11}"
                            onInvalid={(e) =>
                                e.target.setCustomValidity(
                                    "Enter 11 digit phone number starting with 0"
                                )
                            }
                            onInput={(e) => e.target.setCustomValidity("")}
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
                            required="True"
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
                            required="True"
                            placeholder="City"
                            value={state.city}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <input
                            type="text"
                            name="county"
                            required="True"
                            placeholder="County"
                            value={state.county}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <input
                            type="text"
                            name="postcode"
                            required="True"
                            placeholder="Postcode"
                            value={state.postcode}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <button
                            type="submit"
                            id="completed-task"
                            className="savebutton">
                            <strong className="mt-2">Submit </strong>
                            <i className="fa-solid fa-arrow-right-to-bracket"></i>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
