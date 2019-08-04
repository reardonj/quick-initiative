import React from 'react';
import { withStyles, ListItem, ListItemText, ListItemSecondaryAction, IconButton } from '@material-ui/core';
import { HistoryEntry } from '../Model/HistoryEntries';
import InitSelector from './InitSelector';
import * as InitModel from '../Model/InitModel';
import * as HistoryModel from '../Model/HistoryModel';
import { Delete } from '@material-ui/icons';

const styles = (theme: any) => ({
    input: {
        margin: theme.spacing(1),
    }
});

function HistoryItem(props: { classes: any, item: HistoryEntry, showInit: boolean }) {
    const item = HistoryModel.useHistoryItemEvents(props.item.name, () => { });

    const handleInitSelected = (init: number) => {
        InitModel.addInitEntry(item.name, init);
    }

    const handleClick = () => {
        if(item.groups.has("") && !props.showInit) {
            HistoryModel.removeHistoryItemFromGroup(item, "");
        } else {
            HistoryModel.addHistoryItemToGroup(item, "");
        }
    }

    return (
        <ListItem dense button onClick={handleClick}>
            <ListItemText primary={item.name} />
            {
                props.showInit ? 
                    <ListItemSecondaryAction>
                        <IconButton onClick={() => HistoryModel.removeHistoryItem(item)}>
                            <Delete />
                        </IconButton>
                        <InitSelector disabled={false} onSelected={handleInitSelected} />
                    </ListItemSecondaryAction>
                : 
                    <></>
            }
        </ListItem>
    )
}

export default withStyles(styles)(HistoryItem);