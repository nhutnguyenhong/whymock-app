import { combineEpics } from "redux-observable";
import userSettingEpic from './userSettingEpic';
import mappingEpic from "./mappingEpic";
import uiEpic from "./uiEpic";


const epics = [userSettingEpic, mappingEpic, uiEpic];

const rootEpic = combineEpics(...epics);

export default rootEpic;
