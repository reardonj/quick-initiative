import React, { useState, useEffect } from "react";
import { TableRow, TableCell, withStyles } from "@material-ui/core";
import { InitiativeEntry } from "../Model/InitiativeEntries";
import * as InitModel from "../Model/InitModel";

const styles = (theme: any) => ({
    initCell: {
        width: '3em',
        align: 'right',
        padding: 'checkbox'
    }
});

function InitRow(props: { classes: any, item: InitiativeEntry }) {
    const { classes } = props;
    const [item, setItem] = useState(props.item);

    useEffect(() => {
        InitModel.subscribeToInitEntry(item.id, setItem);
        return function cleanup() {
            InitModel.unsubscribeToInitEntry(item.id, setItem);
        }
    });

    return (
        <TableRow selected={item.active}>
            <TableCell className={classes.initCell}>{item.init}</TableCell>
            <TableCell>{item.name}</TableCell>
        </TableRow>
    );
}

export default withStyles(styles)(InitRow);