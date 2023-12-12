import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment';
import EventForm from './EventForm';
import EventList from './EventList';
import TimerUtils from './TimerUtils';

const Timer = () => {
  const [eventData, setEventData] = useState({
    eventName: '',
    eventStartDate: '',
    eventEndDate: '',
    notificationNumber: '',
    notificationUnit: '',
  });
  const [events, setEvents] = useState([]);

  const {
    calculateNotificationTime,
    calculateUnitMultiplier,
    formatTime,
    updateEventsCallback,
    sortEvents,
    completedEventsCount,
  } = TimerUtils(events, eventData);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const { updatedEvents, showToast } = updateEventsCallback();

      if (showToast) {
        toast.success(`Completed Events: ${completedEventsCount.current}`, {
          position: 'top-center',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
          style: {
            backgroundColor: 'red',
          },
        });
      }

      setEvents(updatedEvents);
    }, 1000);

    const notificationIntervalId = setInterval(() => {
      const notificationTime = calculateNotificationTime();
      if (notificationTime !== null) {
        events.forEach((currentEvent) => {
          if (
            currentEvent.countdown &&
            currentEvent.countdown.seconds === notificationTime &&
            !currentEvent.notificationSent
          ) {
            toast.info(
              `Notification for ${currentEvent.eventName}: ${formatTime(
                notificationTime
              )} remaining`,
              {
                position: 'top-center',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'colored',
                style: {
                  backgroundColor: 'blue',
                },
              }
            );
            currentEvent.notificationSent = true;
          }
        });
      }
    }, 1000);

    return () => {
      clearInterval(intervalId);
      clearInterval(notificationIntervalId);
    };
  }, [
    updateEventsCallback,
    calculateNotificationTime,
    events,
    completedEventsCount,
    formatTime,
  ]);

  const handleInputChanger = (event) => {
    const { name, value } = event.target;
    setEventData({
      ...eventData,
      [name]: value,
    });
  };

  const createEvent = (event) => {
    event.preventDefault();

    if (!eventData.eventName.trim()) {
      alert('Please enter a valid event name');
      return;
    }

    const endDate = moment(eventData.eventEndDate);
    if (!endDate.isValid() || endDate.isBefore(moment())) {
      alert('Please choose a future date');
      return;
    }

    const remainingTimeInSeconds = calculateNotificationTime();

    const newEvent = { ...eventData };
    newEvent.id = Date.now();
    newEvent.eventStartDate = moment().toISOString();
    newEvent.eventEndDate = endDate.toISOString();
    const eventDuration = Math.floor(endDate.diff(moment(), 'minutes'));
    newEvent.eventDuration = eventDuration;

    setEvents([...events, newEvent]);
    setEventData({
      eventName: '',
      eventStartDate: '',
      eventEndDate: '',
      notificationNumber: '',
      notificationUnit: '',
    });

    const notifyBeforeInSeconds =
      eventData.notificationNumber *
      calculateUnitMultiplier(eventData.notificationUnit);

    if (
      eventData.notificationNumber &&
      eventData.notificationUnit &&
      notifyBeforeInSeconds === remainingTimeInSeconds
    ) {
      const intervalId = setInterval(() => {
        const now = moment();
        const eventTime = moment(newEvent.eventEndDate);
        const adjustedEventTime = eventTime.subtract(
          notifyBeforeInSeconds,
          'seconds'
        );

        if (now.isSameOrAfter(adjustedEventTime)) {
          toast.info(
            `Notification for ${newEvent.eventName}: ${formatTime(
              remainingTimeInSeconds
            )} remaining`,
            {
              position: 'top-center',
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: 'colored',
              style: {
                backgroundColor: 'blue',
              },
            }
          );
          clearInterval(intervalId);
        }
      }, 1000);
    } else {
      console.log('Notification time did not match.');
    }
  };

  const numbers = ['', ...Array.from({ length: 60 }, (_, index) => index + 1)];

  const units = ['', 'sec', 'min', 'hr', 'day'];

  return (
    <div>
      <EventForm
        eventData={eventData}
        handleInputChanger={handleInputChanger}
        createEvent={createEvent}
        numbers={numbers}
        units={units}
      />

      <EventList events={sortEvents(events)} />
    </div>
  );
};

export default Timer;
