import _ from "lodash";
import querySearch from "stringquery";

import {
  RESET_MAPPING,
  LOAD_ALL_MAPPINGS,
  LOAD_ALL_MAPPINGS_SUCCESS,
  LOAD_GROUP_NAME,
  LOAD_SUGGESTED_ITEMS,
  IMPORT_STUB,
  IMPORT_STUB_SUCCESS,
  ENABLE_STUB,
  DISABLE_STUB,
  CREATE_NEW_STUB,
  CREATE_NEW_STUB_SUCCESS,
  SHARE_GROUP,
  EDIT_STUB
} from "../actions/actions";
import { ofType, combineEpics } from "redux-observable";
import { map, mergeMap, concatAll } from "rxjs/operators";
import {
  loadAllMappings,
  loadAllMappingsSuccess,
  loadNodesSuccess,
  loadSuggestedItems,
  loadSuggestedItemsSuccess,
  loadGroupNamesSuccess,
  loadGroupNames,
  importStubSuccess,
  hideuploadStub,
  resetMapping,
  saveStubSuccess,
  createNewStubSuccess,
  addNewNodeToTree,
  toggleNode,
  hideshareGroupStub,
  hideEditStubModal,
} from "../actions";
import { of, empty,concat } from "rxjs";
import { statusDISABLE } from "../constant/index";

const _stringComparator = (a, b) => {
  if (a < b) {
    return -1;
  }
  if (a > b) {
    return 1;
  }
  return 0;
};

const resetMappingEpic = (action$, state$, { $resetMapping }) =>
  action$.pipe(
    ofType(RESET_MAPPING),
    mergeMap(() => {
      return $resetMapping().pipe(map(() => loadAllMappings()));
    })
  );
const loadAllMappingsEpic = (action$, state$, { $getMappings }) =>
  action$.pipe(
    ofType(LOAD_ALL_MAPPINGS),
    mergeMap(() => {
      const { context } = state$.value;
      let parameters = "";
      if (context) {
        parameters = "context=" + context;
      }
      return $getMappings(parameters).pipe(
        map(({ data }) => loadAllMappingsSuccess(data))
      );
    })
  );
const _getHashId = () => Math.floor(Math.random() * 100000);

const loadMappingStubToNodesEpic = (action$, state$, { $getMappings }) =>
  action$.pipe(
    ofType(LOAD_ALL_MAPPINGS_SUCCESS),
    mergeMap(({ payload }) => {
      // get id from url
      const { id } = querySearch(window.location.search);
      let toggleNodeName=undefined;

      //first grouping all data by file_name
      const dataHasName = payload.mappings;
      const groupDataByFileName = dataHasName.reduce((obj, item) => {
        obj[item.metadata.file_name] = obj[item.metadata.file_name] || [];
        const hashId = _getHashId() + _getHashId();
        let node = {
          obj: item,
          hashSuggestedId: hashId,
          hashId,
          name: item.name,
          active: item.id === id,
        };
        if(node.active){
          toggleNodeName = item.metadata.file_name;
        }
        try {
          node.obj.response.body = JSON.parse(node.obj.response.body);
        } catch (exception) {}
        obj[item.metadata.file_name].push(node);
        return obj;
      }, {});

      //next, sort by name
      const treeNodes = Object.keys(groupDataByFileName)
        .map(function(key) {
          return {
            name: key,
            children: [...groupDataByFileName[key]],
            hashId: _getHashId() + _getHashId(),
            toggled: key === toggleNodeName,
          };
        })
        .sort((a, b) =>
          _stringComparator(a.name.toLowerCase(), b.name.toLowerCase())
        );
      const rootTree = {
        toggled: true,
        rootNode: true,
        children: treeNodes,
        hashId: _getHashId() + _getHashId()
      };
      return of(
        loadNodesSuccess(rootTree),
        loadSuggestedItems(treeNodes),
        loadGroupNames(treeNodes)
      );
    })
  );

const loadSuggestedItemsEpic = (action$, state$) =>
  action$.pipe(
    ofType(LOAD_SUGGESTED_ITEMS),
    mergeMap(({ payload }) => {
      const suggestedItems = payload
        .flatMap(group => group.children)
        .map(item => ({
          value: item.hashSuggestedId,
          label:
            item.obj.request.method +
            " " +
            item.obj.name +
            "  " +
            item.obj.request.urlPattern
        }));
      return of(loadSuggestedItemsSuccess(suggestedItems));
    })
  );

const loadGroupNameEpic = (action$) =>
  action$.pipe(
    ofType(LOAD_GROUP_NAME),
    mergeMap(({ payload }) => {
      const groupNames = payload.map(group => ({
        value: group.name,
        label: group.name
      }));
      return of(loadGroupNamesSuccess(groupNames));
    })
  );

const importStubsEpic = (action$, state$, { $importStub }) =>
  action$.pipe(
    ofType(IMPORT_STUB),
    mergeMap(({ payload }) => {
      return $importStub(payload).pipe(
        map(({ data }) => importStubSuccess(data))
      );
    })
  );
