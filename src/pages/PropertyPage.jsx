import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css"


function PropertyPage() {
    const { id } = useParams();
    const [property, setProperty] = useState(undefined);
    // const property = properties.find(p => p.id === Number(id));
    const [mainImage, setMainImage] = useState("");

    // if (!property) {
    //     return <h2>Property not found</h2>;
    // }

    useEffect(() => {
        fetch(`${import.meta.env.BASE_URL}properties.json`)
            .then((response) => response.json())
            .then((data) => {
                const found = data.properties.find(
                    p => p.id === Number(id)
                );
                setProperty(found || null);

            })
            .catch(err => {
                console.error(err);
                setProperty(null);
            });
                // setProperty(found);
                // setMainImage(found?.images[0]);
    

    }, [id]);

    // * Still loading
    if (property === undefined) {
        return <p>Loading property...</p>
    }

    // * Loaded but not found
    if (property === null) {
        return <h2>Property not found</h2>
    }

    return (
        <div>
            <h1>{property.title}</h1>

            {/* Main Image */}
            <img 
                src={`${import.meta.env.BASE_URL}${mainImage}`} 
                alt={property.title}
                style={{ width: "100%", maxWidth: "600px",}} 
            />

            {/* Thumbnails */}
            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                {property.images.map((image, index) => (
                    <img
                        key={index}
                        src={`${import.meta.env.BASE_URL}${image}`}
                        alt="Thumbnail"
                        style={{ 
                            width: "80px", 
                            cursor: "pointer",
                            border: image === mainImage ? "2px solid black" : "none"
                        }}
                        onClick={() => setMainImage(image)}
                    />
                ))}
            </div>

            {/* Property Tabs */}
            <Tabs style={{ marginTop: "20px" }}>
                <TabList>
                    <Tab>Description</Tab>
                    <Tab>Floor Plan</Tab>
                    <Tab>Map</Tab>
                </TabList>

                <TabPanel>
                    <p>{property.description}</p>
                </TabPanel>

                <TabPanel>
                    <img
                        src={`${import.meta.env.BASE_URL}${property.floorPlan}`}
                        alt="Floor plan"
                        style={{ width: "100%", maxWidth: "500px" }}
                    />
                </TabPanel>

                <TabPanel>
                    <iframe
                        title="Property location"
                        width="100%"
                        height="300"
                        loading="lazy"
                        src={`https://www.google.com/maps?q=${property.coordinates.lat},${property.lng}&output=embed`}
                    />
                </TabPanel>
            </Tabs>

            <p><strong>Price:</strong> ${property.price.toLocaleString()}</p>
            <p><strong>Location:</strong> {property.location}</p>
        </div>
    );
}

export default PropertyPage;