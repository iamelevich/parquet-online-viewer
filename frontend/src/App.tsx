import React from 'react';
import {AppBar, Container, Toolbar, Typography} from '@material-ui/core';
import {createStyles, makeStyles} from '@material-ui/core/styles';
import ParquetParser from './features/parquetParser/ParquetParser';
import DataTable from './features/DataTable/DataTable';
import {selectData} from './features/parquetParser/parsedDataSlice';
import {useAppSelector} from './app/hooks';
import Download from './features/download/Download';

interface AppProps {
}

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            padding: 0,
        },
        title: {
            flexGrow: 1,
        },
    }),
);


const URL_INFO = `${import.meta.env.SNOWPACK_PUBLIC_BACKEND_HOST}/v1/info`;

function App({}: AppProps) {
    const parsedData = useAppSelector(selectData);
    const classes = useStyles();
    const [version, setVersion] = React.useState('');

    React.useEffect(() => {
        const updateVersion = async () => {
            const res = await fetch(URL_INFO);
            const jsonResult = await res.json();
            setVersion(jsonResult.version);
        };
        updateVersion();
        const timer = setInterval(updateVersion, 60000);
        return () => {
            clearInterval(timer);
        };
    }, []);

    return (
        <Container maxWidth={false} style={{padding: 0, minHeight: '100vh'}}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" className={classes.title}>
                        Parquet Online Viewer v{version}
                    </Typography>
                    <ParquetParser/>
                </Toolbar>
            </AppBar>
            {parsedData.length ? <DataTable/> : null}
            {parsedData.length ? <Download/> : null}
        </Container>
    );
}

export default App;
