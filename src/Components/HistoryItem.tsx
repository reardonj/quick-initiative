import React from 'react';
import { withStyles, ListItem, ListItemText, ListItemSecondaryAction } from '@material-ui/core';
import { HistoryEntry } from '../Model/HistoryEntries';
import InitSelector from './InitSelector';
import * as InitModel from '../Model/InitModel';

const styles = (theme: any) => ({
    input: {
        margin: theme.spacing.unit,
    }
});

function HistoryItem(props: { classes: any, item: HistoryEntry }) {
    const { classes, item } = props;

    const handleInitSelected = (init: number) => {
        InitModel.addInitEntry(item.name, init);
    }

    return (
        <ListItem>
            <ListItemText primary={item.name} />
            <ListItemSecondaryAction>
                <InitSelector disabled={false} onSelected={handleInitSelected} />
            </ListItemSecondaryAction>
        </ListItem>
    )
}

export default withStyles(styles)(HistoryItem);