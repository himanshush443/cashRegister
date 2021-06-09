import {
    Grid,
    Card,
    CardContent,
    Typography,
} from '@material-ui/core';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    payment: {
        width: 300,
        border: '1px solid lightGrey',
        margin: 20,
    },
    paymentDate: {
        color: props => props.color,
        fontSize: 14,
        textAlign: 'left'
    },
    paymentRemark: {
        color: props => props.color,
        fontSize: 18,
        textAlign: 'left'
    },
    paymentAmount: {
        color: props => props.color,
        fontSize: props => props.fontSize,
        textAlign: 'right'
    },
    imageStyle: {
        width: '100%',
        objectFit: 'contain'
    }
});

function CashData(props) {

    const { amount, remark, imageUrl, typePayment, date } = props;
    const color = typePayment ? 'lightGreen' : 'red';
    const size = typePayment ? '16px' : '14px';
    const classes = useStyles({ color: color, fontSize: size });

    return (
        <CardContent className={classes.payment}>
            <Grid container>
                <Grid item xs={6}>
                    <Grid className={classes.paymentDate}>
                        {date}
                    </Grid>
                    <Grid className={classes.paymentRemark}>
                        {remark}
                    </Grid>
                </Grid>
                <Grid xs={2} />
                <Grid xs={4} className={classes.paymentAmount}>
                    {typePayment ? '' : '-'}{amount}
                </Grid>
            </Grid>
            <hr/>
            <Grid xs={12}>
                <img className={classes.imageStyle}
                    src={imageUrl}
                />
            </Grid>
        </CardContent>

    )
}

export default CashData