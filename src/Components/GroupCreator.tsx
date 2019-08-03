import React, { useRef, useState } from 'react';
import { withStyles, ListItem, ListItemText, ListItemSecondaryAction, Input, Button, IconButton } from '@material-ui/core';
import { HistoryEntry } from '../Model/HistoryEntries';
import InitSelector from './InitSelector';
import * as InitModel from '../Model/InitModel';
import * as HistoryModel from '../Model/HistoryModel';
import { isNullOrEmpty } from '../Core/StringUtils';
import { LibraryAdd } from '@material-ui/icons';

const styles = (theme: any) => ({
    input: {
        margin: theme.spacing(1),
    }
});

function GroupCreator(props: { classes: any }) {
    const { classes } = props;

    const inputEl = useRef<HTMLInputElement>(null);
    const [isCreateGroupButtonDisabled, setSelectorDisabled] = useState(true);
    const [nameText, setNameText] = useState("");

    const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setSelectorDisabled(isNullOrEmpty(event.currentTarget.value));
        setNameText(event.currentTarget.value);
    };

    const createGroup = () => {
        HistoryModel.renameGroup("", nameText);
    }
    
    return (
        <ListItem>
            <ListItemText>
                <Input
                    inputRef={inputEl}
                    placeholder="Group Name"
                    onChange={handleTextChange}
                    inputProps={{
                        'aria-label': 'Group Name',
                    }} />
            </ListItemText>
            <ListItemSecondaryAction>
                <IconButton className={classes.input} 
                            disabled={isCreateGroupButtonDisabled} onClick={createGroup}>
                    <LibraryAdd />
                </IconButton>
            </ListItemSecondaryAction>
        </ListItem>
    )
}

export default withStyles(styles)(GroupCreator);