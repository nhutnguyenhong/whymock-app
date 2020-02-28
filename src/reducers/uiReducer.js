import _ from 'lodash';

import {
  LOAD_NODES_SUCCESS,
  LOAD_SUGGESTED_ITEMS_SUCCESS,
  LOAD_GROUP_NAME_SUCCESS,
  SELECT_NODE,
  TOGGLE_NODE,
  DEACTIVE_SELETED_NODE,
  DEACTIVE_NODE,
  SAVE_STUB_SUCCESS,
  ADD_NEW_NODE_TO_TREE,
  DELETE_STUB_SUCCESS,
  TOGGLE_NODE_BY_ID
} from "../actions/actions";
import { _getHashId } from "../utils";

const initialState = {
  selectedNode: {},
  rootTree: {},
  suggestedItems: {}
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SELECT_NODE:
      return {
        ...state,
        selectedNode: action.payload
      };
    case LOAD_NODES_SUCCESS:
      return {
        ...state,
        rootTree: action.payload
      };
    case LOAD_SUGGESTED_ITEMS_SUCCESS:
      return {
        ...state,
        suggestedItems: action.payload
      };
    case LOAD_GROUP_NAME_SUCCESS:
      return {
        ...state,
        groupNames: action.payload
      };

    case TOGGLE_NODE: {

      const hashId = action.payload.node.hashId;
      
      //does toggle the rootTree?
      if (state.rootTree.hashId === hashId) {
        return {
          ...state,
          rootTree: {
            ...state.rootTree,
            active: true,
            toggled: action.payload.toggled
          },
          selectedNode: state.rootTree,
        };
      }

      //does toggle the group node?
      let selectedNode = undefined;
      const newNodes = state.rootTree.children.map(node => {
        if (node.hashId === hashId) {
          selectedNode = node;
          return {
            ...node,
            active: true,
            toggled: action.payload.toggled
          };
        } else {
          //does toggle the stub node?
          const foundChild = false;
          const newChildren = node.children.map(stub => {
            if (stub.hashId === hashId) {
              foundChild = true;
              selectedNode = stub;
              return {
                ...stub,
                active: true
              };
            }
             return {
              ...stub,
              active: false,
            };;
          });
          return {
            ...node,
            children: newChildren,
            toggled: foundChild? true: node.toggled,
          };
        }
      });
      return {
        ...state,
        rootTree: {
          ...state.rootTree,
          children: newNodes
        },
        selectedNode: selectedNode? selectedNode: state.selectedNode,
      };
    }

    case TOGGLE_NODE_BY_ID: {

      const id = action.payload.node.id;
      if(!state.rootTree){
        return state;
      }
      let selectedNode = undefined;
      const newNodes = state.rootTree.children.map(node => {
          //does toggle the stub node?
          let foundChild = false;
          const newChildren = node.children.map(stub => {
            if (stub.obj.id === id) {
              foundChild = true;
              selectedNode = stub;
              return {
                ...stub,
                active: true
              };
            }
             return {
              ...stub,
              active: false,
            };;
          });
          return {
            ...node,
            children: newChildren,
            toggled: foundChild? true: node.toggled,
          };
        }
      );
      return {
        ...state,
        rootTree: {
          ...state.rootTree,
          children: newNodes
        },
        selectedNode: selectedNode? selectedNode: state.selectedNode,
      };
    }

    case DEACTIVE_NODE: {
      const hashId = action.payload.hashId;

      //does deactive the rootTree?
      if (state.rootTree.hashId === hashId) {
        return {
          ...state,
          rootTree: {
            ...state.rootTree,
            active: false
          }
        };
      }

      // does deactive the group node?
      const newNodes = state.rootTree.children.map(node => {
        if (node.hashId === hashId) {
          return {
            ...node,
            active: false
          };
        } else {
          const newChildren = node.children.map(stub => {
            if (stub.hashId === hashId) {
              return {
                ...stub,
                active: false
              };
            }
            return stub;
          });
          return {
            ...node,
            children: newChildren
          };
        }
      });
      return {
        ...state,
        rootTree: {
          ...state.rootTree,
          children: newNodes
        }
      };
    }

    case SAVE_STUB_SUCCESS:
      const id = action.payload.id;

      let foundStub = undefined;

      const newNodes = state.rootTree.children.map(node => {
        const newChildren = node.children.map(stub => {
          if (stub.obj.id === id) {
            const newStub= {
              ...stub,
              name: action.payload.name,
              obj: {
                ...stub.obj,
                ...action.payload,
                response: {
                  ...action.payload.response,
                  body: JSON.parse(action.payload.response.body)
                }
              }
            };
            foundStub=newStub;
            return newStub;
          }
          return stub;
        });
        return {
          ...node,
          children: newChildren
        };
      });


      return {
        ...state,
        rootTree: {
          ...state.rootTree,
          children: newNodes
        },
        selectedNode: foundStub && state.selectedNode.obj && foundStub.obj.id=== state.selectedNode.obj.id? {...foundStub}:state.selectedNode,
      };

      case ADD_NEW_NODE_TO_TREE:
      const node = action.payload;
        const dataTree = state.rootTree;
        if (!dataTree || !dataTree.children) {
          return{...state};
        }
        let foundGroup = dataTree.children.filter(
          group => group.name === node.metadata.file_name
        );

        node.response.body = JSON.parse(node.response.body);
        const newNode = {
          obj: node,
          hashSuggestedId: node.hashId,
          hashId: node.hashId,
          name: node.name,

        };

        if (foundGroup.length === 0) {
          foundGroup = { name: node.metadata.file_name, children: [newNode],hashId:_getHashId()};
          return{
            ...state,
            rootTree:{
              ...state.rootTree,
              children:[
                foundGroup,
                ...state.rootTree.children,
              ]
            }
          }
        } else {
          return{
            ...state,
            rootTree:{
              ...state.rootTree,
              children: state.rootTree.children.map(group=>{
                if(group.name === node.metadata.file_name){
                  return {
                    ...group,
                    children:[
                      newNode,
                      ...group.children,
                    ]
                  }
                }else{
                  return group;
                }
              }),
            }
          }
        }
       case DELETE_STUB_SUCCESS:
         const stubId = action.payload;
         const found = false;
        return{
          ...state,
          rootTree:{
            ...state.rootTree,
            children: state.rootTree.children.map(group=>{
              if(found){
                return group;
              }
              const length = group.children.length;
              _.remove(group.children, (item)=> item.obj.id === stubId);
              if(length!== group.children.length){
                found = true;
              }
              return group;
              
            }),
          },
          selectedNode: {},
        }
    default:
      return state;
  }
};
