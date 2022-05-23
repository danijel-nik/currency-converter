import 'date-fns';
import React, { useState, useContext, useEffect } from 'react';
import { Grid, Hidden, Button, TextField, Tooltip, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Snackbar, IconButton, Popover, Typography, Paper } from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import Autocomplete from '@material-ui/lab/Autocomplete';
import SaveRoundedIcon from '@material-ui/icons/SaveRounded';
import SwapHorizIcon from '@material-ui/icons/SwapHoriz';
import CloseIcon from '@material-ui/icons/Close';
import AddIcon from '@material-ui/icons/Add';
import data from '../../services/Data';
import firebase from '../../services/Firebase';
import { GlobalContext } from '../../context/GlobalState';

import classes from './Converter.module.scss';

const Converter = () => {

    const [currencies, setCurrencies] = useState({});
    const [selectedDate, setSelectedDate] = React.useState(new Date());
    const [historical, setHistorical] = React.useState(false);
    const [form, setForm] = useState({
        amount: "",
        from: "",
        converted: "",
        to: "",
        saveAs: ""
    });
    const [saveBtnDisabled, setSaveBtnDisabled] = useState(true);

    const context = useContext(GlobalContext);

    useEffect(() => {
        context.store.dispatch({type: "LOADING_COMPLETE", payload: false});

        data.getCurrencyList()
        .then(resp => {
            let currencyList = Object.keys(resp.data.currencies).map((k) => (
                {
                    key: k,
                    value: resp.data.currencies[k]
                }
            ));
            setCurrencies(currencyList);
        })
        .then(() => context.store.dispatch({type: "LOADING_COMPLETE", payload: true}))
        .catch((err) => { console.log(err) });

    }, []);

    const onChange = (e) => {
        setForm({...form, [e.target.name]: e.target.value});
    }

    const swapCurrencies = () => {
        let firstCurrency = form.from;
        let secondCurrency = form.to;

        setForm({
            ...form,
            from: secondCurrency,
            to: firstCurrency
        });
    }

    const formatNumberWithCommas = (number) => {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    const convertCurrency = (e) => {

        if (form.amount !== "") {

            const { amount, from, to } = form;
            let requestedCurrencies = "";

            // add extra currencies if they exist
            if (extraCurrencies.length > 0) {
                let ec = [];
                ec = extraCurrencies.map((item) => (
                    item.currency
                ));
                requestedCurrencies = to + ", " + ec.join(", ");
                console.log(requestedCurrencies);
            } else {
                requestedCurrencies = to;
            }
            
            data.convertCurrency(amount, from, requestedCurrencies, selectedDate.toISOString().split("T")[0], historical)
                .then((response) => {
                    requestedCurrencies.split(", ").map((cur, index) => {

                        let convertedValue = formatNumberWithCommas(Number(response.data.rates[cur].rate_for_amount).toFixed(2));

                        if (index === 0) {
                            setForm({
                                ...form,
                                converted: convertedValue
                            })
                        } else {
                            let exCurrencies = extraCurrencies;
                            exCurrencies[index - 1].value = convertedValue;
                            setExtraCurrencies([
                                ...extraCurrencies,
                                exCurrencies
                            ]);
                            document.getElementsByName(`converted_${index-1}`)[0].value = convertedValue;
                            let label = document.getElementsByName(`converted_${index-1}`)[0].parentNode.previousSibling;
                            label.classList.add("MuiInputLabel-shrink");
                            label.dataset.shrink = true;
                        }
                    });
                    setSaveBtnDisabled(false);
                })
                .catch(err => {
                    // Historical data is missing for some currencies
                    setSnackbarMessage(historicalMissing);
                    openSnackbar();
                    setHistorical(false);
                    setSelectedDate(new Date());
                });

        } else {
            const {convertFailMsg} = context.store.pages.converter;
            setPopoverText(convertFailMsg);
            openPopover(e);
        }
    }

    const saveResult = () => {
        setSaveBtnDisabled(true);
        const {amount, from, converted, to, saveAs} = form;
        let currencyDate = selectedDate.toDateString().split(" ");
        currencyDate = `${currencyDate[2]} ${currencyDate[1]} ${currencyDate[3]}`;

        firebase.saveResult(context.store.currentUser.uid, saveAs, currencyDate, amount, from, converted, to)
        .then(() => {
            closeDialog();
            setSnackbarMessage(context.store.pages.converter.savedResultMsg);
            openSnackbar();
        })
        .catch((error) => {
            setSnackbarMessage(error);
            openSnackbar();
        });
    }

    // Dialog
    const [dialogOpened, setDialogOpened] = useState(false);
    const openDialog = () => {
        setDialogOpened(true);
    }
    const closeDialog = () => {
        setDialogOpened(false);
    }

    // Snackbar
    const [snackbarOpened, setSnackbarOpened] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const openSnackbar = () => {
        setSnackbarOpened(true);
    }
    const closeSnackbar = () => {
        setSnackbarOpened(false);
    }

    // Popover
    const [popoverTriggerEl, setPopoverTriggerEl] = useState(null);
    const [popoverText, setPopoverText] = useState("");
    const openPopover = (event) => {
        setPopoverTriggerEl(event.currentTarget);
    };
    const closePopover = () => {
        setPopoverTriggerEl(null);
    };

    // Add more currency fields
    const [extraFieldsNumber, setExtraFieldsNumber] = useState(0);
    const [extraFields, setExtraFields] = useState([]);
    const [extraCurrencies, setExtraCurrencies] = useState([]);
    const extraField = (id) => (
        <Grid container spacing={2} className={classes.ExtraRow} key={id}>
            <Grid item xs={12} sm={12} md={6}></Grid>
            <Grid item xs={12} sm={6} md={3}>
                <TextField
                    className={classes.Converted}
                    variant="filled" 
                    disabled={true}
                    type="text"
                    fullWidth={true}
                    label={converted}
                    name={"converted_" + id}
                    value={extraCurrencies[id].value} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <Autocomplete
                    className={classes.Autocomplete}
                    options={currencies}
                    defaultValue={form.to.value}
                    getOptionLabel={(option) => option.value}
                    getOptionSelected={(option, value) => option.key === value.key}
                    onChange={(event, newValue) => {
                        let fields = extraCurrencies;
                        if (newValue) {
                            fields[id].currency = newValue.key;
                        } else {
                            fields[id].currency = "";
                        }
                        setExtraCurrencies(fields);
                        console.warn(id);
                        console.log(extraCurrencies);
                    }}
                    renderInput={(params) => 
                        <TextField 
                            {...params} label={currencyTxt} 
                            variant="outlined" />
                    } 
                />
            </Grid>
        </Grid>
    )
    const addFields = () => {
        let id = extraFieldsNumber + 1;
        let exCurrencies = extraCurrencies;
        exCurrencies.push({currency: "", value: ""});
        setExtraCurrencies(exCurrencies);
        setExtraFields([...extraFields, extraField(extraFieldsNumber)]);
        setExtraFieldsNumber(id);
        console.log(extraCurrencies);
    }

    const { dateTxt, enterValue, currencyTxt, converted, swapBtn, convertBtn, saveResultBtn, popoverNoConversion, popoverAuth, dialogText, saveAs, saveBtn, cancelBtn, historicalMissing, addFieldsTxt } = 
    (typeof context.store.pages.converter !== "undefined") ? context.store.pages.converter : "";

    let showSaveBtn = () => (
        <Grid item xs={12} sm="auto" className={classes.SaveBtnWrapper}>
            <Button 
                variant="contained" 
                color="primary" 
                onClick={(e) => {
                    if (!context.store.currentUser) { setPopoverText(popoverAuth); openPopover(e); }
                    else if (saveBtnDisabled) { setPopoverText(popoverNoConversion); openPopover(e); }
                    else openDialog()
                }} 
                id="save-result">
                <SaveRoundedIcon />
                <span className={classes.Title}>{saveResultBtn}</span>
            </Button>
            <Popover
                id="save-result"
                open={Boolean(popoverTriggerEl)}
                anchorEl={popoverTriggerEl}
                onClose={closePopover}
                anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center'
                }}
            >
                <Typography className={classes.typography}>{popoverText}</Typography>
            </Popover>
        </Grid>
    )
        
    return (
        <>
            <Paper className={classes.TopFormWrapper}>
                <Grid container spacing={1}>
                    <Grid item xs={12} sm={6} md={6}>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <KeyboardDatePicker
                                    disableToolbar
                                    disableFuture={true}
                                    variant="inline"
                                    format="yyyy-MM-dd"
                                    margin="normal"
                                    id="date-picker-inline"
                                    className={classes.DatePicker}
                                    label={dateTxt}
                                    value={selectedDate}
                                    onChange={(date) => { setSelectedDate(date); setHistorical(true); }}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                    }}
                                />
                            </MuiPickersUtilsProvider>
                    </Grid>
                    <Grid item className={classes.middle}></Grid>
                    <Hidden only={['xs']}>
                        {showSaveBtn()}
                    </Hidden>
                    
                </Grid>
            </Paper>
            {/* Convert currency form Start */}
            <Paper className={classes.FormWrapper}>
                <Grid container spacing={2} className={classes.MainRow}>
                    <Grid item xs={12} sm={6} md={3}>
                        <TextField 
                            variant="outlined" 
                            type="number"
                            fullWidth={true}
                            label={enterValue} 
                            name="amount"
                            onChange={onChange}
                            validate={true}
                            required={true} />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Autocomplete
                            className={classes.Autocomplete}
                            options={currencies}
                            defaultValue={form.from.value}
                            getOptionLabel={(option) => option.value}
                            getOptionSelected={(option, value) => option.key === value.key}
                            value={form.from.key}
                            inputValue={form.from.key}
                            onChange={(event, newValue) => {
                                if (newValue) {
                                    setForm({
                                        ...form,
                                        from: newValue.key
                                    });
                                } else {
                                    setForm({
                                        ...form,
                                        from: ""
                                    })
                                }
                            }}
                            renderInput={(params) => <TextField name="from" onChange={onChange} value={form.from.value} {...params} label={currencyTxt} variant="outlined" required={true} />} 
                        />
                    </Grid>
                    {/* Swap currencies
                    <Grid item xs={12} sm={12} md={2} className={classes.Center}>
                        <Tooltip title={swapBtn}>
                            <Button 
                                variant="contained"
                                onClick={swapCurrencies} >
                                <SwapHorizIcon />
                            </Button>
                        </Tooltip>
                    </Grid>*/}
                    <Grid item xs={12} sm={6} md={3}>
                        <TextField
                            className={classes.Converted}
                            variant="filled" 
                            disabled={true}
                            type="text"
                            fullWidth={true}
                            label={converted}
                            name="converted" 
                            onChange={onChange}
                            value={form.converted} />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Autocomplete
                            className={classes.Autocomplete}
                            options={currencies}
                            defaultValue={form.to.value}
                            getOptionLabel={(option) => option.value}
                            getOptionSelected={(option, value) => option.key === value.key}
                            value={form.to.key}
                            inputValue={form.to.key}
                            onChange={(event, newValue) => {
                                if (newValue) {
                                    setForm({
                                        ...form,
                                        to: newValue.key
                                    });
                                } else {
                                    setForm({
                                        ...form,
                                        to: ""
                                    })
                                }
                            }}
                            renderInput={(params) => <TextField name="to" onChange={onChange} value={form.to.value} {...params} label={currencyTxt} variant="outlined" required={true} />} 
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={2}>
                    {extraFields}
                </Grid>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}></Grid>
                    <Grid item xs={12} sm={12} md={6} style={{textAlign: "center", paddingTop: "20px"}}>
                        <Tooltip title={addFieldsTxt}>
                            <IconButton onClick={() => addFields()}><AddIcon /></IconButton>
                        </Tooltip>
                    </Grid>
                </Grid>
            </Paper>
            <Paper>
                <Grid container className={classes.ConvertContainer}>
                    <Grid item xs={12} sm={12} md={12} className={classes.Center}>
                        <Button 
                            variant="contained" 
                            color="primary"
                            onClick={convertCurrency}
                        >
                                {convertBtn}
                        </Button>
                    </Grid>
                    <Hidden only={['sm', 'md', 'lg', 'xl']}>
                        {showSaveBtn()}
                    </Hidden>
                </Grid>
            </Paper>
            {/* Convert currency form END */}

            {/* Save As Dialog */}
            <Dialog open={dialogOpened} onClose={closeDialog} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">{saveAs}</DialogTitle>
                <DialogContent>
                <DialogContentText>
                    {dialogText}
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    variant="outlined" 
                    name="saveAs"
                    onChange={onChange}
                    validate={true}
                    label={saveAs}
                    fullWidth />
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDialog} color="primary">
                        {cancelBtn}
                    </Button>
                    <Button onClick={saveResult} color="primary" variant="contained" disabled={saveBtnDisabled}>
                        {saveBtn}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
                }}
                open={snackbarOpened}
                autoHideDuration={6000}
                onClose={closeSnackbar}
                message={snackbarMessage}
                action={
                <>
                    <IconButton size="small" aria-label="close" color="inherit" onClick={closeSnackbar}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </>
                }
            />
        </>
    )
}

export default Converter;