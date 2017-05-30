import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { LIST_WORDS } from './WordsPage';

class AddWord extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      languageCode: '',
      word: '',
    };
  }

  updateLanguageCode(event) {
    this.setState({ languageCode: event.target.value });
  }

  updateWord(event) {
    this.setState({ word: event.target.value });
  }

  addWord(event) {
    event.preventDefault();
    this.props.mutate({
        variables: {
          languageCode: this.state.languageCode,
          word: this.state.word,
        },
        update: function(store, { data: { addWord } }) {
          const data = store.readQuery({
            query: LIST_WORDS,
            variables: { languageCodes: [addWord.languageCode] },
          });

          data.wordsByLanguageCode.forEach(function(item, index) {
            if (item.languageCode === addWord.languageCode) {
              const aux = [...item.words, addWord.word];

              data.wordsByLanguageCode[index].words = aux;
            }
          });

          store.writeQuery({
            query: LIST_WORDS,
            variables: { languageCodes: [addWord.languageCode] },
            data,
          });
        },
      })
      .then(res => {
        console.log('Add word result', res);
      })
      .catch(err => {
        console.log('Error during add word', err);
      });
  }

  render() {
    return (
      <div>
        <form onSubmit={this.addWord.bind(this)}>
          Language Code:
          <input
            type="text"
            value={this.state.languageCode}
            onChange={this.updateLanguageCode.bind(this)}
          />
          <br />
          Word: <input type="text" value={this.state.word} onChange={this.updateWord.bind(this)} />
          <br />
          <input type="submit" value="Add Word" />
        </form>
      </div>
    );
  }
}

const ADD_WORD = gql`
  mutation addWord($languageCode: String, $word: String) {
    addWord(languageCode: $languageCode, word: $word) {
      languageCode
      word
    }
  }
`;

const withMutation = graphql(ADD_WORD)(AddWord);

export default withMutation;
