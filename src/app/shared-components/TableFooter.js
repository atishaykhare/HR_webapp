// ** MUI Imports
import Box from '@mui/material/Box';

// ** Custom Component Import
import CustomTextField from '@mui/material/TextField';

// ** Icon Imports
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';

function TableFooter(props) {
  // ** Props
  const {
    handlerRowPerPage,
    handlePageChange,
    currentPage = 2,
    totalPages = 7,
    rowsPerPage = [5, 10, 15],
    selectedRowPerPage,
  } = props;

  return (
    <Box
      sx={{
        py: 4,
        px: 6,
        rowGap: 2,
        columnGap: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
      }}
    >
      <Box sx={{ rowGap: 2, display: 'flex', flexWrap: 'no-wrap', alignItems: 'center' }}>
        <Typography color="text.secondary"
                    className="mr-12 whitespace-nowrap">Rows per page:</Typography>
        <CustomTextField
          select
          fullWidth
          defaultValue={rowsPerPage[0]}
          SelectProps={{
            displayEmpty: true,
            onChange: (e) => {
              handlerRowPerPage(e.target.value);
            },
          }}
        >
          {rowsPerPage.map((n) => (
            <MenuItem value={n} key={n} selected={selectedRowPerPage === n}>
              {n}
            </MenuItem>
          ))}
        </CustomTextField>
      </Box>
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={(e, page) => {
          handlePageChange(page);
        }}
      />
    </Box>
  );
}

export default TableFooter;