const importStubsSuccessEpic = (action$) =>
  action$.pipe(
    ofType(IMPORT_STUB_SUCCESS),
    mergeMap(() => {
      return of(hideuploadStub(), resetMapping());
    })
  );

const enableStubEpic = (action$, state$, { $saveStub }) =>
  action$.pipe(
    ofType(ENABLE_STUB),
    mergeMap(() => {
      const stub = { ...state$.value.ui.selectedNode.obj };
      stub.response.body = JSON.stringify(stub.response.body);
      stub.metadata = { ...stub.metadata,status:undefined };

      return $saveStub(stub).pipe(
        map(data => {
          return saveStubSuccess(stub);
        })
      );
    })
  );
const disableStubEpic = (action$, state$, { $saveStub }) =>
  action$.pipe(
    ofType(DISABLE_STUB),
    mergeMap(() => {
      const stub = { ...state$.value.ui.selectedNode.obj };
      stub.response.body = JSON.stringify(stub.response.body);
      stub.metadata.status = statusDISABLE;

      return $saveStub(stub).pipe(
        map(data => {
          return saveStubSuccess(stub);
        })
      );
    })
  );

const createNewStubEpic = (action$, state$, { createStub }) =>
  action$.pipe(
    ofType(CREATE_NEW_STUB),
    mergeMap(({ payload }) => {
      return createStub(payload).pipe(
        concatAll(),
        map(({ data }) => {
          if (data.request.method === "OPTIONS") {
            return createNewStubSuccess();
          }
          return createNewStubSuccess(data);
        })
      );
    })
  );

const createNewStubSuccessEpic = (action$, state$, { createStub }) =>
  action$.pipe(
    ofType(CREATE_NEW_STUB_SUCCESS),
    mergeMap(({ payload: response }) => {
      if (!response) {
        return empty();
      }
      const hashId = _getHashId();
      response.hashId = hashId;
      if (response.metadata && response.metadata.context) {
        if (
          state$.value.context &&
          response.metadata.context === state$.value.context
        ) {
          return of(
            addNewNodeToTree(response),
            toggleNode({ node: { hashId }, toggled: true })
          );
        }
      } else {
        if (!state$.value.context) {
          return of(
            addNewNodeToTree(response),
            toggleNode({ node: { hashId }, toggled: true })
          );
        }
      }
      return empty();
    })
  );

const removeContextFromUrl = (context, url) => {
  return context ? "/" + _.trimStart(url, "/" + context) : url;
};

const shareGroupEpic = (action$, state$, { $importStub }) =>
  action$.pipe(
    ofType(SHARE_GROUP),
    mergeMap(({ payload }) => {
      const data = payload;

      let stubs = undefined;
      if (data.currentNode.rootNode) {
        stubs = state$.value.mapping.data.mappings.flatMap(a => a.children);
      } else {
        stubs = state$.value.mapping.data.mappings.filter(
          item => item.metadata.file_name === data.fromGroup
        );
      }
      if (stubs) {
        stubs = stubs.map(d => {
          return {
            name: d.name,
            metadata: {
              file_name: d.metadata.file_name,
              context: data.shareContext
            },
            request: {
              urlPattern:
                "/" +
                data.shareContext +
                removeContextFromUrl(
                  state$.value.context,
                  d.request.urlPattern
                ),
              method: d.request.method
            },
            response: {
              ...d.response,
              body: JSON.stringify(d.response.body)
            },
            persistent: true
          };
        });
      }

      return $importStub({
        mappings: stubs,
        importOptions: {
          duplicatePolicy: "IGNORE",
          deleteAllNotInImport: false
        }
      }).pipe(map(() => hideshareGroupStub()));
    })
  );

const updateStubEpic = (action$, state$, { $saveStub }) =>
  action$.pipe(
    ofType(EDIT_STUB),
    mergeMap(({ payload:{name, request, response}}) => {
      const stub = { ...state$.value.ui.selectedNode.obj };
      stub.request = request || stub.request;
      stub.response = response || stub.response;
      if (typeof stub.response.body === "object") {
        stub.response.body = JSON.stringify(stub.response.body);
      }
      stub.name = name || stub.name;
      stub.hashId = undefined;
      return concat(
        $saveStub(stub).pipe(
          map(() => {
            return hideEditStubModal();
          })),
          of(saveStubSuccess(stub)));

        }));


export default combineEpics(
  resetMappingEpic,
  loadAllMappingsEpic,
  loadMappingStubToNodesEpic,
  loadSuggestedItemsEpic,
  loadGroupNameEpic,
  importStubsEpic,
  importStubsSuccessEpic,
  enableStubEpic,
  disableStubEpic,
  createNewStubEpic,
  createNewStubSuccessEpic,
  shareGroupEpic,
  updateStubEpic
);
