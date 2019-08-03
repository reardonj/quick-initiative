import React from "react";
import * as InitModel from "../Model/InitModel";
import { CurrentCombatState } from "../Model/CombatState";
import { withStyles, Fab } from "@material-ui/core";
import { PlayArrowOutlined } from "@material-ui/icons";

const styles = (theme: any) => ({
    fab: {
        color: 'primary' as 'primary',
        position: 'absolute' as 'absolute',
        bottom: theme.spacing(2),
        right: theme.spacing(2),
      }
  });

function NextInitButton(props: any) {
    const { classes } = props;
    const combatState = InitModel.useCombatStateEvents(() => {});
    
    return (
        <Fab className={classes.fab} 
             color='primary'
             onClick={() => combatState instanceof CurrentCombatState ? 
                                InitModel.nextInit() : 
                                InitModel.startCombat()}>
            <PlayArrowOutlined />
        </Fab>
    );
    

}

export default withStyles(styles)(NextInitButton);