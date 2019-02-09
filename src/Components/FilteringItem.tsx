import React, { useState, ChangeEvent } from 'react';
import { Input, withStyles } from "@material-ui/core";
import InitSelector from "./InitSelector";

const styles = (theme: any) => ({
    content: {
      flexGrow: 1,
      padding: theme.spacing.unit * 3,
    },
    input: {
      margin: theme.spacing.unit,
    }
  });

function isNullOrEmpty(str: string|null) {
    return str === null || str.match(/^ *$/) !== null;
}

function FilteringItem(props: any) {
    const { classes } = props;
    const [isSelectorDisabled, setSelectorDisabled] = useState(true);

    const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setSelectorDisabled(isNullOrEmpty(event.currentTarget.value));
    };

    return (
        <div>
            <Input
                placeholder="Name"
                onChange={handleTextChange}
                className={classes.input}
                inputProps={{
                    'aria-label': 'Name',
            }} />
            <InitSelector disabled={isSelectorDisabled} />
          </div>
    )
}

export default withStyles(styles)(FilteringItem);