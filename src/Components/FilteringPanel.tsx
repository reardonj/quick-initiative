import React, { useState, useRef, useMemo } from 'react';
import { Input, withStyles, List, ListItem, ListItemText, ListItemSecondaryAction, ListSubheader, Divider } from "@material-ui/core";
import InitSelector from "./InitSelector";
import * as InitModel from '../Model/InitModel';
import * as HistoryModel from '../Model/HistoryModel';
import { defaultHistoryEntrySort, HistoryEntry } from '../Model/HistoryEntries';
import HistoryItem from './HistoryItem';
import GroupCreator from './GroupCreator';
import { isNullOrEmpty } from '../Core/StringUtils';

const styles = () => ({
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

/**
 * Checks if an entry's name or groups contains a given string, using
 * case-insensitive comparison.
 * @param item The item to check.
 * @param filterText The text to match.
 */
function entryHasText(item: HistoryEntry, filterText: string): boolean {
    if(item.name.toLocaleLowerCase().includes(filterText.toLocaleLowerCase())) {
        return true;
    }

    let hasText = false;
    item.groups.forEach(x => {
        if(x.toLocaleLowerCase().includes(filterText.toLocaleLowerCase())) {
            hasText = true;
        }
    });

    return hasText;
}

function FilteringPanel(props: { classes: any }) {
    const { classes } = props;

    const inputEl = useRef<HTMLInputElement>(null);
    const [isSelectorDisabled, setSelectorDisabled] = useState(true);
    const [filterText, setFilterText] = useState("");

    const historyList = HistoryModel.useHistoryItemListEvents(HistoryModel.saveToLocalStorage);

    const filteredList = useMemo(
        () => historyList.filter(x => entryHasText(x, filterText)).sort(defaultHistoryEntrySort),
        [historyList, filterText]);

    // The group for entries about to be added to a named group.
    const pendingGroup = historyList.filter(x => x.groups.has(""));

    // The group for entries in no particular group.
    const others = filteredList.filter(x => x.groups.size === 0);

    // Set up the real groups.
    const groups = new Map<string, HistoryEntry[]>();
    for(const item of filteredList) {
        item.groups.forEach(group => {
            if(isNullOrEmpty(group)) {
                return;
            }

            const toAdd = groups.get(group) as HistoryEntry[];
            if (toAdd === undefined) {
                groups.set(group, [item]);
            } else {
                toAdd.push(item);
            }
        });
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
        HistoryModel.addHistoryItem(inputEl.current.value, [""]);
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
            <Divider />
            {
                pendingGroup.length > 0 ? (
                    <List>
                        <GroupCreator ></GroupCreator>  
                        {pendingGroup.map(
                            x => <HistoryItem key={x.name} item={x} showInit={false} />)
                        }
                        <Divider />
                    </List>
                ) :
                    <></>
            }
            <div className={classes.historyList}>
                {
                    Array.from(groups).sort((a,b)=> a[0].localeCompare(b[0])).map(entry => 
                        <List>
                            <ListSubheader disableSticky={true}>{entry[0]}</ListSubheader>
                            {(entry[1] as HistoryEntry[]).map(
                                x => <HistoryItem key={x.name} item={x} showInit={true} />)
                            }
                        </List>)
                }
                {
                    others.length > 0 ? (
                        <List>
                            <ListSubheader disableSticky={true}>Others</ListSubheader>
                            {others.map(x => <HistoryItem key={x.name} item={x} showInit={true} />)}
                        </List>
                    ) :
                        <></>
                }
            </div>
        </div>
    )
}

export default withStyles(styles)(FilteringPanel);