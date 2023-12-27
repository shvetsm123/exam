import { useCallback, useRef } from 'react';
import moment from 'moment';

const useTimerUtils = (events, eventData) => {
  const completedEventsCount = useRef(0);

  const calculateCountdown = (event) => {
    let now = moment();
    let eventTime = moment(event.eventEndDate);
    let timeDiff = eventTime.diff(now, 'milliseconds');

    if (timeDiff <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
    }

    let seconds = Math.floor(timeDiff / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);
    let days = Math.floor(hours / 24);

    seconds %= 60;
    minutes %= 60;
    hours %= 24;

    return {
      days,
      hours,
      minutes,
      seconds,
    };
  };

  const calculatePercentage = (event) => {
    let now = moment();
    let eventStartDate = moment(event.eventStartDate);
    let eventEndDate = moment(event.eventEndDate);

    if (now.isBefore(eventStartDate)) {
      return 0;
    }

    if (now.isAfter(eventEndDate)) {
      return 100;
    }

    let totalDuration = eventEndDate.diff(eventStartDate, 'milliseconds');
    let elapsedDuration = now.diff(eventStartDate, 'milliseconds');

    let currentPercent = (elapsedDuration / totalDuration) * 100;

    return currentPercent;
  };

  const calculateNotificationTime = useCallback(() => {
    if (!eventData.notificationNumber || !eventData.notificationUnit) {
      return null;
    }

    const { notificationNumber, notificationUnit } = eventData;
    const unitMultiplier = {
      sec: 1,
      min: 60,
      hr: 60 * 60,
      day: 24 * 60 * 60,
    };

    return notificationNumber * unitMultiplier[notificationUnit];
  }, [eventData]);

  const updateEventsCallback = useCallback(() => {
    let showToast = false;
    const updatedEvents = events.map((currentEvent) => {
      const percentage = calculatePercentage(currentEvent);

      if (percentage === 100 && currentEvent.percentage !== 100) {
        showToast = true;
        completedEventsCount.current += 1;
      }

      const notificationTime = calculateNotificationTime();
      if (
        notificationTime !== null &&
        currentEvent.countdown &&
        currentEvent.countdown.seconds === notificationTime &&
        !currentEvent.notificationSent
      ) {
        showToast = true;
        currentEvent.notificationSent = true;
      }

      return {
        ...currentEvent,
        percentage,
        countdown: calculateCountdown(currentEvent),
        notificationTime,
      };
    });

    return { updatedEvents, showToast };
  }, [events, calculateNotificationTime]);

  const calculateUnitMultiplier = (unit) => {
    const unitMultiplier = {
      sec: 1,
      min: 60,
      hr: 60 * 60,
      day: 24 * 60 * 60,
    };
    return unitMultiplier[unit] || 1;
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const formattedTime = [];
    if (hours > 0) formattedTime.push(`${hours}h`);
    if (minutes > 0) formattedTime.push(`${minutes}m`);
    if (remainingSeconds > 0) formattedTime.push(`${remainingSeconds}s`);

    return formattedTime.join(' ');
  };

  const sortEvents = (events) => {
    return events.slice().sort((a, b) => {
      const dateA = moment(a.eventEndDate);
      const dateB = moment(b.eventEndDate);
      return dateA - dateB;
    });
  };

  return {
    calculateNotificationTime,
    calculateUnitMultiplier,
    formatTime,
    updateEventsCallback,
    sortEvents,
    calculatePercentage,
    calculateCountdown,
    completedEventsCount,
  };
};

export default useTimerUtils;
