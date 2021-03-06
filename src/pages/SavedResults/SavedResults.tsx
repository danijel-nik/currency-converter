import React, { useEffect, useState, useContext } from 'react';
import { Table, TableBody, TableCell, TableRow, TableContainer, TableHead, Paper, IconButton, Tooltip } from '@material-ui/core';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import firebase from '../../services/Firebase';
import { GlobalContext } from '../../context/GlobalState';
import { useTranslation } from 'react-i18next';

import classes from "./SavedResults.module.scss";

const SavedResults = () => {

    const { t } = useTranslation('savedResults');
    const [savedData, setSavedData] = useState<any>([]);
    const { store, setLoading } = useContext(GlobalContext);

    useEffect(() => {
        setLoading(true);
        firebase.getResults(store.currentUser.uid)
            .then((resp: any) => {
                setSavedData(resp.docs);
            });
    }, []);

    useEffect(() => {
        setLoading(false);
    }, [savedData]);

    const deleteData = (id: string) => {

        firebase.deleteResult(id)
            .then(() => {
                setSavedData(savedData.filter((item: any) => item.id !== id));
            });
    }

    return (
        <>
            <TableContainer component={Paper} className={classes.TableContainer}>
                <Table>
                    {(Object.entries(savedData).length > 0) ?
                        <TableHead>
                            <TableRow className={classes.TableHead}>
                                <TableCell>{t('savedName')}</TableCell>
                                <TableCell>{t('savedDate')}</TableCell>
                                <TableCell>{t('insertedValue')}</TableCell>
                                <TableCell>{t('convertedValue')}</TableCell>
                                <TableCell>{t('action')}</TableCell>
                            </TableRow>
                        </TableHead> : ""}
                    <TableBody>
                        {(Object.entries(savedData).length > 0) ? Object.keys(savedData).map((key: any) => (
                            <TableRow key={key}>
                                <TableCell>{savedData[key].data().name}</TableCell>
                                <TableCell>{savedData[key].data().date}</TableCell>
                                <TableCell>{savedData[key].data().amount} {savedData[key].data().from}</TableCell>
                                <TableCell>{savedData[key].data().converted} {savedData[key].data().to}</TableCell>
                                <TableCell>
                                    <Tooltip title={t('removeItemTxt')}>
                                        <IconButton onClick={deleteData.bind(this, savedData[key].id)}>
                                            <DeleteOutlineIcon />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell>{t('noResults')}</TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}

export default SavedResults;