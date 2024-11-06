import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import TableBody from '@mui/material/TableBody';
import Table from '@mui/material/Table';
import { useDispatch, useSelector } from 'react-redux';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import FuseLoading from '@fuse/core/FuseLoading';
import { getCampaign, selectCampaigns, setPage, setRowsPerPage } from '../store/campaignBusinessSlice';
import { CampaignBusinessCols } from '../CampaignBusinessConstants';
import TableFooter from 'app/shared-components/TableFooter';

function CampaignListingWidget() {
  const dispatch = useDispatch();
  const campaign = useSelector(selectCampaigns);
  const { total_results: totalRes, results = [], page, results_per_page: resultPerPage, isLoading } = campaign;


  const handleChangePage = (event, newPage) => {
    dispatch(setPage(newPage));
    dispatch(getCampaign());
  };

  const handleChangeRowsPerPage = (value) => {
    dispatch(setRowsPerPage(parseInt(value, 10)));
    dispatch(setPage(1)); // Reset to first page
    dispatch(getCampaign());
  };

  return (
    <Paper className="flex flex-col flex-auto p-24 shadow rounded-2xl overflow-hidden">
      <div className="table-responsive mt-24">
        <Table className="simple w-full min-w-full">
          <TableHead>
            <TableRow>
              {CampaignBusinessCols.map((column, index) => (
                <TableCell key={column.name} align={column.align} width={column.width}>
                  <Typography
                    color="text.secondary"
                    className="font-semibold text-12 whitespace-nowrap"
                  >
                    {column.name}
                  </Typography>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          {isLoading ? (
            <FuseLoading />
          ) : (
            <TableBody>
              {results &&
                results.map((row, index) => (
                  <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell component="th" scope="row">
                      <div>
                        <Typography
                          color="text.secondary"
                          className="font-semibold text-18 whitespace-nowrap"
                        >
                          {row.title}
                        </Typography>
                        <Typography className="text-14">{row.description}</Typography>
                      </div>
                    </TableCell>
                    <TableCell align="center">{row.status}</TableCell>
                    <TableCell>{row.expiry_date}</TableCell>
                    <TableCell>{row.expiry_date}</TableCell>
                    <TableCell align="center">{row.applications_count}</TableCell>
                    <TableCell align="left">
                      <div className="flex gap-6 justify-center">
                        <Button
                          variant="text"
                          color="warning"
                          startIcon={
                            <FuseSvgIcon size={24}>heroicons-solid:pencil-alt</FuseSvgIcon>
                          }
                        />
                        <Button variant="contained" color="secondary">
                          View Applicants
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          )}
        </Table>
      </div>
      <TableFooter
        currentPage={page}
        totalPages={totalRes}
        selectedRowPerPage={resultPerPage}
        handlePageChange={handleChangePage}
        handlerRowPerPage={handleChangeRowsPerPage}
        rowsPerPage={[10, 20, 50, 100]}
      />
    </Paper>
  );
}

export default CampaignListingWidget;
