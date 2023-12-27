import React from 'react';
import styles from './Timer.module.css';

const EventList = ({ events }) => {
  const eventItems = events.map((event) => (
    <li key={event.id} className={styles.eventListItem}>
      <div className={styles.eventDetails}>
        <div className={styles.eventName}>{event.eventName}</div>
        <div className={styles.countdown}>
          {event.countdown && event.countdown.days > 0 && (
            <span>{event.countdown.days}d </span>
          )}
          {event.countdown && event.countdown.hours > 0 && (
            <span>{event.countdown.hours}h </span>
          )}
          {event.countdown && event.countdown.minutes > 0 && (
            <span>{event.countdown.minutes}m </span>
          )}
          {event.countdown && event.countdown.seconds > 0 && (
            <span>{event.countdown.seconds}s</span>
          )}
        </div>
      </div>

      <div
        className={styles.progressBar}
        style={{
          width: `${Math.min(event.percentage, 100)}%`,
        }}
      ></div>
    </li>
  ));

  return (
    <div className={styles.eventList}>
      <h1>Live upcoming checks</h1>
      <ul className={styles.ul}>{eventItems}</ul>
    </div>
  );
};

export default EventList;
