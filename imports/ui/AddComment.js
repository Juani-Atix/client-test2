import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { LIST_COMMENTS } from './CommentsPage';

class AddComment extends React.Component {
  constructor(props) {
    super(props);

    this.state = { message: '' };
  }

  addComment(event) {
    event.preventDefault();
    this.props.mutate({
        variables: {
          message: this.state.message,
        },
        update: function(store, { data: { addComment } }) {
          const cacheData = store.readQuery({
            query: LIST_COMMENTS,
          });

          cacheData.getAllComments.push(addComment);
          store.writeQuery({ query: LIST_COMMENTS, cacheData });
        },
      })
      .then(res => {
        console.log('Add Comment res', res);
      })
      .catch(err => {
        console.log('-->MUTATION ERROR', err);
      });
  }

  handleChange(event) {
    this.setState({ message: event.target.value });
  }

  render() {
    return (
      <div>
        <form onSubmit={this.addComment.bind(this)}>
          <input type="text" value={this.state.message} onChange={this.handleChange.bind(this)} />
          <input type="submit" value="Add Comment" />
        </form>
      </div>
    );
  }
}

const ADD_COMMENT = gql`
  mutation addComment($message: String) {
    addComment(message: $message) {
      _id
      message
    }
  }
`;

const withMutation = graphql(ADD_COMMENT)(AddComment);

export default withMutation;
