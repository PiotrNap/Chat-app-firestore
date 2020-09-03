import React from 'react';
import useCollection from './useCollection';

const SideNav = ({ channelId }) => {
  const users = useCollection('users', undefined, [
    `channels.${channelId}`,
    '==',
    true,
  ]);

  return users.length > 1 ? (
    <div className="side-nav">
      <div className="online-users">
        <h3>Online Users</h3>
        <ul className="online-list">
          {users.sort(sortByName).map((user) => (
            <div key={user.uid}>
              <li className={`${user.status.state}`}>{user.displayName}</li>
            </div>
          ))}
        </ul>
      </div>
    </div>
  ) : (
    <div>
      <p>Loading...</p>
    </div>
  );
};

function sortByName(a, b) {
  return a.name > b.name ? 1 : a.name < b.name ? -1 : 0;
}

export default SideNav;
