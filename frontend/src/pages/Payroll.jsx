import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
    Button,
    Table,
    TableHeader,
    TableRow,
    TableCell,
    TableBody,
    Badge,
    Card,
} from "@heroui/react";
import { FaPlus } from "react-icons/fa6";

export default function Payroll() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPayroll = async () => {
            setLoading(true);
            try {
                const response = await axios.get('http://localhost:8000/api/payroll/');
                setData(response.data);
            } catch (err) {
                setError('Failed to fetch payroll data');
            } finally {
                setLoading(false);
            }
        };
        fetchPayroll();
    }, []);

    const getStatus = (amount, release) => {
        if (release >= amount) return <Badge color="success">Paid</Badge>;
        if (release > 0) return <Badge color="warning">Partial</Badge>;
        return <Badge color="destructive">Unpaid</Badge>;
    };

    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-gray-800">Salary Advance List</h2>
                <Button className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700 transition">
                    <FaPlus className="h-4 w-4" /> Add Salary Advance
                </Button>
            </div>
            <Card className="rounded-xl shadow">
                <div className="p-4">
                    {loading && <div>Loading...</div>}
                    {error && <div className="text-red-500">{error}</div>}
                    <Table className="min-w-full text-sm text-gray-700">
                        <TableHeader>
                            <TableRow className="bg-gray-50">
                                <TableCell className="px-4 py-3 font-semibold">#</TableCell>
                                <TableCell className="px-4 py-3 font-semibold">Employee</TableCell>
                                <TableCell className="px-4 py-3 font-semibold">Amount</TableCell>
                                <TableCell className="px-4 py-3 font-semibold">Released</TableCell>
                                <TableCell className="px-4 py-3 font-semibold">Month</TableCell>
                                <TableCell className="px-4 py-3 font-semibold">Status</TableCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.map((row) => (
                                <TableRow key={row.id} className="hover:bg-gray-50 transition">
                                    <TableCell className="px-4 py-2">{row.id}</TableCell>
                                    <TableCell className="px-4 py-2">{row.name}</TableCell>
                                    <TableCell className="px-4 py-2">${row.amount}</TableCell>
                                    <TableCell className="px-4 py-2">${row.release}</TableCell>
                                    <TableCell className="px-4 py-2">{row.month}</TableCell>
                                    <TableCell className="px-4 py-2">{getStatus(row.amount, row.release)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </Card>
        </div>
    );
}