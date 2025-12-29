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

            <div className="property-list">
                {properties.map(property => (
                    <div className="property-card" key={property.id}>

                        {/* Property image */}
                        <img
                            src={`${import.meta.env.BASE_URL}${property.images[0]}`}
                            alt={property.title}
                            className="property-image"
                        />

                        {/* Property info */}
                        <div className="property-info">
                            <h3>{property.title}</h3>
                            <p><strong>Price:</strong> £{property.price.toLocaleString()}</p>
                            <p><strong>Location:</strong> {property.location}</p>
                        
                            <Link to={`/property/${property.id}`} className="view-button">
                                View Details
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SearchPage;
