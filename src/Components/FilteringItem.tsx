import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Input, withStyles, List, ListItem, ListItemText, ListItemSecondaryAction, ListSubheader } from "@material-ui/core";
import InitSelector from "./InitSelector";
import * as InitModel from '../Model/InitModel';
import * as HistoryModel from '../Model/HistoryModel';
import { defaultHistoryEntrySort, HistoryEntry } from '../Model/HistoryEntries';
import HistoryItem from './HistoryItem';
import { string } from 'prop-types';


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

function groupHasText(item: HistoryEntry, filterText: string): boolean {
    for(const group in item.groups.entries()) {
        if(group.includes(filterText)) {
            return true;
        }
    }
    return false;
}

function FilteringItem(props: { classes: any }) {
    const { classes } = props;

    const inputEl = useRef<HTMLInputElement>(null);
    const [isSelectorDisabled, setSelectorDisabled] = useState(true);
    const [filterText, setFilterText] = useState("");

    const historyList = HistoryModel.useHistoryItemListEvents(HistoryModel.saveToLocalStorage);

    const filteredList = useMemo(
        () => historyList.filter(x => x.name.includes(filterText) || 
                                      groupHasText(x, filterText)
                                ).sort(defaultHistoryEntrySort),
        [historyList, filterText]);

    const others = filteredList.filter(x => x.groups.size == 0);
    const groups = new Map<string, HistoryEntry[]>();
    for(const item of filteredList) {
        for(const group in item.groups) {
            if (!groups.has(group)) {
                groups.set(group, []);
            }
            const toAdd = groups.get(group) as HistoryEntry[];
            toAdd.push(item);
        }
    }


    const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setSelectorDisabled(isNullOrEmpty(event.currentTarget.value));
        setFilterText(event.currentTarget.value);
    };
    const handleInitSelected = (init: number) => {
        if (inputEl.current == null) {
            return;
        }
        InitModel.addInitEntry(inputEl.current.value, init)
        HistoryModel.addHistoryItem(inputEl.current.value, []);
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
                    Array.from(groups.entries(), ([key, value]) => [key, value]).map(([key, value]) => 
                    {
                        return <List>
                            <ListSubheader disableSticky={true}>key</ListSubheader>
                            {(value as HistoryEntry[]).map(x => <HistoryItem key={x.name} item={x} />)}
                        </List>
                    })
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