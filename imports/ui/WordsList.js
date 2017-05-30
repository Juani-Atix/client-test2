import React from 'react';
import PropTypes from 'prop-types';

class WordsList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { item } = this.props;

    return (
      <div>
        <h3>{item.languageCode}</h3>
        <ul>
          {item.words.map((word, index) => {
            return <li key={index}>{word}</li>;
          })}
        </ul>
      </div>
    );
  }
}

WordsList.propTypes = {
  item: PropTypes.object,
};

export default WordsList;
