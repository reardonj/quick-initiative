import React, { useState } from 'react';
import { PlaylistAdd } from '@material-ui/icons';
import { withStyles, IconButton, Menu, MenuItem } from '@material-ui/core';
type MouseEvt = React.MouseEvent<HTMLElement, MouseEvent>;

const styles = (theme: any) => ({
    button: {
      margin: theme.spacing(1),
    }
});

const inits = [25, 24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, -1, -2];

function InitSelector(props: {classes: any, disabled: boolean, onSelected: ((x: number) => void)}) {
    const { classes, disabled, onSelected } = props;

    const [anchor, setAnchor] = useState<HTMLElement|null>(null);

    const handleClickButton = (event: MouseEvt) => {
        setAnchor(event.currentTarget);
    };
  
    const handleMenuItemClick = (event: MouseEvt, index: number) => {
        setAnchor(null);
        onSelected(inits[index]);
    };
  
    const handleClose = () => {
        setAnchor(null);
    };

    return (
        <span>
            <IconButton 
                onClick={handleClickButton}
                className={classes.button} 
                disabled={disabled}
                aria-label="Add to Initiative"
            >
                <PlaylistAdd/>
            </IconButton>
            <Menu                
                id="lock-menu"
                anchorEl={anchor}
                open={Boolean(anchor)}
                onClose={handleClose}
            >
            {inits.map((option, index) => (
                <MenuItem
                    dense={true}
                    key={option}
                    onClick={event => handleMenuItemClick(event, index)}
                >
                {option}
                </MenuItem>
            ))}
            </Menu>
        </span>)
}

export default withStyles(styles)(InitSelector);