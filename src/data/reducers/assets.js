import { combineReducers } from 'redux';

import { assetActions } from '../constants/actionTypes';
import { assetLoading } from '../constants/loadingTypes';

import { addLoadingField, removeLoadingField, toggleLockAsset } from './utils';
import { getAssetAPIAttributeFromDatabaseAttribute } from '../../utils/getAssetsAttributes';

export const filtersInitial = {
  assetTypes: {},
};

export const paginationInitial = {
  start: 0,
  end: 0,
  page: 0,
  pageSize: 50,
  totalCount: 0,
};

export const sortInitial = {
  sort: 'date_added',
  direction: 'desc',
};

export const requestInitial = {
  ...filtersInitial,
  ...paginationInitial,
  ...sortInitial,
};


export const filters = (state = filtersInitial, action) => {
  switch (action.type) {
    case assetActions.REQUEST_ASSETS_SUCCESS:
      return { ...state, assetTypes: { ...state.assetTypes, ...action.data } };
    default:
      return state;
  }
};

export const assets = (state = [], action) => {
  let assetsList;
  switch (action.type) {
    case assetActions.REQUEST_ASSETS_SUCCESS:
      return action.data.assets;
    case assetActions.DELETE_ASSET_SUCCESS:
      return state.filter(asset => asset.id !== action.assetId);
    case assetActions.TOGGLE_LOCK_ASSET_SUCCESS:
      assetsList = removeLoadingField(state, action.asset.id, assetLoading.LOCK);
      return toggleLockAsset(assetsList, action.asset.id);
    case assetActions.TOGGLING_LOCK_ASSET_FAILURE:
      return removeLoadingField(state, action.assetId, assetLoading.LOCK);
    case assetActions.TOGGLING_LOCK_ASSET_SUCCESS:
      return addLoadingField(state, action.asset.id, assetLoading.LOCK);
    case assetActions.DELETE_ASSET_FAILURE:
      return [];
    default:
      return state;
  }
};

export const pagination = (state = paginationInitial, action) => {
  switch (action.type) {
    case assetActions.REQUEST_ASSETS_SUCCESS:
      return {
        start: action.data.start,
        end: action.data.end,
        page: action.data.page,
        pageSize: action.data.pageSize,
        totalCount: action.data.totalCount,
      };
    default:
      return state;
  }
};

export const sort = (state = sortInitial, action) => {
  switch (action.type) {
    case assetActions.REQUEST_ASSETS_SUCCESS:
      return {
        sort: getAssetAPIAttributeFromDatabaseAttribute(action.data.sort),
        direction: action.data.direction,
      };
    default:
      return state;
  }
};

export const status = (state = {}, action) => {
  switch (action.type) {
    case assetActions.REQUEST_ASSETS_SUCCESS:
      return {
        response: action.response,
        type: action.type,
      };
    case assetActions.REQUEST_ASSETS_FAILURE:
      return {
        response: action.response,
        type: action.type,
      };
    case assetActions.CLEAR_ASSETS_STATUS:
      return {};
    case assetActions.DELETE_ASSET_SUCCESS:
      return {
        response: action.response,
        type: action.type,
      };
    case assetActions.DELETE_ASSET_FAILURE:
      return {
        response: action.response,
        type: action.type,
      };
    case assetActions.TOGGLING_LOCK_ASSET_FAILURE:
      return {
        asset: action.asset,
        response: action.response,
        type: action.type,
      };
    default:
      return state;
  }
};

export const request = (state = requestInitial, action) => {
  switch (action.type) {
    case assetActions.SORT_UPDATE:
      return {
        ...state,
        sort: action.data.sort,
        direction: action.data.direction,
      };
    case assetActions.PAGE_UPDATE:
      return {
        ...state,
        page: action.data.page,
      };
    case assetActions.FILTER_UPDATED:
      return {
        ...state,
        assetTypes: { ...state.assetTypes, ...action.data },
      };
    default:
      return state;
  }
};

export const metadata = combineReducers({
  filters,
  pagination,
  sort,
  status,
});
