import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Input, withStyles, List, ListItem, ListItemText, ListItemSecondaryAction } from "@material-ui/core";
import InitSelector from "./InitSelector";
import * as InitModel from '../Model/InitModel';
import * as HistoryModel from '../Model/HistoryModel';
import { defaultHistoryEntrySort } from '../Model/HistoryEntries';
import HistoryItem from './HistoryItem';


const styles = (theme: any) => ({
    input: {
    }
});

function isNullOrEmpty(str: string | null) {
    return str === null || str.match(/^ *$/) !== null;
}

function FilteringItem(props: { classes: any }) {
    const { classes } = props;

    const inputEl = useRef<HTMLInputElement>(null);
    const [isSelectorDisabled, setSelectorDisabled] = useState(true);
    const [filterText, setFilterText] = useState("");

    const historyList = HistoryModel.useHistoryItemListEvents(HistoryModel.saveToLocalStorage);

    const filteredList = useMemo(
        () => historyList.filter(x => x.name.includes(filterText)).sort(defaultHistoryEntrySort),
        [historyList, filterText]);


    const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setSelectorDisabled(isNullOrEmpty(event.currentTarget.value));
        setFilterText(event.currentTarget.value);
    };
    const handleInitSelected = (init: number) => {
        if (inputEl.current == null) {
            return;
        }
        InitModel.addInitEntry(inputEl.current.value, init)
        HistoryModel.addHistoryItem(inputEl.current.value);
        inputEl.current.value = "";
        setSelectorDisabled(true);
        setFilterText("");
    };

    return (
        <div>
            <List>
                <ListItem>
                    <ListItemText>
                        <Input
                            inputRef={inputEl}
                            placeholder="Name"
                            onChange={handleTextChange}
                            className={classes.input}
                            inputProps={{
                                'aria-label': 'Name',
                            }} />
                    </ListItemText>
                    <ListItemSecondaryAction>
                        <InitSelector disabled={isSelectorDisabled} onSelected={handleInitSelected} />
                    </ListItemSecondaryAction>
                </ListItem>
            </List>
            <List>
                {filteredList.map(x =>
                    <HistoryItem key={x.name} item={x} />
                )}
            </List>
        </div>
    )
}

export default withStyles(styles)(FilteringItem);