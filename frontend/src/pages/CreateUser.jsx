import React, { useState, useEffect } from "react";
import { Card, Input, Button, Select, SelectItem } from "@heroui/react";
import { motion } from "framer-motion";
import api from "../utils/api";

export default function CreateUser() {
  const [roles, setRoles] = useState([]);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    role: "",
  });

  useEffect(() => {
    api.get("/api/roles/roles/")
      .then(res => setRoles(res.data))
      .catch(err => console.error("Erreur lors du chargement des rôles: "+err));
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await api.post("/api/users/", formData);
      console.log("Utilisateur créé avec succès");
      setFormData({ first_name: "", last_name: "", email: "", password: "", role: "" });
    } catch (err) {
      console.error("Erreur lors de la création de l'utilisateur");
    }
  };

  return (
    <motion.div
      className="p-6 max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="p-6 shadow-lg rounded-2xl">
        <h2 className="text-2xl font-semibold mb-6">Créer un nouvel utilisateur</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Prénom"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            required
          />
          <Input
            label="Nom"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            required
          />
          <Input
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <Input
            label="Mot de passe"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <Select
            label="Rôle"
            value={formData.role}
            onChange={val => setFormData(prev => ({ ...prev, role: val }))}
            required
          >
            {roles.map(role => (
              <SelectItem key={role.id} value={role.id}>
                {role.name}
              </SelectItem>
            ))}
          </Select>
          <Button type="submit" color="primary" className="w-full">
            Créer
          </Button>
        </form>
      </Card>
    </motion.div>
  );
}
