
import React, { useEffect, useState } from 'react';
import {
    Grid,
    Card,
    CardContent,
    TextField,
    Typography,
    Box,
    Button,
    Switch
} from '@material-ui/core';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import DateRangeIcon from '@material-ui/icons/DateRange';
import ScheduleIcon from '@material-ui/icons/Schedule';
import { makeStyles } from '@material-ui/core/styles';
import firebase from 'firebase';
import { db, storage } from '../firebase';

import CashData from './CashData';
import { ContactsOutlined } from '@material-ui/icons';

const useStyles = makeStyles({
    signupForm: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    root: {
        minWidth: 200,
        width: 400,
        marginTop: '5%',
        marginBottom: '5%',
        position: 'fixed'
    },
    caption: {
        paddingTop: 20,
        marginBottom: 15,
        borderTop: '5px solid #3f50b5'
    },
    warning: {
        color: 'red'
    },
    dateTime: {
        paddingTop: 12,
        paddingBottom: 24,
        borderTop: '1px solid lightGrey'
    },
    dateCss: {
        fontSize: '10px',
    },
    inputs: {
        marginBottom: 12,
        width: '85%',
        marginLeft: 4
    },
    progress: {
        width: '85%'
    },
    uploadImageFile: {
        display: 'none'
    },
    submit: {
        width: '84%'
    },
    uploadImage: {
        textAlign: 'left',
        fontSize: '15px',
        color: '#3f50b5',
        border: '1px solid lightGrey',
        padding: '0.5rem',
        fontFamily: 'sans-serif',
        borderRadius: '0.3rem',
        cursor: 'pointer',
        marginTop: '1rem',
    },
    uploadButton: {
        border: 'none',
    },
    uploadIcon: {
        fontSize: 13,
        paddingRight: 10,
        paddingTop: 15,
    },
    uploadGrid: {
        marginBottom: 9
    }

});

function CashRegister() {

    const classes = useStyles();

    var today = new Date();
    var date = today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear();
    const [time, setTime] = useState(today.toLocaleTimeString());

    setInterval(() => {
        var d = new Date();
        var t = d.toLocaleTimeString();
        setTime(t);
    }, 1000);

    const [warning, setWarning] = useState('');
    const [image, setImage] = useState(null);
    const [progress, setProgress] = useState(0);
    const [cash, setCash] = useState({
        amount: '',
        remark: '',
        typePayment: false
    });
    const [cashReg, setCashReg] = useState([]);
    const [finalBalance, setFinalBalance] = useState(0);

    const setValue = (e) => {
        setCash({
            ...cash,
            [e?.target?.name]: e?.target?.value
        });
        setWarning('');
    }

    const handleImage = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleType = () => {
        setCash({
            ...cash,
            typePayment: !cash.typePayment
        })
    }

    const handleUpload = (e) => {
        e.preventDefault();

        if (cash.amount !== '' && cash.remark !== '' && image != null) {

            const uploadTask = storage.ref(`images/${image.name}`).put(image);

            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = Math.round(
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    );
                    setProgress(progress);
                },
                (error) => {
                    console.log(error);
                    alert(error.message);
                },
                () => {
                    storage
                        .ref("images")
                        .child(image.name)
                        .getDownloadURL()
                        .then(url => {
                            db.collection("cashReg").add({
                                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                                amount: cash.amount,
                                remark: cash.remark,
                                typePayment: cash.typePayment,
                                date: date,
                                imageUrl: url
                            })
                            console.log('Data Uploaded');
                            setProgress(0);
                            setCash({
                                amount: '',
                                remark: '',
                                typePayment: false
                            });
                            setWarning('');
                            setFinalBalance(0);
                        });
                }
            )
        }
        else {
            setWarning('Please fill all fields and bills!');
        }
    }

    useEffect(() => {
        db.collection('cashReg').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
            setCashReg(snapshot.docs.map(doc => ({
                id: doc.id,
                payment: doc.data()
            })));
        });

        cashReg.map(({ id, payment }) => {
            console.log(payment.amount);
            if (payment.typePayment)
                setFinalBalance(finalBalance + parseInt(payment.amount));
            else
                setFinalBalance(finalBalance - parseInt(payment.amount));
            console.log(finalBalance);
        })
    }, []);




    return (
        <div>
            <div className={classes.signupForm}>
                <Grid container>
                    <Grid sm={2} />
                    <Grid item md={4}>
                        <Card className={classes.root}>
                            <form>
                                <CardContent>
                                    <Typography className={classes.caption} variant="h5" component="h2">
                                        Cash Register
                                    </Typography>
                                    <Grid container spacing={1} className={classes.dateTime}>
                                        <Grid item xs={6} className={classes.dateCss}>
                                            <Button className={classes.dateIcon}
                                                variant="outlined"
                                                color="primary"
                                            >
                                                <DateRangeIcon />
                                                {date}
                                            </Button>
                                        </Grid>
                                        <Grid item xs={6} className={classes.timeCss}>
                                            <Button className={classes.timeIcon}
                                                variant="outlined"
                                                color="primary"
                                            >
                                                <ScheduleIcon />
                                                {time}
                                            </Button>
                                        </Grid>
                                    </Grid>
                                    <Box>
                                        <Typography className={classes.warning}>{warning}</Typography>
                                    </Box>
                                    <TextField className={classes.inputs}
                                        label="Amount"
                                        name="amount"
                                        type="tel"
                                        onChange={e => setValue(e)}
                                        variant="outlined"
                                    />
                                    <TextField className={classes.inputs}
                                        label="Remarks"
                                        name="remark"
                                        type="text"
                                        onChange={e => setValue(e)}
                                        variant="outlined"
                                    />
                                    <progress className={classes.progress}
                                        value={progress}
                                        max="100" />
                                    <Grid container>
                                        <Grid item xs={6} className={classes.uploadGrid}>
                                            <input onChange={handleImage} type="file" id="actual-btn" hidden />
                                            <label type="button" for="actual-btn" className={classes.uploadImage}><PhotoCameraIcon className={classes.uploadIcon} />Attach Image</label>
                                        </Grid>
                                    </Grid>
                                    <Grid>
                                        <Typography>
                                            Debit
                                            <Switch
                                                checked={cash.typePayment}
                                                color="primary"
                                                name="typePayment"
                                                onChange={handleType}
                                                inputProps={{ 'aria-label': 'primary checkbox' }}
                                            />
                                            Credit
                                        </Typography>
                                    </Grid>
                                    <Box textAlign="center">
                                        <Button className={classes.submit}
                                            variant="contained"
                                            color="primary"
                                            type="submit"
                                            onClick={e => handleUpload(e)}
                                        >Save
                                        </Button>
                                    </Box>
                                </CardContent>
                            </form>
                            {/* <CardContent>
                                <Grid container>
                                    <Grid item xs={6}>
                                        <Typography>Final Balance : </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        // {finalBalance}
                                    </Grid>
                                </Grid>
                            </CardContent> */}
                        </Card>
                    </Grid>
                    <Grid md={1} />
                    <Grid md={4} className={classes.paymentList}>
                        <div>
                            {cashReg.map(({ id, payment }) => {
                                return <CashData
                                    key={id}
                                    imageUrl={payment.imageUrl}
                                    amount={payment.amount}
                                    remark={payment.remark}
                                    typePayment={payment.typePayment}
                                    date={payment.date}
                                />
                            })}
                        </div>
                    </Grid>
                </Grid>
            </div>
        </div>
    )
}

export default CashRegister;
