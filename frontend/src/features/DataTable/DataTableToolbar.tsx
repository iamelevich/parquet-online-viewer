import type { EnhancedTableToolbarProps } from './interfaces';
import Toolbar from '@material-ui/core/Toolbar';
import clsx from 'clsx';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import React from 'react';
import {
  createStyles,
  lighten,
  makeStyles,
  Theme,
} from '@material-ui/core/styles';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  parsedDataSlice,
  selectData,
  selectFileInfo,
  selectFilter,
} from '../parquetParser/parsedDataSlice';
import CodeIcon from '@material-ui/icons/Code';
import ListAltIcon from '@material-ui/icons/ListAlt';
import { Checkbox, FormControlLabel, TextField } from '@material-ui/core';
import { downloadCSV, downloadJSON } from '../download/helpers';

const useToolbarStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(1),
    },
    highlight:
      theme.palette.type === 'light'
        ? {
            color: theme.palette.secondary.main,
            backgroundColor: lighten(theme.palette.secondary.light, 0.85),
          }
        : {
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.secondary.dark,
          },
    title: {
      flex: '1 1 100%',
    },
  }),
);

function DataTableToolbar(props: EnhancedTableToolbarProps) {
  const dispatch = useAppDispatch();
  const fileInfo = useAppSelector(selectFileInfo);
  const parsedData = useAppSelector(selectData);
  const filter = useAppSelector(selectFilter);
  const classes = useToolbarStyles();
  const { selected, showNulls, onShowNullsChange } = props;

  const downloadSelectedJSON = () => {
    const selectedData = parsedData.filter((value: any, index: number) =>
      selected.includes(index.toString()),
    );
    downloadJSON(selectedData, fileInfo.name);
  };

  const downloadSelectedCSV = () => {
    const selectedData = parsedData.filter((value: any, index: number) =>
      selected.includes(index.toString()),
    );
    downloadCSV(selectedData, fileInfo.name);
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(parsedDataSlice.actions.setFilter(event.target.value));
  };

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: selected.length > 0,
      })}
    >
      {selected.length > 0 ? (
        <Typography
          className={classes.title}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {selected.length} selected
        </Typography>
      ) : (
        <Typography
          className={classes.title}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          {fileInfo.name} ({fileInfo.size} bytes)
        </Typography>
      )}
      {selected.length > 0 ? (
        <Tooltip title="Download JSON">
          <IconButton aria-label="json" onClick={downloadSelectedJSON}>
            <CodeIcon />
          </IconButton>
        </Tooltip>
      ) : null}
      {selected.length > 0 ? (
        <Tooltip title="Download CSV">
          <IconButton aria-label="csv" onClick={downloadSelectedCSV}>
            <ListAltIcon />
          </IconButton>
        </Tooltip>
      ) : null}
      <FormControlLabel control={<Checkbox checked={showNulls} onChange={onShowNullsChange} />} label="Show null's" />
      <TextField
        label="Filter"
        variant="outlined"
        value={filter}
        onChange={handleFilterChange}
      />
    </Toolbar>
  );
}

export default DataTableToolbar;
