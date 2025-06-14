import { Card } from "@heroui/react";
import { FaCircleCheck } from "react-icons/fa6";

export default function AttendanceTracker() {
    const employees = [
        { name: "Fatima Zahra", time: "08:30" },
        { name: "Omar Naji", time: "08:55" },
        { name: "Lina Amrani", time: "09:00" },
    ];

    return (
        <div className="p-6 space-y-6">
            <h2 className="text-xl font-semibold">Employee Attendance Summary</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card><div><div className="text-gray-500">Total Employees</div><div className="text-2xl font-bold">40</div></div></Card>
                <Card><div><div className="text-gray-500">Currently Working</div><div className="text-2xl font-bold">32</div></div></Card>
                <Card><div><div className="text-gray-500">Absent</div><div className="text-2xl font-bold">8</div></div></Card>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {employees.map((emp, index) => (
                    <Card key={index} className="p-4 flex items-center justify-between">
                        <div>
                            <div className="font-medium">{emp.name}</div>
                            <div className="text-sm text-gray-500">{emp.time}</div>
                        </div>
                        <FaCircleCheck className="h-6 w-6 text-green-500" />
                    </Card>
                ))}
            </div>
        </div>
    );
}
