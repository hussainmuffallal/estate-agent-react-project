import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

function SearchPage() {
    const [properties, setProperties] = useState([]);
    const [favourites, setFavourites] = useState([]);
    
    const [filters, setFilters] = useState({
        type: "all",
        minBedrooms: 0,
        maxBedrooms: 100,
        minPrice: 0,
        maxPrice: 10000000,
        postcode: "",
        dateFrom: "",
        dateTo: ""
    });
    const addToFavourites = (property) => {
        const alreadyAdded = favourites.some(
            fav => fav.id === property.id
        );

        if (!alreadyAdded) {
            setFavourites([...favourites, property]);
        }
    };

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

    useEffect(() => {
        const storedFavourites = JSON.parse(localStorage.getItem("favourites")) || []
        setFavourites(storedFavourites);
    }, []);

    const filteredProperties = properties.filter((property) => {
        const propertyDate = new Date(property.dateAdded);

        const fromDateValid = 
            filters.dateFrom === "" ||
            propertyDate >= new Date(filters.dateFrom);

        const toDateValid =
            filters.dateTo === "" ||
            propertyDate <= new Date(filters.dateTo);

        return (
            (filters.type === "all" || property.type === filters.type) &&
            
            property.bedrooms >= filters.minBedrooms &&
            property.bedrooms <= filters.maxBedrooms &&
            
            property.price >= filters.minPrice &&
            property.price <= filters.maxPrice &&

            (filters.postcode === "" || property.postcode.startsWith(filters.postcode)) &&

            fromDateValid &&
            toDateValid
        );
    });

    return (
        <div>
            <h1>Search Page</h1>

            <div className="page-layout">
                {/* Main Content */}
                <div className="results-section">
                    
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
                            type="text"
                            placeholder="Postcode area (e.g. BR5)"
                            value={filters.postcode}
                            onChange={(e) =>
                                setFilters({ ...filters, postcode: e.target.value.toUpperCase() })
                            }
                        />

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

                        <input
                            type="date"
                            value={filters.dateFrom}
                            onChange={(e) =>
                                setFilters({ ...filters, dateFrom: e.target.value })
                            }
                        />

                        <input
                            type="date"
                            value={filters.dateTo}
                            onChange={(e) =>
                                setFilters({ ...filters, dateTo: e.target.value })
                            }
                        />

                        
                    </div>
                    
                    {/* Property list */}
                    <div className="property-list">
                        {filteredProperties.map(property => (
                            <div 
                                className="property-card" 
                                key={property.id}
                                draggable
                                onDragStart={(e) =>
                                    e.dataTransfer.setData(
                                        "property",
                                        JSON.stringify(property)
                                    )
                                }
                            >

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

                                    <button
                                        onClick={() => addToFavourites(property)}
                                        className="favourite-button"
                                    >
                                        ❤️ Add to favourites
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Favourites Sidebar */}
                <aside 
                    className="favourites-sidebar"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                        const droppedProperty = JSON.parse(
                            e.dataTransfer.getData("property")
                        );

                        setFavourites(prev => {
                            if (prev.find(item => item.id === droppedProperty.id)) {
                                return prev; // prevent duplicates
                            }
                            return [...prev, droppedProperty];
                        });
                    }}
                >
                    <h2>Favourites</h2>

                    {favourites.length === 0 ? (
                        <p>No favourites yet</p>
                    ) : (
                        <>
                            {favourites.map(property => (
                                <div 
                                    key={property.id} 
                                    className="favourites-item"
                                    draggable
                                    onDragStart={(e) => {
                                        e.dataTransfer.setData(
                                            "property",
                                            JSON.stringify(property)
                                        );
                                    }}
                                >
                                    <p>{property.title}</p>
                                    <p>£{property.price.toLocaleString()}</p>

                                    <button
                                        onClick={() =>
                                            setFavourites(
                                                favourites.filter(item => item.id !== property.id)
                                            )
                                        }
                                    >
                                        ❌ Remove
                                    </button>
                                </div>
                            ))}

                            {/* Clear all favourites */}
                            <button
                                onClick={() => setFavourites([])}
                                style={{ marginTop: "10px" }}
                            >
                                Clear favourites
                            </button>
                        </>
                    )}
                    <div 
                        className="remove-zone"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                            e.preventDefault();
                            e.stopPropagation(); // The fix

                            const droppedProperty = JSON.parse(
                                e.dataTransfer.getData("property")
                            );

                            setFavourites(
                                favourites.filter(
                                    item => item.id !== droppedProperty.id
                                )
                            );
                        }}
                    >
                        🗑️ Drag here to remove
                    </div>
                </aside>
            </div>
        </div>
    );
}

export default SearchPage;
