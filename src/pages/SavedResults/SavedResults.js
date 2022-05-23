import React, {useEffect, useState, useContext} from 'react';
import { Table, TableBody, TableCell, TableRow, TableContainer, TableHead, Paper, IconButton, Tooltip } from '@material-ui/core';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import firebase from '../../services/Firebase';
import {GlobalContext} from '../../context/GlobalState';

import classes from "./SavedResults.module.scss";

const SavedResults = () => {

    const [savedData, setSavedData] = useState([]);
    const {store, loadingComplete} = useContext(GlobalContext);
    const {savedResults} = store.pages;

    useEffect(() => {
        loadingComplete(false);
        firebase.getResults(store.currentUser.uid)
            .then((resp) => {
                setSavedData(resp.docs);
            })
            .then(() => loadingComplete(true));
    }, []);

    const deleteData = (id) => {
        
        firebase.deleteResult(id)
            .then(() => { 
                setSavedData(savedData.filter((item) => item.id !== id));
                console.log(id, "was deleted!");  
            });
    }

    let list;
    
    if (Object.entries(savedData).length > 0) {
        list = Object.keys(savedData).map((key) => (
                <TableRow key={key}>
                        <TableCell>{savedData[key].data().name}</TableCell>
                        <TableCell>{savedData[key].data().date}</TableCell>
                        <TableCell>{savedData[key].data().amount} {savedData[key].data().from}</TableCell>
                        <TableCell>{savedData[key].data().converted} {savedData[key].data().to}</TableCell>
                        <TableCell>
                            <Tooltip title="Remove item">
                                <IconButton onClick={deleteData.bind(this, savedData[key].id)}>
                                    <DeleteOutlineIcon />
                                </IconButton>
                            </Tooltip>
                        </TableCell>
                </TableRow>
            ));
    } else {
        list = (
            <TableRow>
                <TableCell>{savedResults.noResults}</TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
            </TableRow>
        );
    }
    
    return (
        <>
            <TableContainer component={Paper} className={classes.TableContainer}>
                <Table>
                    {(Object.entries(savedData).length > 0) ? 
                    <TableHead>
                        <TableRow className={classes.TableHead}>
                            <TableCell>{savedResults.savedName}</TableCell>
                            <TableCell>{savedResults.savedDate}</TableCell>
                            <TableCell>{savedResults.insertedValue}</TableCell>
                            <TableCell>{savedResults.convertedValue}</TableCell>
                            <TableCell>{savedResults.action}</TableCell>
                        </TableRow>
                    </TableHead> : ""}
                    <TableBody>
                        {list}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}

export default SavedResults;