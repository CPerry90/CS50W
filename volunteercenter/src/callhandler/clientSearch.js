import React, { useEffect } from "react";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import { ClientDetails, editUser } from "./clientDetails";
import { Orders } from "../components/clientOrders";
import { Exit } from "../components/buttons";
import {
    clientRoot,
    orderListRoot,
    root,
    navRoot1,
    navRoot2,
} from "./callhandler";
import { NewClientDiv } from "./newClient";
import { NewOrderButton } from "./clientDetails";

export function CallHandlerDetails(props) {
    const [user, setUser] = React.useState([]);
    useEffect(() => {
        fetch("api/user_details", {
            method: "POST",
            body: JSON.stringify({
                id: "",
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                setUser(data.user);
                document
                    .getElementById("user-details")
                    .classList.replace("d-none", "fade-in");
            });
    }, []);
    return (
        <>
            <div className="client-details-container fade-in">
                <div className="row no-margin">
                    <h2 className="mr-2">
                        {user.last_name}, {user.first_name}
                    </h2>
                    <EditUserButton user={user} ch={props.ch} />
                </div>
                <p>{user.email}</p>
                <p>{user.phone_number}</p>
                <p className="cap">{user.address_1}</p>
                <p className="cap">{user.city}</p>
                <p className="cap">{user.county}</p>
                <p>{user.postcode}</p>
            </div>
        </>
    );
}

export function ClientSearch() {
    const [result, setResult] = React.useState([]);
    useEffect(() => {
        fetch("api/client_search", {
            method: "POST",
        })
            .then((response) => response.json())
            .then((data) => {
                setResult(data.clients);
            });
    }, []);
    const handleOnSearch = (string, results) => {};
    const handleOnHover = (result) => {};
    const handleOnSelect = (item) => {
        navRoot1.render(<NewOrderButton />);
        navRoot2.render(<Exit />);
        document.getElementById("search-main").style.display = "none";
        clientRoot.render(<ClientDetails client={item} />);
        orderListRoot.render(<Orders isShow="True" user={item.id} />);
        document.getElementById("main").style.display = "block";
    };
    const handleOnFocus = () => {};
    const formatResult = (item) => {
        return (
            <>
                <span
                    style={{
                        display: "block",
                        textAlign: "left",
                        cursor: "pointer",
                    }}>
                    {item.first_name +
                        ", " +
                        item.last_name +
                        " | " +
                        item.address_1 +
                        ", " +
                        item.postcode}
                </span>
            </>
        );
    };
    return (
        <div className="text-center fade-in">
            <h3>Search for clients...</h3>
            <header className="search-header">
                <ReactSearchAutocomplete
                    items={result}
                    onSearch={handleOnSearch}
                    onHover={handleOnHover}
                    onSelect={handleOnSelect}
                    onFocus={handleOnFocus}
                    autoFocus
                    formatResult={formatResult}
                    placeholder="Search..."
                    fuseOptions={{
                        keys: ["first_name", "last_name", "postcode"],
                        minMatchCharLength: 3,
                    }}
                    resultStringKeyName="first_name"
                />
            </header>
            <AddClientButton />
        </div>
    );
}

function AddClientButton(props) {
    const clickHandler = (event) => {
        scrollTo({ top: 210, behavior: "smooth" });
        root.render(<NewClientDiv />);
    };
    return (
        <div onClick={clickHandler} className="hover d-flex mt-3">
            <i className="mr-2 ml-auto fa-solid fa-2x fa-plus"></i>
            <h4 className="mr-auto">New Client</h4>
        </div>
    );
}

export function EditUserButton(props) {
    return (
        <div className="hover">
            <i
                onClick={() => editUser(props)}
                className="float-right pointer fa-regular fa-pen-to-square"></i>
        </div>
    );
}
