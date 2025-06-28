import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Button, Select, SelectItem } from '@heroui/react';

const Form = ({ 
  initialData, 
  onSubmit, 
  fields, 
  title,
  submitText = 'Submit',
  redirectTo,
  className = "max-w-2xl mx-auto p-8 bg-white rounded-xl shadow-md space-y-6"
}) => {
  const [formData, setFormData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === 'file') {
      setFormData(prev => ({
        ...prev,
        [name]: files[0]
      }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await onSubmit(formData);
      setSuccess(true);
      if (redirectTo) {
        navigate(redirectTo);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'An error occurred. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const renderField = (field) => {
    switch (field.type) {
      case 'select':
        return (
          <Select
            key={field.name}
            label={field.label}
            selectedKeys={new Set([formData[field.name]])}
            onSelectionChange={(keys) => 
              setFormData(prev => ({ ...prev, [field.name]: Array.from(keys)[0] }))
            }
          >
            {field.options.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </Select>
        );
      
      case 'checkbox':
        return (
          <div key={field.name} className="flex items-center gap-2">
            <Input
              type="checkbox"
              name={field.name}
              checked={formData[field.name]}
              onChange={handleChange}
            />
            <label>{field.label}</label>
          </div>
        );
      
      case 'file':
        return (
          <Input
            key={field.name}
            type="file"
            label={field.label}
            name={field.name}
            onChange={handleChange}
            accept={field.accept}
          />
        );

      default:
        return (
          <Input
            key={field.name}
            label={field.label}
            name={field.name}
            type={field.type || 'text'}
            value={formData[field.name]}
            onChange={handleChange}
            isRequired={field.required}
          />
        );
    }
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      {title && <h2 className="text-2xl font-semibold mb-6">{title}</h2>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map(field => renderField(field))}
      </div>

      {error && (
        <div className="mt-4 text-red-600">
          {error}
        </div>
      )}

      {success && (
        <div className="mt-4 text-green-600">
          Successfully submitted!
        </div>
      )}

      <div className="mt-6">
        <Button
          type="submit"
          isLoading={loading}
          className="w-full"
        >
          {submitText}
        </Button>
      </div>
    </form>
  );
};

export default Form;
