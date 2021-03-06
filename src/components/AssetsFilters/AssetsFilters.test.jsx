import React from 'react';
import Enzyme from 'enzyme';
import { AssetsFilters } from './index';

const mount = Enzyme.mount;

const defaultProps = {
  assetsFilters: {},
  updateFilter: () => {},
};

let wrapper;

describe('<AssetsFilters />', () => {
  describe('renders', () => {
    beforeEach(() => {
      wrapper = mount(
        <AssetsFilters
          {...defaultProps}
        />,
      );
    });
    it('correct number of filters', () => {
      expect(wrapper.find('li')).toHaveLength(5);
    });
    it('correct styling', () => {
      expect(wrapper.find('ul').hasClass('filter-set')).toEqual(true);
    });
  });
});
