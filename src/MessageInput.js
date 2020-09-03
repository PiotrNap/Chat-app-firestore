import React from 'react';
import { db } from './firebase';

export default function MessageInput({ user, channelId }) {
  return (
    <div className="message-input">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const message = e.target.elements[0].value;
          db.collection('channels')
            .doc(`${channelId}`)
            .collection('messages')
            .add({
              text: message,
              createdAt: new Date(),
              user: db.collection('users').doc(user.uid),
            });
          e.target.reset();
        }}
        className="MessageInputBox"
      >
        <input
          type="text"
          aria-label="new message"
          placeholder={`message #${channelId}`}
        />
        <input type="submit" aria-label="send message" value="send" />
      </form>
    </div>
  );
}
