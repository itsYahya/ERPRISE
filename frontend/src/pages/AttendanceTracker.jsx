import axios from 'axios';
import { useEffect, useState } from "react";
import { Card } from "@heroui/react";
import { FaUserClock, FaUserCheck, FaUser } from "react-icons/fa6";
import { motion } from "framer-motion";

export default function AttendanceTracker() {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAttendance = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:8000/api/attendance/');
        setAttendance(response.data);
      } catch (err) {
        setError('Failed to fetch attendance');
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, []);

  const total = attendance.length;
  const working = attendance.filter(a => a.status === 'present').length;
  const absent = total - working;

  const summaryCards = [
    {
      title: "Total Employees",
      value: total,
      icon: <FaUserClock className="text-blue-500 w-6 h-6" />,
    },
    {
      title: "Currently Working",
      value: working,
      icon: <FaUserCheck className="text-green-500 w-6 h-6" />,
    },
    {
      title: "Absent",
      value: absent,
      icon: <FaUser className="text-red-500 w-6 h-6" />,
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Employee Attendance Summary</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {summaryCards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="p-4 flex items-center justify-between shadow-md rounded-xl">
              <div>
                <div className="text-sm text-gray-500">{card.title}</div>
                <div className="text-2xl font-bold text-gray-800">{card.value}</div>
              </div>
              {card.icon}
            </Card>
          </motion.div>
        ))}
      </div>

      {loading && <div className="text-gray-500">Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-4">
        {attendance.map((emp, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
          >
            <Card className="p-4 flex items-center justify-between rounded-xl shadow-sm">
              <div>
                <div className="font-medium text-gray-800">{emp.name}</div>
                <div className="text-sm text-gray-500">{emp.time}</div>
              </div>
              <span
                className={`text-sm px-2 py-1 rounded-full font-semibold ${
                  emp.status === 'present'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {emp.status === 'present' ? 'Present' : 'Absent'}
              </span>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}