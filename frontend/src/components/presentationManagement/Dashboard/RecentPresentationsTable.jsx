// import { useState } from 'react';
// import Pagination from '@mui/material/Pagination';
// import {
//     Table,
//     TableBody,
//     TableCell,
//     TableContainer,
//     TableHead,
//     TableRow,
//     TableSortLabel,
//     Paper,
//     Chip
// } from '@mui/material';

// const RecentPresentationsTable = () => {
//     const [orderBy, setOrderBy] = useState('date');
//     const [order, setOrder] = useState('asc');
//     const [page, setPage] = useState(0);
//     const rowsPerPage = 5;

//     // Sample data - replace with API data
//     const presentations = [
//         { id: 1, group: 'CS-101', examiner: 'Dr. Smith', date: '2024-04-20', status: 'scheduled' },
//         { id: 2, group: 'ME-205', examiner: 'Prof. Johnson', date: '2024-04-18', status: 'completed' },
//         // Add more sample data...
//     ];

//     const handleSort = (property) => {
//         const isAsc = orderBy === property && order === 'asc';
//         setOrder(isAsc ? 'desc' : 'asc');
//         setOrderBy(property);
//     };

//     const getStatusColor = (status) => {
//         switch (status) {
//             case 'completed': return 'bg-green-100 text-green-800';
//             case 'scheduled': return 'bg-blue-100 text-blue-800';
//             case 'cancelled': return 'bg-red-100 text-red-800';
//             default: return 'bg-gray-100 text-gray-800';
//         }
//     };

//     return (
//         <>
//             <TableContainer component={Paper}>
//                 <Table>
//                     <TableHead className="bg-gray-50">
//                         <TableRow>
//                             {['Group', 'Examiner', 'Date', 'Status'].map((header) => (
//                                 <TableCell key={header}>
//                                     <TableSortLabel
//                                         active={orderBy === header.toLowerCase()}
//                                         direction={orderBy === header.toLowerCase() ? order : 'asc'}
//                                         onClick={() => handleSort(header.toLowerCase())}
//                                     >
//                                         {header}
//                                     </TableSortLabel>
//                                 </TableCell>
//                             ))}
//                         </TableRow>
//                     </TableHead>
//                     <TableBody>
//                         {presentations.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//                             .map((presentation) => (
//                                 <TableRow key={presentation.id} hover>
//                                     <TableCell>{presentation.group}</TableCell>
//                                     <TableCell>{presentation.examiner}</TableCell>
//                                     <TableCell>{presentation.date}</TableCell>
//                                     <TableCell>
//                                         <Chip
//                                             label={presentation.status}
//                                             className={`${getStatusColor(presentation.status)} capitalize`}
//                                             size="small"
//                                         />
//                                     </TableCell>
//                                 </TableRow>
//                             ))}
//                     </TableBody>
//                 </Table>
//             </TableContainer>

//             <div className="flex justify-end p-4">
//                 <Pagination
//                     count={Math.ceil(presentations.length / rowsPerPage)}
//                     page={page + 1}
//                     onChange={(e, newPage) => setPage(newPage - 1)}
//                     shape="rounded"
//                 />
//             </div>
//         </>
//     );
// };

// export default RecentPresentationsTable;