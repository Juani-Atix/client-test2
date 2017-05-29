import React from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import PlayerPageItem from './PlayerPageItem';

const lessonWords = [
  {
    id: 'qaz',
    hash: 'aaa',
    text: 'Chapter',
    translation: 'Capitulo',
    lessonId: '1',
    productId: '1',
    languageCode: 'es',
  },
  {
    id: 'qaS',
    hash: 'bbb',
    text: '1',
    translation: '1',
    lessonId: '1',
    productId: '1',
    languageCode: 'es',
  },
  {
    id: 'qav',
    hash: 'ccc',
    text: 'test',
    translation: 'prueba',
    lessonId: '1',
    productId: '1',
    languageCode: 'es',
  },
  {
    id: 'ddd',
    hash: 'qaq',
    text: 'message',
    translation: 'mensaje',
    lessonId: '1',
    productId: '1',
    languageCode: 'es',
  },
  {
    id: 'qavv',
    hash: 'ccc',
    text: 'test',
    translation: 'prueba',
    lessonId: '1',
    productId: '1',
    languageCode: 'es',
  },
];

class PlayerPage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { loading, learnedWords, refetch } = this.props;

    if (loading) {
      return (
        <div>
          <h1>Loading</h1>
        </div>
      );
    }

    return (
      <div>
        <h1>Player Page</h1>
        <button onClick={() => refetch()}>Refetch query</button>
        <div style={{ display: 'flex' }}>
          {lessonWords.map(item => {
            return <PlayerPageItem key={item.id} item={item} learnedWords={learnedWords} />;
          })}
        </div>
      </div>
    );
  }
}

PlayerPage.propTypes = {
  learnedWords: PropTypes.object,
  loading: PropTypes.bool,
  userLearnedWordsByLanguageCode: PropTypes.array,
  refetch: PropTypes.func,
};

const USER_LEARNED_WORDS_BY_LANGUAGE_CODE_QUERY = gql`
  query userLearnedWordsByLanguageCode($languageCodes: [String]) {
    userLearnedWordsByLanguageCode(languageCodes: $languageCodes) {
      languageCode
      words
    }
  }
`;

const withData = createContainer(
  props => {
    let learnedWords;

    if (!props.loading && props.userLearnedWordsByLanguageCode) {
      props.userLearnedWordsByLanguageCode.forEach(function(element) {
        if (element.languageCode === 'es') {
          learnedWords = new Set(element.words);
        }
      });
    }

    return {
      learnedWords,
    };
  },
  PlayerPage
);

const withDataAndQuery = graphql(USER_LEARNED_WORDS_BY_LANGUAGE_CODE_QUERY, {
  options: props => ({
    fetchPolicy: 'cache-and-network',
    variables: { languageCodes: ['es'] },
  }),
  props: ({ data: { loading, userLearnedWordsByLanguageCode, refetch } }) => ({
    loading,
    refetch,
    userLearnedWordsByLanguageCode: userLearnedWordsByLanguageCode,
  }),
})(withData);

export default withDataAndQuery;
