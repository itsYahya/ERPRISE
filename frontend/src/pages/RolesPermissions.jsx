import { Card, Input, Switch } from "@heroui/react";
import { useState } from "react";

export default function RolesPermissions() {
    const [permissions, setPermissions] = useState({
        Notifications: true,
        Quotation: true,
        "Purchase Order": true,
        "Company Profile": true,
        Team: true,
    });

    const togglePermission = (key) => {
        setPermissions({ ...permissions, [key]: !permissions[key] });
    };

    return (
        <div className="p-6 space-y-6">
            <h2 className="text-xl font-semibold">Add New Role</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input placeholder="Role Name" />
                <Input placeholder="Description" />
            </div>

            <div className="mt-6">
                <h3 className="text-lg font-medium mb-2">Permissions</h3>
                <div className="space-y-2">
                    {Object.entries(permissions).map(([item, enabled]) => (
                        <Card key={item} className="p-4 flex items-center justify-between">
                            <span>{item}</span>
                            <Switch checked={enabled} onChange={() => togglePermission(item)} />
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
