import React, { useEffect, useState } from "react";
import api from "../utils/api";

export default function UserLogs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    api.get("/api/user-logs/").then((res) => {
      setLogs(res.data);
    });
  }, []);

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Activité récente</h2>
      <ul>
        {logs.map((log, i) => (
          <li key={i}>
            <strong>{new Date(log.timestamp).toLocaleString()}</strong> - {log.action}
          </li>
        ))}
      </ul>
    </div>
  );
}
