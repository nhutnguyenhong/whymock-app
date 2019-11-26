import React from "react";
import { Treebeard } from "react-treebeard";

import {darkTheme, lightTheme} from '../theme/tree';

export const TreeOfStubs = ({ nodes, onNodeSelected, mode }) => {
  return nodes !== undefined ? (
    <Treebeard data={nodes} onToggle={onNodeSelected}  style={mode==='dard'? darkTheme: lightTheme}/>
  ) : (
    <div className="not-available">Not available</div>
  );
};
