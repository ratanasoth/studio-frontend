import * as reducers from './assets';
import { assetActions } from '../../data/constants/actionTypes';
import { assetLoading } from '../../data/constants/loadingTypes';
import { getAssetAPIAttributeFromDatabaseAttribute } from '../../utils/getAssetsAttributes';

let defaultState;

describe('Assets', () => {
  describe('assets reducer', () => {
    it('returns correct assets state for REQUEST_ASSETS_SUCCESS action', () => {
      defaultState = [];

      const newActionData = {
        assets: [
          { id: 'asset1' },
          { id: 'asset2' },
          { id: 'asset3' },
        ],
      };

      const state = reducers.assets(defaultState, {
        type: assetActions.REQUEST_ASSETS_SUCCESS,
        data: newActionData,
      });

      expect(state).toEqual(newActionData.assets);
    });
    it('returns correct assets state for DELETE_ASSET_SUCCESS action', () => {
      defaultState = {
        assets: [
          { id: 'asset1' },
          { id: 'asset2' },
          { id: 'asset3' },
        ],
      };

      const newActionData = {
        assetId: 'asset2',
      };

      const state = reducers.assets(defaultState.assets, {
        type: assetActions.DELETE_ASSET_SUCCESS,
        ...newActionData,
      });

      expect(state).toEqual(defaultState.assets.filter(
        asset => asset.id !== newActionData.assetId));
    });
    it('returns correct assets state for TOGGLE_LOCK_ASSET_SUCCESS action', () => {
      defaultState = {
        assets: [
          { id: 'asset1', loadingFields: [] },
          { id: 'asset2', loadingFields: [assetLoading.LOCK] },
          { id: 'asset3', loadingFields: [] },
        ],
      };

      const newState = defaultState.assets.map(asset => ({ ...asset }));
      newState[1].loadingFields = [];
      newState[1].locked = true;

      const newActionData = {
        asset: { id: 'asset2' },
      };

      const state = reducers.assets(defaultState.assets, {
        type: assetActions.TOGGLE_LOCK_ASSET_SUCCESS,
        ...newActionData,
      });

      expect(state).toEqual(newState);
    });
    it('returns correct assets state for TOGGLING_LOCK_ASSET_FAILURE action', () => {
      defaultState = {
        assets: [
          { id: 'asset1', loadingFields: [] },
          { id: 'asset2', loadingFields: [assetLoading.LOCK] },
          { id: 'asset3', loadingFields: [] },
        ],
      };

      const newActionData = {
        assetId: 'asset2',
      };

      const newState = defaultState.assets.map(asset => ({ ...asset }));
      newState[1].loadingFields = [];

      const state = reducers.assets(defaultState.assets, {
        type: assetActions.TOGGLING_LOCK_ASSET_FAILURE,
        ...newActionData,
      });

      expect(state).toEqual(newState);
    });
    it('returns correct assets state for TOGGLING_LOCK_ASSET_SUCCESS action', () => {
      defaultState = {
        assets: [
          { id: 'asset1' },
          { id: 'asset2' },
          { id: 'asset3' },
        ],
      };

      const newActionData = {
        asset: {
          id: 'asset2',
        },
      };

      const newState = defaultState.assets.map(asset => ({ ...asset }));
      newState[1].loadingFields = [assetLoading.LOCK];

      const state = reducers.assets(defaultState.assets, {
        type: assetActions.TOGGLING_LOCK_ASSET_SUCCESS,
        ...newActionData,
      });

      expect(state).toEqual(newState);
    });
    it('returns correct assets state for DELETE_ASSET_FAILURE action', () => {
      defaultState = [];

      const state = reducers.assets(defaultState, {
        type: assetActions.DELETE_ASSET_FAILURE,
      });

      expect(state).toEqual([]);
    });
  });
  describe('metadata', () => {
    describe('filter reducer', () => {
      defaultState = reducers.filtersInitial;

      it('returns correct assetTypes state on REQUEST_ASSETS_SUCCESS action', () => {
        const newActionData = {
          assetTypes: {
            edX: true,
          },
        };

        const state = reducers.filters(defaultState, {
          type: assetActions.REQUEST_ASSETS_SUCCESS,
          data: newActionData,
        });

        expect(state).toEqual({
          ...defaultState,
          assetTypes: { ...defaultState.assetTypes, ...newActionData },
        });
      });
    });
    describe('pagination reducer', () => {
      defaultState = reducers.paginationInitial;

      it('returns correct pagination state on REQUEST_ASSETS_SUCCESS action', () => {
        const newActionData = {
          start: 99,
          end: 101,
          page: 100,
          pageSize: 1,
          totalCount: 100,
        };

        const state = reducers.pagination(defaultState, {
          type: assetActions.REQUEST_ASSETS_SUCCESS,
          data: newActionData,
        });

        expect(state).toEqual({
          ...newActionData,
        });
      });
    });
    describe('sort reducer', () => {
      it('returns correct sort and direction state on REQUEST_ASSETS_SUCCESS action', () => {
        const newActionData = {
          sort: 'content_type',
          direction: 'asc',
        };

        const state = reducers.sort(defaultState, {
          type: assetActions.REQUEST_ASSETS_SUCCESS,
          data: newActionData,
        });

        expect(state).toEqual({
          ...newActionData,
          sort: getAssetAPIAttributeFromDatabaseAttribute(newActionData.sort),
        });
      });
    });
    describe('status reducer', () => {
      defaultState = {};

      const sameBehaviorReducers = [
        assetActions.REQUEST_ASSETS_SUCCESS,
        assetActions.REQUEST_ASSETS_FAILURE,
        assetActions.DELETE_ASSET_SUCCESS,
        assetActions.DELETE_ASSET_FAILURE,
      ];

      sameBehaviorReducers.forEach((reducer) => {
        it(`returns correct status state on ${reducer} action`, () => {
          const newActionData = {
            type: reducer,
            response: 'Status!',
          };

          const state = reducers.status(defaultState, newActionData);

          expect(state).toEqual(newActionData);
        });
      });

      it('returns correct status state on CLEAR_ASSETS_STATUS action', () => {
        const state = reducers.status(defaultState, {
          type: assetActions.CLEAR_ASSETS_STATUS,
        });

        expect(state).toEqual({});
      });
      it('returns correct status state on TOGGLING_LOCK_ASSET_FALURE action', () => {
        const newActionData = {
          asset: 'asset',
          response: 'Failure!',
          type: assetActions.TOGGLING_LOCK_ASSET_FAILURE,
        };

        const state = reducers.status(defaultState, {
          ...newActionData,
        });

        expect(state).toEqual(newActionData);
      });
    });
  });
  describe('request reducer', () => {
    defaultState = reducers.requestInitial;

    it('returns correct sort and direction state on SORT_UPDATE action', () => {
      const newActionData = {
        sort: 'edX',
        direction: 'desc',
      };

      const state = reducers.request(defaultState, {
        type: assetActions.SORT_UPDATE,
        data: newActionData,
      });

      expect(state).toEqual({
        ...defaultState,
        ...newActionData,
      });
    });
    it('returns correct sort and direction state on SORT_UPDATE action', () => {
      const newActionData = {
        page: 100,
      };

      const state = reducers.request(defaultState, {
        type: assetActions.PAGE_UPDATE,
        data: newActionData,
      });

      expect(state).toEqual({
        ...defaultState,
        ...newActionData,
      });
    });
    it('returns correct sort and direction state on SORT_UPDATE action', () => {
      const newActionData = {
        assetTypes: {
          edX: true,
        },
      };

      const state = reducers.request(defaultState, {
        type: assetActions.FILTER_UPDATED,
        data: newActionData,
      });

      expect(state).toEqual({
        ...defaultState,
        assetTypes: { ...defaultState.assetTypes, ...newActionData },
      });
    });
  });
});
