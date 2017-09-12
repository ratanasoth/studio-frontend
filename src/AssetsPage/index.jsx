import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import CheckBox from 'paragon/src/CheckBox';
import AssetsTable from './AssetsTable';

import { requestAssets } from '../data/actions/assets';
import styles from './styles.scss';

class AssetsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: false,
    };
  }

  componentDidMount() {
    this.props.requestAssets('course-v1:edX+DemoX+Demo_Course');
  }

  handleCheckBoxChange = (checked) => {
    this.setState({
      checked,
    });
  }

  render() {
    return (
      <div className={styles.assets}>
        <h2>Files & Uploads</h2>
        <CheckBox
          name="checkbox"
          label="I am a checkbox!"
          onChange={this.handleCheckBoxChange}
          checked={this.state.checked}
        />
        <AssetsTable
          assetsList={this.props.assetsList}
        />
      </div>
    );
  }
}

AssetsPage.propTypes = {
  assetsList: PropTypes.arrayOf(PropTypes.object).isRequired,
  requestAssets: PropTypes.func.isRequired,
};

const WrappedAssetsPage = connect(
  state => ({
    assetsList: state.assetsList,
  }), dispatch => ({
    requestAssets: courseId => dispatch(requestAssets(courseId)),
  }),
)(AssetsPage);

export default WrappedAssetsPage;
