import React from 'react';
import styles from './Timer.module.css';

const EventForm = ({
  eventData,
  handleInputChanger,
  createEvent,
  numbers,
  units,
}) => {
  return (
    <form>
      <div className={styles.formContainer}>
        <div className={styles.inputContainer}>
          <label>Event name*:</label>
          <br />
          <input
            type="text"
            value={eventData.eventName}
            name="eventName"
            onChange={handleInputChanger}
            className={styles.inputField}
          />
        </div>

        <div className={styles.inputContainer}>
          <label>Event date*:</label>
          <br />
          <input
            type="datetime-local"
            value={eventData.eventEndDate}
            name="eventEndDate"
            onChange={handleInputChanger}
            className={styles.inputField}
          />
        </div>

        <div className={styles.inputContainer}>
          <label>Notify before:</label>
          <br />
          <select
            value={eventData.notificationNumber}
            name="notificationNumber"
            onChange={handleInputChanger}
            className={styles.selectField}
          >
            {numbers.map((number) => (
              <option key={number} value={number}>
                {number}
              </option>
            ))}
          </select>
          <select
            value={eventData.notificationUnit}
            name="notificationUnit"
            onChange={handleInputChanger}
            className={styles.selectField}
          >
            {units.map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
        </div>

        <button className={styles.createButton} onClick={createEvent}>
          CREATE EVENT
        </button>
      </div>
    </form>
  );
};

export default EventForm;
