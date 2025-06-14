import { useState } from 'react';
import { Input, Select, Button, Textarea, Checkbox, SelectItem } from '@heroui/react';

export default function AddEmployeeForm({ onSubmit }) {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        designation: '',
        address: '',
        city: '',
        state: '',
        degreeProgram: '',
        institute: '',
        jobTitle: '',
        company: '',
        jobType: '',
        startDate: '',
        endDate: '',
        currentlyWorking: false,
        description: '',
        skills: '',
        image: null,
    });

    const [imagePreview, setImagePreview] = useState(null);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData((prev) => ({ ...prev, image: file }));
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-6xl mx-auto p-8 bg-white rounded-xl shadow-md space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="col-span-1 flex justify-center">
                    <div className="relative w-32 h-32">
                        <input type="file" accept="image/*" id="imageUpload" className="hidden" onChange={handleImageChange} />
                        <label htmlFor="imageUpload" className="cursor-pointer block w-32 h-32 rounded-full bg-gray-100 border border-gray-300 hover:bg-blue-100 hover:border-blue-400 overflow-hidden flex items-center justify-center">
                            {imagePreview ? (
                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-3xl font-light text-gray-400">+</span>
                            )}
                        </label>
                    </div>
                </div>

                <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} isRequired />
                    <Input label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} isRequired />
                    <Input label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} isRequired />
                    <Input label="Email" name="email" type="email" value={formData.email} onChange={handleChange} isRequired />
                    <Input label="Designation" name="designation" value={formData.designation} onChange={handleChange} isRequired />
                    <Input label="Address" name="address" value={formData.address} onChange={handleChange} isRequired />
                    <Input label="City" name="city" value={formData.city} onChange={handleChange} isRequired />
                    <Input label="State" name="state" value={formData.state} onChange={handleChange} isRequired />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select label="Degree Program" selectedKeys={new Set([formData.degreeProgram])} onSelectionChange={(keys) => setFormData((prev) => ({ ...prev, degreeProgram: Array.from(keys)[0] || '' }))}>
                    <SelectItem key="BSc">BSc</SelectItem>
                    <SelectItem key="MSc">MSc</SelectItem>
                </Select>
                <Select label="Institute" selectedKeys={new Set([formData.institute])} onSelectionChange={(keys) => setFormData((prev) => ({ ...prev, institute: Array.from(keys)[0] || '' }))}>
                    <SelectItem key="ABC University">ABC University</SelectItem>
                </Select>
            </div>

            <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-700">Experience</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Position/Designation" name="jobTitle" value={formData.jobTitle} onChange={handleChange} />
                    <Input label="Company" name="company" value={formData.company} onChange={handleChange} />
                    <Select label="Job Type" selectedKeys={new Set([formData.jobType])} onSelectionChange={(keys) => setFormData((prev) => ({ ...prev, jobType: Array.from(keys)[0] || '' }))}>
                        <SelectItem key="Full-Time">Full-Time</SelectItem>
                        <SelectItem key="Part-Time">Part-Time</SelectItem>
                    </Select>
                    <div className="grid grid-cols-2 gap-2">
                        <Input label="Start Date" name="startDate" type="date" value={formData.startDate} onChange={handleChange} />
                        <Input label="End Date" name="endDate" type="date" value={formData.endDate} onChange={handleChange} />
                    </div>
                    <Textarea label="Description" name="description" value={formData.description} onChange={handleChange} rows={3} />
                    <div className="flex flex-col justify-between">
                    <Input label="Skills" name="skills" value={formData.skills} onChange={handleChange} placeholder="Add skill" />
                    <Checkbox name="currentlyWorking" isSelected={formData.currentlyWorking} onChange={(value) => setFormData((prev) => ({ ...prev, currentlyWorking: value }))}>I'm currently working here</Checkbox>
                    </div>
                </div>
            </div>


            <div className="flex justify-end pt-4">
                <Button type="submit" color="primary">Save</Button>
            </div>
        </form>
    );
}
