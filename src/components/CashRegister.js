
import React, { useState } from 'react';
import {
    Grid,
    Card,
    CardContent,
    TextField,
    Typography,
    Box,
    Button
} from '@material-ui/core';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import DateRangeIcon from '@material-ui/icons/DateRange';
import ScheduleIcon from '@material-ui/icons/Schedule';
import { makeStyles } from '@material-ui/core/styles';
import firebase from 'firebase';
import { db, storage } from '../firebase';

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
        marginBottom: '5%'
    },
    caption: {
        marginBottom: 40,
    },
    warning: {
        color: 'red'
    },
    dateTime: {
        paddingTop: 12,
        paddingBottom: 24,
        borderTop: '1px solid lightgrey'
    },
    dateCss: {
        fontSize: '10px',
    },
    timeCss: {

    },
    inputs: {
        marginBottom: 12,
        width: '82%'
    },
    uploadImage: {
        textAlign: 'left',
        fontSize: '10px',
        fontWeight: '800',
        marginRight: '-10px'
    },
    submit: {
        width: '82%'
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
        image: ''
    });

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

    const handleUpload = () => {
        if (cash.amount !== '' && cash.remark !== '') {
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
                    // Error function
                    console.log(error);
                    alert(error.message);
                },
                () => {
                    // Complete function
                    storage
                        .ref("images")
                        .child(image.name)
                        .getDownloadURL()
                        .then(url => {
                            // post image into db
                            db.collection("cashReg").add({
                                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                                amount: cash.amount,
                                remark: cash.remark,
                                imageUrl: url
                            })
                            console.log('Data Uploaded');
                            setProgress(0);
                            setCash({
                                amount: '',
                                remark: '',
                                image: ''
                            });
                            setWarning('');
                        });
                }
            )
        }
        else {
            setWarning('Please fill amount and remark!');
        }
    }

    // const handleSubmit = (e) => {
    //     e.preventDefault();
    // if (cash.amount !== '' && cash.remark !== '') {
    //         cashDataSubmit(cash);
    //         setCash({
    //             amount: '',
    //             remark: '',
    //             image: ''
    //         });
    //         setWarning('');
    //     }
    //     else
    //         setWarning('Please fill all fields and upload image!');
    // }

    return (
        <div>
            <div className={classes.signupForm}>
                <Card className={classes.root}>
                    <form>
                        <CardContent>
                            <Typography className={classes.caption} variant="h5" component="h2">
                                Cash Register
                            </Typography>
                            <Grid container spacing={1} className={classes.dateTime}>
                                {/* <Grid xs={1} /> */}
                                <Grid item xs={6} className={classes.dateCss}>
                                    <Button className={classes.dateIcon}
                                        variant="outlined"
                                        color="primary"
                                    >
                                        <DateRangeIcon />
                                        {date}
                                    </Button>
                                </Grid>
                                {/* <Grid xs={1} /> */}
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
                            <progress value={progress} max="100" />

                            <Grid container>
                                <Grid xs={1} />
                                <Grid item xs={6}>
                                    <Button className={classes.uploadImage}
                                        variant="outlined"
                                        color="primary"
                                    >
                                        <PhotoCameraIcon />
                                        Attach Image
                                        <input
                                            type="file"
                                            onChange={handleImage}
                                            hidden
                                        />
                                    </Button>
                                </Grid>
                            </Grid>
                            <Box textAlign="center">
                                <Button className={classes.submit}
                                    variant="contained"
                                    color="primary"
                                    type="submit"
                                    onClick={handleUpload}
                                >
                                    Save
                                </Button>
                            </Box>
                        </CardContent>
                    </form>
                </Card>
            </div>
        </div>
    )
}

export default CashRegister;
