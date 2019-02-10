import React, { useState, ChangeEvent, useRef } from 'react';
import { Input, withStyles } from "@material-ui/core";
import InitSelector from "./InitSelector";
import * as InitModel from '../Model/InitModel';


const styles = (theme: any) => ({
    input: {
      margin: theme.spacing.unit,
    }
  });

function isNullOrEmpty(str: string|null) {
    return str === null || str.match(/^ *$/) !== null;
}

function FilteringItem(props: {classes: any}) {
    const { classes } = props;

    const inputEl = useRef<HTMLInputElement>(null);
    const [isSelectorDisabled, setSelectorDisabled] = useState(true);

    const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setSelectorDisabled(isNullOrEmpty(event.currentTarget.value));
    };
    const handleInitSelected = (init: number) => {
        if(inputEl.current == null) {
            return;
        }
        InitModel.addInitEntry(inputEl.current.value, init)
        inputEl.current.focus();
    };

    return (
        <div>
            <Input
                inputRef={inputEl}
                placeholder="Name"
                onChange={handleTextChange}
                className={classes.input}
                inputProps={{
                    'aria-label': 'Name',
            }} />
            <InitSelector disabled={isSelectorDisabled} onSelected={handleInitSelected} />
          </div>
    )
}

export default withStyles(styles)(FilteringItem);