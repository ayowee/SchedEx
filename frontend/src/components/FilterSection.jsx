// import { TextField, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
// import { Search, FilterList } from '@mui/icons-material';

// const FilterSection = ({ filters, setFilters }) => (
//     <div className="bg-white p-4 rounded-lg shadow mb-6">
//         <div className="flex items-center gap-4 flex-wrap">
//             <TextField
//                 variant="outlined"
//                 placeholder="Search presentations..."
//                 InputProps={{
//                     startAdornment: <Search className="text-gray-400 mr-2" />
//                 }}
//                 className="flex-1 min-w-[250px]"
//                 value={filters.searchTerm}
//                 onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
//             />

//             <FormControl className="min-w-[180px]">
//                 <InputLabel>Status</InputLabel>
//                 <Select
//                     value={filters.status}
//                     label="Status"
//                     onChange={(e) => setFilters({ ...filters, status: e.target.value })}
//                     startAdornment={<FilterList className="text-gray-400 mr-2" />}
//                 >
//                     <MenuItem value="all">All Statuses</MenuItem>
//                     <MenuItem value="scheduled">Scheduled</MenuItem>
//                     <MenuItem value="completed">Completed</MenuItem>
//                     <MenuItem value="cancelled">Cancelled</MenuItem>
//                 </Select>
//             </FormControl>

//             <FormControl className="min-w-[180px]">
//                 <InputLabel>Date Range</InputLabel>
//                 <Select
//                     value={filters.dateRange}
//                     label="Date Range"
//                     onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
//                 >
//                     <MenuItem value="lastWeek">Last Week</MenuItem>
//                     <MenuItem value="lastMonth">Last Month</MenuItem>
//                     <MenuItem value="lastYear">Last Year</MenuItem>
//                     <MenuItem value="custom">Custom</MenuItem>
//                 </Select>
//             </FormControl>
//         </div>
//     </div>
// );

// export default FilterSection;