import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment';
import EventForm from './EventForm';
import EventList from './EventList';
import useTimerUtils from './useTimerUtils';
import { useDispatch } from 'react-redux';
import { setCompletedEventsCount } from '../../store/slices/timerSlice';

const Timer = () => {
  const dispatch = useDispatch();

  const [eventData, setEventData] = useState({
    eventName: '',
    eventStartDate: '',
    eventEndDate: '',
    notificationNumber: '',
    notificationUnit: '',
  });
  const [events, setEvents] = useState([]);

  const {
    updateEventsCallback,
    sortEvents,
    completedEventsCount,
    updatedEvents,
    calculateUnitMultiplier,
    formatTime,
  } = useTimerUtils(events, eventData);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const { updatedEvents, showToast } = updateEventsCallback();

      if (showToast) {
        dispatch(setCompletedEventsCount(completedEventsCount.current));

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

    return () => {
      clearInterval(intervalId);
    };
  }, [updateEventsCallback, completedEventsCount, dispatch, updatedEvents]);

  const handleInputChanger = (event) => {
    const { name, value } = event.target;
    setEventData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const createEvent = (values) => {
    const endDate = moment(values.eventEndDate);

    const newEvent = { ...values };
    newEvent.id = Date.now();
    newEvent.eventStartDate = moment().toISOString();
    newEvent.eventEndDate = endDate.toISOString();
    const eventDuration = Math.floor(endDate.diff(moment(), 'minutes'));
    newEvent.eventDuration = eventDuration;

    setEvents((prevEvents) => [...prevEvents, newEvent]);
    setEventData({
      eventName: '',
      eventStartDate: '',
      eventEndDate: '',
      notificationNumber: '',
      notificationUnit: '',
    });

    const notifyBeforeInSeconds =
      values.notificationNumber *
      calculateUnitMultiplier(values.notificationUnit);

    if (notifyBeforeInSeconds <= 0) {
      console.log('Invalid notification time.');
      return;
    }

    const now = moment();
    const eventTime = moment(newEvent.eventEndDate);
    const adjustedEventTime = eventTime.subtract(
      notifyBeforeInSeconds,
      'seconds'
    );
    const timeUntilNotification = adjustedEventTime.diff(now, 'milliseconds');

    if (timeUntilNotification <= 0) {
      console.log('Notification time has already passed.');
      return;
    }

    setTimeout(() => {
      toast.info(
        `Notification for ${newEvent.eventName}: ${formatTime(
          notifyBeforeInSeconds
        )} before the event`,
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
    }, timeUntilNotification);
  };

  const numbers = ['', ...Array.from({ length: 61 }, (_, index) => index)];
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

      {events.length > 0 && <EventList events={sortEvents(events)} />}
    </div>
  );
};

export default Timer;
