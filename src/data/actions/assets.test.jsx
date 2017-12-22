import configureStore from 'redux-mock-store';
import fetchMock from 'fetch-mock';
import thunk from 'redux-thunk';

import endpoints from '../api/endpoints';
import * as actionCreators from './assets';
import { assetActions } from '../../data/constants/actionTypes';

const initialState = {
  request: {
    assetTypes: {},
    start: 0,
    end: 0,
    page: 0,
    pageSize: 50,
    totalCount: 0,
    sort: 'date_added',
    direction: 'desc',
  },
};

const assetsEndpoint = endpoints.assets;
const middlewares = [thunk];
const mockStore = configureStore(middlewares);
let store;

describe('Assets Action Creators', () => {
  beforeEach(() => {
    store = mockStore(initialState);
  });

  afterEach(() => {
    fetchMock.reset();
    fetchMock.restore();
  });

  it('returns expected state from requestAssetsSuccess', () => {
    const expectedAction = { data: 'response', type: assetActions.REQUEST_ASSETS_SUCCESS };
    expect(store.dispatch(actionCreators.requestAssetsSuccess('response'))).toEqual(expectedAction);
  });
  it('returns expected state from assetDeleteFailure', () => {
    const expectedAction = { response: 'response', type: assetActions.DELETE_ASSET_FAILURE };
    expect(store.dispatch(actionCreators.deleteAssetFailure('response'))).toEqual(expectedAction);
  });
  it('returns expected state from getAssets success', () => {
    const request = {
      page: 0,
      assetTypes: {},
      sort: 'date_added',
      direction: 'desc',
    };

    const response = request;

    const courseDetails = {
      id: 'edX',
    };

    fetchMock.once(`begin:${assetsEndpoint}`, response);
    const expectedActions = [
      { type: assetActions.REQUEST_ASSETS_SUCCESS, data: response },
    ];

    return store.dispatch(actionCreators.getAssets(request, courseDetails)).then(() => {
      // return of async actions
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
  it('returns expected state from getAssets failure', () => {
    const request = {
      page: 0,
      assetTypes: {},
      sort: 'date_added',
      direction: 'desc',
    };

    const response = {
      status: 400,
      body: request,
    };

    const errorResponse = new Error(response);

    const courseDetails = {
      id: 'edX',
    };

    fetchMock.once(`begin:${assetsEndpoint}`, response);
    const expectedActions = [
      { type: assetActions.REQUEST_ASSETS_FAILURE, data: errorResponse },
    ];

    store = mockStore(initialState);
    return store.dispatch(actionCreators.getAssets(request, courseDetails)).then(() => {
      // return of async actions
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
  it('returns expected state from getAssets success', () => {
    const request = {
      page: 0,
      assetTypes: {},
      sort: 'date_added',
      direction: 'asc',
    };

    const response = request;

    const courseDetails = {
      id: 'edX',
    };

    fetchMock.once(`begin:${assetsEndpoint}`, response);

    // if the response is not the same as the request, we expect nothing
    const expectedActions = [];

    return store.dispatch(actionCreators.getAssets(request, courseDetails)).then(() => {
      // return of async actions
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
  it('returns expected state from filterUpdate', () => {
    const expectedAction = { data: { filter: true }, type: assetActions.FILTER_UPDATED };
    expect(store.dispatch(actionCreators.filterUpdate('filter', true))).toEqual(expectedAction);
  });
  it('returns expected state from sortUpdate', () => {
    const expectedAction = { data: { sort: 'edX', direction: 'desc' }, type: assetActions.SORT_UPDATE };
    expect(store.dispatch(actionCreators.sortUpdate('edX', 'desc'))).toEqual(expectedAction);
  });
  it('returns expected state from pageUpdate', () => {
    const expectedAction = { data: { page: 0 }, type: assetActions.PAGE_UPDATE };
    expect(store.dispatch(actionCreators.pageUpdate(0))).toEqual(expectedAction);
  });
  it('returns expected state from deleteAsset success', () => {
    const assetId = 'asset';

    const courseDetails = {
      id: 'edX',
    };

    const responseBody = { response: 'Asset deleted!' };
    const responseStatus = 202;
    const response = { status: responseStatus, body: responseBody };

    fetchMock.once(`begin:${assetsEndpoint}`, response);

    const expectedActions = [
      { type: assetActions.DELETE_ASSET_SUCCESS, assetId, response: responseBody },
    ];

    return store.dispatch(actionCreators.deleteAsset(assetId, courseDetails)).then(() => {
      // return of async actions
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
  it('returns expected state from deleteAsset failure', () => {
    const assetId = 'asset';

    const courseDetails = {
      id: 'edX',
    };

    const responseBody = { response: 'Asset could not be deleted!' };
    const responseStatus = 400;
    const response = { status: responseStatus, body: responseBody };

    const errorResponse = new Error(response);

    fetchMock.once(`begin:${assetsEndpoint}`, response);

    const expectedActions = [
      { type: assetActions.DELETE_ASSET_FAILURE, response: errorResponse },
    ];

    return store.dispatch(actionCreators.deleteAsset(assetId, courseDetails)).then(() => {
      // return of async actions
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
  it('returns expected state from togglingLockAsset', () => {
    const expectedAction = { asset: 'asset', type: assetActions.TOGGLING_LOCK_ASSET_SUCCESS };
    expect(store.dispatch(actionCreators.togglingLockAsset('asset'))).toEqual(expectedAction);
  });
  it('returns expected state from toggleLockAssetSuccess', () => {
    const expectedAction = { asset: 'asset', type: assetActions.TOGGLE_LOCK_ASSET_SUCCESS };
    expect(store.dispatch(actionCreators.toggleLockAssetSuccess('asset'))).toEqual(expectedAction);
  });
  it('returns expected state from toggleLockAssetFailure', () => {
    const expectedAction = { asset: 'asset', response: 'response', type: assetActions.TOGGLING_LOCK_ASSET_FAILURE };
    expect(store.dispatch(actionCreators.toggleLockAssetFailure('asset', 'response'))).toEqual(expectedAction);
  });
  it('returns expected state from toggleLockAsset success', () => {
    const asset = 'asset';

    const courseDetails = {
      id: 'edX',
    };

    fetchMock.once(`begin:${assetsEndpoint}`, 200);

    const expectedActions = [
      { type: assetActions.TOGGLING_LOCK_ASSET_SUCCESS, asset },
      { type: assetActions.TOGGLE_LOCK_ASSET_SUCCESS, asset },
    ];

    return store.dispatch(actionCreators.toggleLockAsset(asset, courseDetails)).then(() => {
      // return of async actions
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
  it('returns expected state from toggleLockAsset failure', () => {
    const asset = 'asset';

    const courseDetails = {
      id: 'edX',
    };

    const responseBody = { response: 'Asset could not be toggled!' };
    const responseStatus = 500;
    const response = { status: responseStatus, body: responseBody };

    const errorResponse = new Error(response);

    fetchMock.once(`begin:${assetsEndpoint}`, response);

    const expectedActions = [
      { type: assetActions.TOGGLING_LOCK_ASSET_SUCCESS, asset },
      { type: assetActions.TOGGLING_LOCK_ASSET_FAILURE, asset, response: errorResponse },
    ];

    return store.dispatch(actionCreators.toggleLockAsset(asset, courseDetails)).then(() => {
      // return of async actions
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
  it('returns expected state from clearAssetsStatus', () => {
    const expectedAction = { type: assetActions.CLEAR_ASSETS_STATUS };
    expect(store.dispatch(actionCreators.clearAssetsStatus())).toEqual(expectedAction);
  });
  it('returns expected state from clearAssetsStatus', () => {
    const expectedAction = { type: assetActions.CLEAR_ASSETS_STATUS };
    expect(store.dispatch(actionCreators.clearAssetsStatus())).toEqual(expectedAction);
  });
});
