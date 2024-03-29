import React from "react";
import { withStyles, Table, TableBody } from "@material-ui/core";
import * as InitModel from "../Model/InitModel";
import InitRow from "./InitRow";

const styles = (theme: any) => ({
    root: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
    initCell: {
        width: '50px',
        align: 'right'
    }
});

function InitList(props: any) {
    const { classes } = props;
    const initItems = InitModel.useInitEntryListEvents(() => {});

    return (
        <div className={classes.root}>
            <Table>
                <TableBody>
                    {initItems.map((item) =>
                        (<InitRow
                            item={item}
                            key={item.id}/>
                        ))}
                </TableBody>
            </Table>
        </div>
    );
}

export default withStyles(styles)(InitList);