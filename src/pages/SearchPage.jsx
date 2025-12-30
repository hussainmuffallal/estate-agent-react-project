import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

function SearchPage() {
    const [properties, setProperties] = useState([]);
    const [filters, setFilters] = useState({
        type: "all",
        minBedrooms: 0,
        maxBedrooms: 100,
        minPrice: 0,
        maxPrice: 10000000
    });

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

    const filteredProperties = properties.filter((property) => {
        return (
            (filters.type === "all" || property.type === filters.type) &&
            
            property.bedrooms >= filters.minBedrooms &&
            property.bedrooms <= filters.maxBedrooms &&
            
            property.price >= filters.minPrice &&
            property.price <= filters.maxPrice
        );
    });

    return (
        <div>
            <h1>Search Page</h1>

            {/* Filters */}
            <div className="filters">
                <select
                    value={filters.type}
                    onChange={(e) =>
                        setFilters({ ...filters, type: e.target.value })
                    }
                >
                    <option value="all">All Types</option>
                    <option value="house">House</option>
                    <option value="flat">Flat</option>
                </select>

                <input
                    type="number"
                    placeholder="Min bedrooms"
                    onChange={(e) =>
                        setFilters({ ...filters, minBedrooms: Number(e.target.value) })
                    }
                />

                <input
                    type="number"
                    placeholder="Max bedrooms"
                    onChange={(e) =>
                        setFilters({ ...filters, maxBedrooms: Number(e.target.value) })
                    }
                />

                <input
                    type="number"
                    placeholder="Min price"
                    onChange={(e) =>
                        setFilters({ ...filters, minPrice: Number(e.target.value) })
                    }
                />

                <input
                    type="number"
                    placeholder="Max price"
                    onChange={(e) =>
                        setFilters({ ...filters, maxPrice: Number(e.target.value) })
                    }
                />
            </div>
            
            {/* Property list */}
            <div className="property-list">
                {filteredProperties.map(property => (
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
