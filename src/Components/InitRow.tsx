import React, { useState } from "react";
import { TableRow, TableCell, withStyles, IconButton, Menu, MenuItem, Typography } from "@material-ui/core";
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
        width: 'atuo'
    }
});

const duplicates = [1, 2, 3, 4];

function InitRow(props: { classes: any, item: InitiativeEntry }) {
    const { classes } = props;
    const item = InitModel.useInitEntryEvents(props.item.id, () => {});


    const [anchor, setAnchor] = useState<HTMLElement | null>(null);

    const handleClickButton = (event: MouseEvt) => {
        setAnchor(event.currentTarget);
    };

    const handleMenuItemClick = (event: MouseEvt, index: number) => {
        setAnchor(null);
        InitModel.duplicateInitEntry(item, duplicates[index]);
    };

    const handleClose = () => {
        setAnchor(null);
    };


    return (
        <TableRow selected={item.active}>
            <TableCell className={classes.initCell}>{item.init}</TableCell>
            <TableCell className={classes.titleCell}>
                <Typography variant="subheading">{item.name}</Typography>
            </TableCell>
            <TableCell className={classes.actionCell} padding="checkbox">
                <div style={{ display: 'flex' }}>
                    <IconButton onClick={e => InitModel.moveInitEntryUp(item)} disabled={!item.canMoveUp}>
                        <ArrowUpward />
                    </IconButton>
                    <IconButton onClick={e => InitModel.moveInitEntryDown(item)} disabled={!item.canMoveDown}>
                        <ArrowDownward />
                    </IconButton>
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