import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Chip } from "@heroui/react";
import api from "../utils/api";

export default function ViewCustomer() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [customer, setCustomer] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchCustomer = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/clients/clients/${id}/`);
        setCustomer(response.data);
        setError(null);
      } catch (err) {
        setError("Failed to load customer data.");
      } finally {
        setLoading(false);
      }
    };
    fetchCustomer();
  }, [id]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (error)
    return (
      <div className="p-6 text-danger font-semibold">{error}</div>
    );

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded shadow-md">
      <h2 className="text-2xl font-semibold mb-6">Customer Details</h2>

      <div className="mb-4">
        <strong>Name:</strong> {customer.name || "-"}
      </div>
      <div className="mb-4">
        <strong>Industry:</strong> {customer.industry || "-"}
      </div>

      <div className="mb-4">
        <strong>Contacts:</strong>
        {customer.contacts?.length > 0 ? (
          <div className="flex flex-wrap gap-2 mt-2">
            {customer.contacts.map((contact) => (
              <Chip key={contact.id || contact.name} color="primary">
                {contact.name || contact}
              </Chip>
            ))}
          </div>
        ) : (
          <p className="text-muted mt-1">No contacts available.</p>
        )}
      </div>

      <div className="mt-6 flex gap-4">
        <Button onClick={() => navigate(`/customers/${id}/edit`)} color="primary">
          Edit
        </Button>
        <Button onClick={() => navigate("/customers")} variant="light">
          Back to List
        </Button>
      </div>
    </div>
  );
}
