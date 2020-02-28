import { ofType, combineEpics } from "redux-observable";
import { map, mergeMap } from "rxjs/operators";
import _ from "lodash";
import { push } from "react-router-redux";

import { loadAllMappings, deleteStubSuccess, changeUrl } from "../actions";
import {
  EXPORT_STUB,
  EXPORT_GROUP_STUB,
  BACK_TO_DEFAULT_CONTEXT,
  SWITCH_TO_NEW_CONTEXT,
  DELETE_STUB,
  CHANGE_URL,
  TOGGLE_NODE,
  SELECT_NODE
} from "../actions/actions";
import { download } from "../utils";
import { empty, never, of } from "rxjs";

const exportStub = (action$, state$) =>
  action$.pipe(
    ofType(EXPORT_STUB),
    mergeMap(() => {
      const { obj } = state$.value.ui.selectedNode;
      const exportedStub = {
        ...obj,
        id: undefined,
        uuid: undefined
      };
      download(JSON.stringify(exportedStub, null, "\t"), obj.name);
      return empty();
    })
  );

const exportGroupStub = (action$, state$) =>
  action$.pipe(
    ofType(EXPORT_GROUP_STUB),
    mergeMap(() => {
      if (state$.value.ui.selectedNode.rootNode) {
        //is root node so export everything
        const children = state$.value.ui.selectedNode.children
          .flatMap(c => c.children)
          .map(c => ({
            ...c.obj,
            id: undefined,
            uuid: undefined
          }));
        const fileName = state$.value.ui.selectedNode.name;
        download(JSON.stringify(children, null, "\t"), fileName);
      } else {
        const children = state$.value.ui.selectedNode.children.map(c => ({
          ...c.obj,
          id: undefined,
          uuid: undefined
        }));
        const fileName = state$.value.ui.selectedNode.name;
        download(JSON.stringify(children, null, "\t"), fileName);
      }
      return empty();
    })
  );

const backToDefaultContextEpic = action$ =>
  action$.pipe(
    ofType(BACK_TO_DEFAULT_CONTEXT),
    mergeMap(() => {
      return of(loadAllMappings());
    })
  );

const switchToNewContextEpic = action$ =>
  action$.pipe(
    ofType(SWITCH_TO_NEW_CONTEXT),
    mergeMap(({ payload }) => {
      return of(loadAllMappings(), changeUrl({ context: payload }));
    })
  );

const deleteStubEpic = (action$, state$, { $deleteStub }) =>
  action$.pipe(
    ofType(DELETE_STUB),
    mergeMap(() => {
      const { name, id } = state$.value.ui.selectedNode.obj;
      let confirmOnDelete = true;

      if (state$.value.userSettings) {
        confirmOnDelete = state$.value.userSettings.confirmOnDelete;
      }

      if (confirmOnDelete || confirmOnDelete === undefined) {
        if (confirm('Can you confirm delete "' + name + '" ?')) {
          return $deleteStub(id).pipe(map(() => deleteStubSuccess(id)));
        }
      } else {
        return $deleteStub(id).pipe(map(() => deleteStubSuccess(id)));
      }
    })
  );

const changeHistoryUrlEpic = action$ =>
  action$.pipe(
    ofType(CHANGE_URL),
    mergeMap(({ payload: { id, context } }) => {
      let params = [];
      if (id) {
        params.push(`id=${id}`);
      }
      if (context) {
        params.push(`context=${context}`);
      }
      return of(
        push({
          pathname: "/",
          search: `?${_.join(params, "&")}`
        })
      );
    })
  );

const toggleNodeEpic = action$ =>
  action$.pipe(
    ofType(SELECT_NODE),
    mergeMap(({ payload: node}) => {
      if(!node.children){
        return of(changeUrl({id:node.obj.id}));
      }
      return empty();
    })
  );

export default combineEpics(
  exportStub,
  exportGroupStub,
  backToDefaultContextEpic,
  switchToNewContextEpic,
  deleteStubEpic,
  changeHistoryUrlEpic,
  toggleNodeEpic,
);
