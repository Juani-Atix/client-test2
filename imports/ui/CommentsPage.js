import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import AddComment from './AddComment';

class CommentsPage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { loading, comments } = this.props;

    if (loading) {
      return (
        <div>
          <h1>Loading</h1>
        </div>
      );
    }

    return (
      <div>
        <h1>Comments Page</h1>
        <AddComment />
        <ul>
          {comments &&
            comments.map(comment => {
              return <li key={comment._id}>{comment.message}</li>;
            })}
        </ul>
      </div>
    );
  }
}

CommentsPage.propTypes = {
  loading: PropTypes.bool,
  comments: PropTypes.array,
};

export const LIST_COMMENTS = gql`
  query {
    getAllComments {
      _id
      message
    }
  }
`;

const withDataAndQuery = graphql(LIST_COMMENTS, {
  options: props => ({
    fetchPolicy: 'cache-and-network',
  }),
  props: ({ data: { loading, getAllComments } }) => ({
    loading,
    comments: getAllComments,
  }),
})(CommentsPage);

export default withDataAndQuery;
