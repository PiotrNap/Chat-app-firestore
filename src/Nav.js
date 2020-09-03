import React from 'react';
import useCollection from './useCollection';
import { Link } from '@reach/router';
import { firebase } from './firebase';

const Nav = ({ user }) => {
  const channels = useCollection('channels');

  return (
    <div className="side-main">
      <div className="side-header">
        <div
          className="user-avatar-main"
          style={{ backgroundImage: `url(${user.photo})` }}
        />
        <h4>
          Hello {user.displayName},<br /> you are successfully
          <br /> logged in!
        </h4>
      </div>
      <div className="logout-box">
        <p>Do you want to log out?</p>
        <button
          className="button-standard"
          onClick={() => {
            firebase.auth().signOut();
          }}
        >
          Log out
        </button>
      </div>
      <div className="channels">
        <h3>Choose Channel</h3>
        {channels.map((channel) => (
          <Link key={channel.id} to={`/channel/${channel.id}`}>
            # {channel.id}{' '}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Nav;
