import React from "react";
import * as InitModel from "../Model/InitModel";
import { CurrentCombatState } from "../Model/CombatState";
import { withStyles, Fab } from "@material-ui/core";
import { PlayArrowOutlined, DeleteSweep } from "@material-ui/icons";

const styles = (theme: any) => ({
    fabBox: {
        position: 'absolute' as 'absolute',
        bottom: theme.spacing(2),
        right: theme.spacing(2)
    },
    fab: {
        marginLeft: theme.spacing(2)
      }
  });

function NextInitButton(props: any) { 
    const { classes } = props;
    const combatState = InitModel.useCombatStateEvents(() => {});
    const initItems = InitModel.useInitEntryListEvents(() => {});
    const noInitItems = initItems.length === 0;
    
    return (
        <div className={classes.fabBox}>
            <Fab className={classes.fab}
                color='secondary'
                disabled={noInitItems}
                onClick={() => initItems.forEach(x => InitModel.removeInitEntry(x))}>
                <DeleteSweep />
            </Fab>
            <Fab className={classes.fab} 
                color='primary'
                disabled={noInitItems}
                onClick={() => combatState instanceof CurrentCombatState ? 
                                    InitModel.nextInit() : 
                                    InitModel.startCombat()}>
                <PlayArrowOutlined />
            </Fab>
        </div>
    );
    

}

export default withStyles(styles)(NextInitButton);