import React, { useState } from "react";
import { TableRow, TableCell, withStyles, IconButton, Menu, MenuItem, Typography, ButtonGroup, Button, Grid } from "@material-ui/core";
import { InitiativeEntry } from "../Model/InitiativeEntries";
import * as InitModel from "../Model/InitModel";
import { Delete, ArrowUpward, FileCopy, ArrowDownward } from "@material-ui/icons";

type MouseEvt = React.MouseEvent<HTMLElement, MouseEvent>;

const styles = (theme: any) => ({
    initCell: {
        width: 'auto',
        align: 'right',
        padding: 'checkbox'
    },
    titleCell: {
        width: '100%'
    },
    actionCell: {
        width: 'auto'
    },
    hpControls: {
        marginRight: theme.spacing(2),
        alignSelf: 'center'
    }
});

const duplicates = [2, 3, 4, 5];

function InitRow(props: { classes: any, item: InitiativeEntry }) {
    const { classes } = props;
    const [hp, setHp] = useState(0);
    const item = InitModel.useInitEntryEvents(props.item.id, () => {});
    const [anchor, setAnchor] = useState<HTMLElement | null>(null);

    const handleClickButton = (event: MouseEvt) => {
        setAnchor(event.currentTarget);
    };

    const handleMenuItemClick = (event: MouseEvt, index: number) => {
        setAnchor(null);
        InitModel.duplicateInitEntry(item, duplicates[index]-1);
    };

    const handleClose = () => {
        setAnchor(null);
    };


    return (
        <TableRow selected={item.active}>
            <TableCell className={classes.actionCell} padding="checkbox">
                <div style={{ display: 'flex' }}>
                    <IconButton onClick={e => InitModel.moveInitEntryUp(item)} disabled={!item.canMoveUp}>
                        <ArrowUpward />
                    </IconButton>
                    <IconButton onClick={e => InitModel.moveInitEntryDown(item)} disabled={!item.canMoveDown}>
                        <ArrowDownward />
                    </IconButton>
                </div>
            </TableCell>
            <TableCell className={classes.initCell}>{item.init}</TableCell>
            <TableCell className={classes.titleCell}>
                <Typography variant="subtitle1">{item.name}</Typography>
            </TableCell>
            <TableCell className={classes.actionCell} padding="checkbox">
                <div style={{ display: 'flex' }}>
                    <Grid item 
                          alignItems='center'
                          style={{ alignSelf: 'center'}}>
                        <ButtonGroup color="primary" variant='outlined' size='small'>
                            <Button onClick={() => setHp(hp - 5)}>-5</Button>
                            <Button onClick={() => setHp(hp - 1)}>-1</Button>
                        </ButtonGroup>
                    </Grid>
                    <Grid item
                          alignItems='center' 
                          style={{ alignSelf: 'center'}}>                        
                        <Typography align='center' style={{width: 50}}>{hp}</Typography>
                    </Grid>
                    <Grid item
                          alignItems='center' 
                          className={classes.hpControls}>
                        <ButtonGroup color="primary" variant='outlined' size='small'>
                            <Button onClick={() => setHp(hp + 1)}>+1</Button>
                            <Button onClick={() => setHp(hp + 5)}>+5</Button>
                        </ButtonGroup>
                    </Grid>
                    <span>
                        <IconButton
                            onClick={handleClickButton}
                            className={classes.button}
                            aria-label="Duplicate Entry"
                        >
                            <FileCopy />
                        </IconButton>
                        <Menu
                            anchorEl={anchor}
                            open={Boolean(anchor)}
                            onClose={handleClose}
                        >
                            {duplicates.map((option, index) => (
                                <MenuItem
                                    dense={true}
                                    key={option}
                                    onClick={event => handleMenuItemClick(event, index)}
                                >
                                    {option}
                                </MenuItem>
                            ))}
                        </Menu>
                    </span>
                    <IconButton onClick={e => InitModel.removeInitEntry(item)}>
                        <Delete />
                    </IconButton>
                </div>
            </TableCell>
        </TableRow>
    );
}

export default withStyles(styles)(InitRow);