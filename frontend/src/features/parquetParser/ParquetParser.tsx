import React from 'react';
import { CircularProgress, Fab, styled } from '@material-ui/core';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import CheckIcon from '@material-ui/icons/Check';
import { green, red } from '@material-ui/core/colors';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import clsx from 'clsx';
import { useAppDispatch } from '../../app/hooks';
import { parsedDataSlice } from './parsedDataSlice';

const Input = styled('input')({
  display: 'none',
});

const URL = `${import.meta.env.SNOWPACK_PUBLIC_BACKEND_HOST}/v1/parquet`;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    wrapper: {
      margin: theme.spacing(1),
      position: 'relative',
    },
    buttonSuccess: {
      backgroundColor: green[500],
      '&:hover': {
        backgroundColor: red[700],
      },
    },
    fabProgress: {
      color: green[500],
      position: 'absolute',
      top: -6,
      left: -6,
      zIndex: 1,
    },
  }),
);

function ParquetParser() {
  const dispatch = useAppDispatch();
  const classes = useStyles();
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [hovered, setHovered] = React.useState(false);

  const buttonClassname = clsx({
    [classes.buttonSuccess]: success,
  });

  const uploadFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || !event.target.files.length) {
      return;
    }
    if (!loading) {
      setSuccess(false);
      setLoading(true);
      const file = event.target.files[0];
      dispatch(
        parsedDataSlice.actions.setFileInfo({
          name: file.name,
          size: file.size,
        }),
      );
      const formData = new FormData();
      formData.append('file', file);
      try {
        const res = await fetch(URL, {
          method: 'POST',
          body: formData,
        });
        const json = await res.json();
        if (res.status === 200) {
          dispatch(parsedDataSlice.actions.setParsedData(json));
          setSuccess(true);
        } else {
          alert(json.message);
        }
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    }
  };

  return (
    <React.Fragment>
      <label htmlFor="contained-button-file" className={classes.wrapper}>
        <Input
          accept="*"
          id="contained-button-file"
          type="file"
          onChange={uploadFile}
        />
        <Fab
          component="span"
          color="secondary"
          className={buttonClassname}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {success ? (
            hovered ? (
              <CloudUploadIcon />
            ) : (
              <CheckIcon />
            )
          ) : (
            <CloudUploadIcon />
          )}
        </Fab>
        {loading && (
          <CircularProgress size={68} className={classes.fabProgress} />
        )}
      </label>
    </React.Fragment>
  );
}

export default ParquetParser;
