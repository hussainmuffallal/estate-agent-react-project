import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

function SearchPage() {
    const [properties, setProperties] = useState([]);

    useEffect(() => {
        fetch(`${import.meta.env.BASE_URL}properties.json`)
            .then((response) => response.json())
            .then((data) => {
                setProperties(data.properties);
                console.log("Loaded properties:", data.properties);
            })
            .catch((error) => {
                console.error("Error fetching properties:", error);
            });
    }, []);

    return (
        <div>
            <h1>Search Page</h1>

            <ul>
                {properties.map((property) => (
                    <li key={property.id}>
                        <h3>
                            <Link to={`/property/${property.id}`}>
                                {property.title}
                            </Link>
                        </h3>
                        <p>Type: {property.type}</p>
                        <p>Price: ${property.price.toLocaleString()}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default SearchPage;
