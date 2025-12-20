import { useParams } from "react-router-dom";

function PropertyPage() {
    const { id } = useParams();
    const property = properties.find(p => p.id === Number(id));

    if (!property) {
        return <h2>Property not found</h2>;
    }

    return (
        <div>
            <h1>{property.title}</h1>
            <p>${property.price}</p>
            <p>{property.location}</p>
        </div>
    );
}

export default PropertyPage;