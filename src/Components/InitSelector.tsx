import React, { useState } from 'react';
import { PlaylistAdd } from '@material-ui/icons';
import { withStyles, IconButton, Menu, MenuItem } from '@material-ui/core';
type MouseEvt = React.MouseEvent<HTMLElement, MouseEvent>;

const styles = (theme: any) => ({
    button: {
      margin: theme.spacing.unit,
    }
});

const inits = [-2,-1,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25];

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