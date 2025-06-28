import { useEffect, useState } from 'react';
import Form from '../components/Form/Form';
import api from '../utils/api';

const AddEmployee = () => {
  const [managers, setManagers] = useState([]);

  // Charger les employés comme managers possibles
  useEffect(() => {
    api.get('/humanRS/employees/')
      .then(response => {
        const options = response.data.map(emp => ({
          value: emp.id,
          label: `${emp.first_name} ${emp.last_name}`
        }));
        setManagers(options);
      })
      .catch(error => {
        console.error("Failed to load managers", error);
      });
  }, []);

  const initialData = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    hireDate: '',
    status: 'Active',
    manager: '',
    image: null,
  };

  const fields = [
    { name: 'firstName', label: 'First Name', required: true },
    { name: 'lastName', label: 'Last Name', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'phone', label: 'Phone', required: true },
    { name: 'hireDate', label: 'Hire Date', type: 'date', required: true },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'Active', label: 'Active' },
        { value: 'Inactive', label: 'Inactive' }
      ],
      required: true
    },
    {
      name: 'manager',
      label: 'Manager',
      type: 'select',
      options: managers,
      required: false
    },
    { name: 'image', label: 'Photo', type: 'file', accept: 'image/*' }
  ];

  const handleSubmit = async (formData) => {
    const form = new FormData();
    form.append('first_name', formData.firstName);
    form.append('last_name', formData.lastName);
    form.append('email', formData.email);
    form.append('phone', formData.phone);
    form.append('hire_date', formData.hireDate);
    form.append('status', formData.status);
    if (formData.manager) form.append('manager', formData.manager);
    if (formData.image) form.append('photo', formData.image);

    try {
      await api.post('/humanRS/employees/', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    } catch (error) {
      console.error("Failed to add employee:", error);
    }
  };

  return (
    <Form
      title="Add Employee"
      initialData={initialData}
      fields={fields}
      onSubmit={handleSubmit}
      submitText="Add Employee"
      redirectTo="/employees"
    />
  );
};

export default AddEmployee;