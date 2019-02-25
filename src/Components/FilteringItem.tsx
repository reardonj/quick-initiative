import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Input, withStyles, List, ListItem, ListItemText, ListItemSecondaryAction, ListSubheader } from "@material-ui/core";
import InitSelector from "./InitSelector";
import * as InitModel from '../Model/InitModel';
import * as HistoryModel from '../Model/HistoryModel';
import { defaultHistoryEntrySort } from '../Model/HistoryEntries';
import HistoryItem from './HistoryItem';


const styles = (theme: any) => ({
    input: {
    },
    historyList: {
        overflow: 'scroll',
        height: 'calc(100% - 70px)'
    },
    filteringBar: {
        overflow: 'hidden'
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

    const favourites = filteredList.filter(x => x.isFavourite);
    const others = filteredList.filter(x => !x.isFavourite);


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
        <div className={classes.filteringBar}>
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
            <div className={classes.historyList}>
                {
                    favourites.length > 0 ? (
                        <List>
                            <ListSubheader disableSticky={true}>Favourites</ListSubheader>
                            {favourites.map(x => <HistoryItem key={x.name} item={x} />)}
                        </List>
                    ) :
                        <></>
                }
                {
                    others.length > 0 ? (
                        <List>
                            <ListSubheader disableSticky={true}>Others</ListSubheader>
                            {others.map(x => <HistoryItem key={x.name} item={x} />)}
                        </List>
                    ) :
                        <></>
                }
            </div>
        </div>
    )
}

export default withStyles(styles)(FilteringItem);