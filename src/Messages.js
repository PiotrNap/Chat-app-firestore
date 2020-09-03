import React, { useRef, useEffect } from 'react';
import useCollection from './useCollection';
import useDocWithCache from './useDocWithCache';
import MessageInput from './MessageInput';
import ChannelInfo from './ChannelInfo';
import { format, isSameDay } from 'date-fns';

function Scroll(props) {
  const ref = useRef();
  const scrollerRef = useRef(true);

  useEffect(() => {
    if (scrollerRef.current) {
      const node = ref.current;
      node.scrollTop = node.scrollHeight;
    }
  });

  function handleScroll() {
    const node = ref.current;
    const { scrollHeight, scrollTop, clientHeight } = node;
    const atBottom = scrollHeight === clientHeight - scrollTop;
    scrollerRef.current = atBottom;
  }

  return <div {...props} ref={ref} onScroll={handleScroll} />;
}

const Messages = ({ user, channelId }) => {
  const messages = useCollection(`channels/${channelId}/messages`, 'createdAt');

  return messages ? (
    <>
      <ChannelInfo channelId={channelId} />
      <Scroll className="messages">
        {messages.map((message, index) => {
          const previous = messages[index - 1];
          const showDay = shouldShowDay(previous, message);
          const showAvatar = shouldShowAvatar(previous, message);
          return showAvatar ? (
            <FirstMessageFromUser
              message={message}
              showDay={showDay}
              key={index}
            />
          ) : (
            <div key={message.id}>
              <div className="message-content">
                <div className="message-text">{message.text}</div>
              </div>
            </div>
          );
        })}
      </Scroll>
      <MessageInput user={user} channelId={channelId} />
    </>
  ) : (
    <h3>Please wait...</h3>
  );
};

function shouldShowAvatar(previous, message) {
  const isFirst = !previous;
  if (isFirst) return true;

  const differentUser = message.user.id !== previous.user.id;
  if (differentUser) return true;

  const hasBeenAWhile =
    message.createdAt.seconds - previous.createdAt.seconds > 180;
  if (hasBeenAWhile) return true;
}

function shouldShowDay(previous, message) {
  const isFirst = !previous;
  if (isFirst) return true;

  const isNewDay = isSameDay(
    previous.createdAt.seconds * 1000,
    message.createdAt.seconds * 1000
  );

  return isNewDay;
}

function FirstMessageFromUser({ message, showDay }) {
  const author = useDocWithCache(message.user.path);
  return author ? (
    <div className="message" key={message.id}>
      {showDay && (
        <div className="show-day">
          <span>
            {new Date(message.createdAt.seconds * 1000).toLocaleDateString()}
          </span>
        </div>
      )}{' '}
      <div className="message-content">
        <div className="message-heading">
          <div
            style={{ backgroundImage: author ? `url('${author.photo}')` : '' }}
            className="avatar"
          />
          <span className="message-date">
            {format(message.createdAt.seconds * 1000, 'h:mm a')}
          </span>
        </div>
        <div className="message-text">{message.text}</div>
      </div>
    </div>
  ) : (
    ''
  );
}

export default Messages;
