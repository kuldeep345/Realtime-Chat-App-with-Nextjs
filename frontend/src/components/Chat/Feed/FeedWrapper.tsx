import { Session } from 'next-auth';
import * as React from 'react';

interface IFeedWrapperProps {
  session:Session
}

const FeedWrapper: React.FunctionComponent<IFeedWrapperProps> = ({session}) => {
  return (
    <div>Feed Wrapper</div>
  );
};

export default FeedWrapper;
