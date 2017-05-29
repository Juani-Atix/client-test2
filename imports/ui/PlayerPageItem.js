import React from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';

const containerStyle = {
  padding: '10px',
};

const textStyle = {
  padding: '2px',
  textAlign: 'center',
};

class PlayerPageItem extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { isLearned, item } = this.props;
    const translationStyle = {
      padding: '2px',
      textAlign: 'center',
    };

    translationStyle.color = isLearned ? 'green' : 'red';

    return (
      <div style={containerStyle}>
        <div style={textStyle}>{item.text}</div>
        <div style={translationStyle}>{item.translation}</div><br />
      </div>
    );
  }
}

PlayerPageItem.propTypes = {
  item: PropTypes.object,
  isLearned: PropTypes.bool,
  learnedWords: PropTypes.object,
};

const withContainer = createContainer(
  props => {
    let isLearned = false;

    if (props.learnedWords && props.learnedWords.has(props.item.hash)) {
      isLearned = true;
    }

    return {
      isLearned,
    };
  },
  PlayerPageItem
);

export default withContainer;
