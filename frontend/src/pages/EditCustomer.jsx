import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Input,
  Button,
  Chip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import { FaPlus, FaTrash, FaPencil } from "react-icons/fa6";
import api from "../utils/api";

export default function EditCustomer() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [customer, setCustomer] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState(null);

  // Form state
  const [name, setName] = React.useState("");
  const [industry, setIndustry] = React.useState("");
  const [contacts, setContacts] = React.useState([]);

  // Modal for adding/editing contact
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editingContact, setEditingContact] = React.useState(null);
  const [contactName, setContactName] = React.useState("");

  React.useEffect(() => {
    const fetchCustomer = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/clients/clients/${id}/`);
        setCustomer(response.data);
        setName(response.data.name || "");
        setIndustry(response.data.industry || "");
        setContacts(response.data.contacts || []);
      } catch (err) {
        setError("Failed to load customer data.");
      } finally {
        setLoading(false);
      }
    };
    fetchCustomer();
  }, [id]);

  const openAddContactModal = () => {
    setContactName("");
    setEditingContact(null);
    setModalOpen(true);
  };

  const openEditContactModal = (contact) => {
    setContactName(contact.name);
    setEditingContact(contact);
    setModalOpen(true);
  };

  const handleContactSave = () => {
    if (!contactName.trim()) return;
    if (editingContact) {
      // Edit existing
      setContacts((prev) =>
        prev.map((c) => (c.id === editingContact.id ? { ...c, name: contactName.trim() } : c))
      );
    } else {
      // Add new (id can be temporary negative to distinguish new)
      const newContact = { id: Date.now(), name: contactName.trim() };
      setContacts((prev) => [...prev, newContact]);
    }
    setModalOpen(false);
  };

  const handleContactDelete = (contactId) => {
    setContacts((prev) => prev.filter((c) => c.id !== contactId));
  };

  const validateForm = () => {
    if (!name.trim()) return "Name is required";
    if (!industry.trim()) return "Industry is required";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    setSaving(true);

    try {
      // Send contacts as array of objects (API should accept this)
      await api.put(`/clients/clients/${id}/`, {
        name: name.trim(),
        industry: industry.trim(),
        contacts: contacts.map(({ id, name }) => ({ id, name })),
      });
      navigate("/customers"); // back to customers list
    } catch (err) {
      setError("Failed to save customer. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (error)
    return (
      <div className="p-6 text-danger font-semibold">
        {error}
      </div>
    );

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded shadow-md">
      <h2 className="text-2xl font-semibold mb-6">Edit Customer</h2>
      {error && <div className="mb-4 text-danger font-semibold">{error}</div>}
      <form onSubmit={handleSubmit}>
        <Input
          label="Name"
          placeholder="Customer Name"
          value={name}
          onValueChange={setName}
          required
          size="md"
        />
        <Input
          label="Industry"
          placeholder="Industry"
          value={industry}
          onValueChange={setIndustry}
          required
          size="md"
          className="mt-4"
        />

        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold">Contacts</h3>
            <Button
              size="sm"
              color="primary"
              onClick={openAddContactModal}
              leftIcon={<FaPlus className="w-5 h-5" />}
            >
              Add Contact
            </Button>
          </div>

          {contacts.length === 0 && (
            <p className="text-muted">No contacts added yet.</p>
          )}

          <div className="flex flex-wrap gap-2">
            {contacts.map((contact) => (
              <Chip
                key={contact.id}
                color="primary"
                className="flex items-center gap-2"
              >
                {contact.name}
                <Button
                  size="sm"
                  variant="light"
                  color="warning"
                  onClick={() => openEditContactModal(contact)}
                  aria-label="Edit contact"
                >
                  <FaPencil className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="light"
                  color="danger"
                  onClick={() => handleContactDelete(contact.id)}
                  aria-label="Delete contact"
                >
                  <FaTrash className="w-4 h-4" />
                </Button>
              </Chip>
            ))}
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <Button
            color="primary"
            type="submit"
            isLoading={saving}
            disabled={saving}
          >
            Save Changes
          </Button>
        </div>
      </form>

      {/* Contact Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <ModalContent>
          <ModalHeader>{editingContact ? "Edit Contact" : "Add Contact"}</ModalHeader>
          <ModalBody>
            <Input
              label="Contact Name"
              placeholder="Enter contact name"
              value={contactName}
              onValueChange={setContactName}
              autoFocus
              size="md"
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button color="primary" onClick={handleContactSave}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
