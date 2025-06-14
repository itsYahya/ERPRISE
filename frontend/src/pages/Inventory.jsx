// src/pages/InventoryPage.js
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Card from '../components/Card';

const InventoryPage = () => {
    const items = useSelector((state) => state.inventory.list);
    const [search, setSearch] = useState('');

    const filtered = items.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Card title="Inventaire">
            <input
                type="text"
                placeholder="Recherche d'article"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <ul>
                {filtered.map((item) => (
                    <li key={item.id}>
                        {item.name} — quantité : {item.quantity}
                    </li>
                ))}
            </ul>
        </Card>
    );
};

export default InventoryPage;
