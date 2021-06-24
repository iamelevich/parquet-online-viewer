import React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import ListAltIcon from '@material-ui/icons/ListAlt';
import CodeIcon from '@material-ui/icons/Code';
import GetAppIcon from '@material-ui/icons/GetApp';
import { useAppSelector } from '../../app/hooks';
import { selectData, selectFileInfo } from '../parquetParser/parsedDataSlice';
import { downloadCSV, downloadJSON } from './helpers';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    speedDial: {
      position: 'fixed',
      bottom: theme.spacing(5),
      right: theme.spacing(5),
    },
  }),
);

function Download() {
  const parsedData = useAppSelector(selectData);
  const fileInfo = useAppSelector(selectFileInfo);
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <SpeedDial
      ariaLabel="SpeedDial openIcon example"
      className={classes.speedDial}
      hidden={false}
      icon={<SpeedDialIcon openIcon={<GetAppIcon />} />}
      onClose={handleClose}
      onOpen={handleOpen}
      open={open}
    >
      <SpeedDialAction
        key="JSON"
        icon={<CodeIcon />}
        tooltipTitle="JSON"
        onClick={() => downloadJSON(parsedData, fileInfo.name)}
      />
      <SpeedDialAction
        key="CSV"
        icon={<ListAltIcon />}
        tooltipTitle="Csv"
        onClick={() => downloadCSV(parsedData, fileInfo.name)}
      />
    </SpeedDial>
  );
}

export default Download;
