// import React, { useState, useMemo } from 'react';
// import './DataTable.css';

// const DataTable = ({ data, columns, rowsPerPage = 5 }) => {
//     const [search, setSearch] = useState('');
//     const [sortColumn, setSortColumn] = useState(null);
//     const [sortOrder, setSortOrder] = useState('asc');
//     const [currentPage, setCurrentPage] = useState(1);

//     const filteredData = useMemo(() => {
//         return data.filter(row =>
//             columns.some(col =>
//                 row[col.accessor]
//                     ?.toString()
//                     .toLowerCase()
//                     .includes(search.toLowerCase())
//             )
//         );
//     }, [data, columns, search]);

//     const sortedData = useMemo(() => {
//         if (!sortColumn) return filteredData;

//         return [...filteredData].sort((a, b) => {
//             const valA = a[sortColumn];
//             const valB = b[sortColumn];
//             if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
//             if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
//             return 0;
//         });
//     }, [filteredData, sortColumn, sortOrder]);

//     const paginatedData = useMemo(() => {
//         const start = (currentPage - 1) * rowsPerPage;
//         return sortedData.slice(start, start + rowsPerPage);
//     }, [sortedData, currentPage, rowsPerPage]);

//     const totalPages = Math.ceil(sortedData.length / rowsPerPage);

//     const handleSort = (accessor) => {
//         if (accessor === sortColumn) {
//             setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
//         } else {
//             setSortColumn(accessor);
//             setSortOrder('asc');
//         }
//     };

//     return (
//         <div className="datatable">
//             <input
//                 type="text"
//                 placeholder="Search..."
//                 className="search-box"
//                 value={search}
//                 onChange={(e) => {
//                     setSearch(e.target.value);
//                     setCurrentPage(1);
//                 }}
//             />

//             <table>
//                 <thead>
//                     <tr>
//                         {columns.map(col => (
//                             <th key={col.accessor} onClick={() => handleSort(col.accessor)}>
//                                 {col.label}
//                                 {sortColumn === col.accessor ? (sortOrder === 'asc' ? ' ▲' : ' ▼') : ''}
//                             </th>
//                         ))}
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {paginatedData.map((row, idx) => (
//                         <tr key={idx}>
//                             {columns.map(col => (
//                                 <td key={col.accessor}>{row[col.accessor]}</td>
//                             ))}
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>

//             <div className="pagination">
//                 <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}>
//                     Prev
//                 </button>
//                 <span>{currentPage} / {totalPages}</span>
//                 <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>
//                     Next
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default DataTable;
