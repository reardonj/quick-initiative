import React, { useState } from 'react';
import { withStyles, ListItem, ListItemText, ListItemSecondaryAction, ListItemIcon, IconButton } from '@material-ui/core';
import { HistoryEntry } from '../Model/HistoryEntries';
import InitSelector from './InitSelector';
import * as InitModel from '../Model/InitModel';
import * as HistoryModel from '../Model/HistoryModel';
import { FavoriteOutlined } from '@material-ui/icons';

const styles = (theme: any) => ({
    input: {
        margin: theme.spacing.unit,
    }
});

function HistoryItem(props: { classes: any, item: HistoryEntry }) {
    const { classes } = props;
    const [item, setItem] = useState(props.item);
    HistoryModel.useHistoryItemEvents(props.item.name, setItem);

    const handleInitSelected = (init: number) => {
        InitModel.addInitEntry(item.name, init);
    }

    const handleClick = () => {
        HistoryModel.toggleFavourite(item.name);
    }

    return (
        <ListItem dense button onClick={handleClick}>
            <ListItemText primary={item.name} />
            <ListItemSecondaryAction>
            {item.isFavourite ?
                <IconButton onClick={handleClick}><FavoriteOutlined /></IconButton> :
                <></>
            }
                <InitSelector disabled={false} onSelected={handleInitSelected} />
            </ListItemSecondaryAction>
        </ListItem>
    )
}

export default withStyles(styles)(HistoryItem);