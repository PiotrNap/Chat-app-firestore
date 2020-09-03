import React, { useEffect } from 'react';
import Messages from './Messages';
import { db } from './firebase';
import SideNav from './SideNav';
import Nav from './Nav';

const Channels = ({ channelId, user }) => {
  useEffect(() => {
    db.doc(`users/${user.uid}`).update({
      [`channels.${channelId}`]: true,
    });
  }, [channelId, user.uid]);

  return (
    <div className="dashboard">
      <Nav user={user} />
      <Messages user={user} channelId={channelId} />
      <SideNav channelId={channelId} />
    </div>
  );
};

export default Channels;
