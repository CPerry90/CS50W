import { createRoot } from 'react-dom/client'
import React, {useEffect } from 'react'

document.addEventListener("DOMContentLoaded", function () {
});

function Search_clients(){
    var [result, setResult] = React.useState([]);

    useEffect(()=> {
        fetch("/client_search", {
            method: "GET"
        })
        .then((response) => response.json())
        .then(data => {
            setResult(data.clients)
            console.log(data.clients.username)
        });
    }, [])
    return (
        <div>
        <input type="text" name="city" list="cityname"></input>
            <datalist id="cityname">
            {result.map(client => 
                {   
                    return(
                        <option key={client.username} value={client.username}>{client.username}, {client.id}</option>
                    )
                }
            )}
            </datalist>
        </div>
    )
}



createRoot(document.getElementById('app')).render(<Search_clients />)


