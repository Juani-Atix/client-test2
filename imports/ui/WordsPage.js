import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import AddWord from './AddWord';
import WordsList from './WordsList';

class WordsPage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { loading, wordsByLanguageCode } = this.props;

    if (loading) {
      return (
        <div>
          <h1>Loading</h1>
        </div>
      );
    }

    return (
      <div>
        <h1>Words Page</h1>
        <AddWord />
        {wordsByLanguageCode &&
          wordsByLanguageCode.map((item, index) => {
            return <WordsList key={index} item={item} />;
          })}
      </div>
    );
  }
}

WordsPage.propTypes = {
  loading: PropTypes.bool,
  wordsByLanguageCode: PropTypes.array,
};

export const LIST_WORDS = gql`
  query wordsByLanguageCode($languageCodes: [String]) {
    wordsByLanguageCode(languageCodes: $languageCodes) {
      languageCode
      words
    }
  }
`;

const withDataAndQuery = graphql(LIST_WORDS, {
  options: props => ({
    fetchPolicy: 'network-only',
    variables: { languageCodes: ['es'] },
  }),
  props: ({ data: { loading, wordsByLanguageCode } }) => ({
    loading,
    wordsByLanguageCode,
  }),
})(WordsPage);

export default withDataAndQuery;
