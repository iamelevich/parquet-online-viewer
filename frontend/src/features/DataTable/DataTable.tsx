import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import { useAppSelector } from '../../app/hooks';
import { selectData, selectFilter } from '../parquetParser/parsedDataSlice';
import type { Data, HeadCell, Order } from './interfaces';
import DataTableToolbar from './DataTableToolbar';
import DataTableHead from './DataTableHead';
import { getComparator, stableSort } from './helpers';
import { yellow } from '@material-ui/core/colors';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      width: '100%',
    },
    paper: {
      width: '100%',
    },
    table: {
      minWidth: 750,
    },
    visuallyHidden: {
      border: 0,
      clip: 'rect(0 0 0 0)',
      height: 1,
      margin: -1,
      overflow: 'hidden',
      padding: 0,
      position: 'absolute',
      top: 20,
      width: 1,
    },
  }),
);

export default function EnhancedTable() {
  const filter = useAppSelector(selectFilter);
  const parsedData = useAppSelector(selectData);
  const classes = useStyles();
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof Data>('id');
  const [selected, setSelected] = React.useState<string[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const headCells: HeadCell[] = [
    {
      id: 'id',
      label: '#',
      numeric: true,
    },
    ...Object.keys(parsedData[0]).map((key) => ({
      id: key,
      label: key,
      numeric: typeof parsedData[0][key] === 'number',
    })),
  ];

  const rows: Data[] = parsedData.map(
    (data: Record<string, any>, index: number) => ({
      id: index,
      ...data,
    }),
  );

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.id.toString());
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, id: string) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = [...selected, id];
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (id: string) => selected.indexOf(id) !== -1;

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  const highlightFiltered = (value: any) => {
    if (!value || !filter) {
      return value;
    }
    const vAsString = value.toString();
    const indexOfFiltered = vAsString
      .toLowerCase()
      .indexOf(filter.toLowerCase());
    if (indexOfFiltered >= 0) {
      const firstPart = vAsString.slice(0, indexOfFiltered);
      const filteredPart = vAsString.slice(
        indexOfFiltered,
        indexOfFiltered + filter.length,
      );
      const lastPart = vAsString.slice(
        indexOfFiltered + filter.length,
        vAsString.length,
      );
      console.log(indexOfFiltered, firstPart, filteredPart, lastPart);
      return (
        <span>
          {firstPart}
          <span style={{ backgroundColor: yellow[500] }}>{filteredPart}</span>
          {lastPart}
        </span>
      );
    }
    return value;
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <DataTableToolbar selected={selected} />
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size="small"
            aria-label="enhanced table"
          >
            <DataTableHead
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
              headCells={headCells}
            />
            <TableBody>
              {stableSort<Data>(rows, getComparator<keyof Data>(order, orderBy))
                .filter((value: Data) => {
                  return Object.values(value).some((v: any) =>
                    v
                      ? v
                          .toString()
                          .toLowerCase()
                          .indexOf(filter.toLowerCase()) >= 0
                      : false,
                  );
                })
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  const isItemSelected = isSelected(row.id.toString());
                  const key = `unique-key-${row.id}`;
                  const labelId = `data-table-checkbox-${row.id}`;

                  const cells = headCells
                    .filter((head) => head.id !== 'id')
                    .map((head) => (
                      <TableCell align="right" key={`${key}-${head.id}`}>
                        {highlightFiltered(row[head.id])}
                      </TableCell>
                    ));

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.id.toString())}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={key + '-row'}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox" key={key + '-checkbox'}>
                        <Checkbox
                          checked={isItemSelected}
                          inputProps={{ 'aria-labelledby': labelId }}
                        />
                      </TableCell>
                      <TableCell
                        key={key + '-id'}
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                      >
                        {row.id}
                      </TableCell>
                      {cells}
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 33 * emptyRows }}>
                  <TableCell colSpan={headCells.length} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}
