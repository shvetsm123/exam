import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import styles from './Timer.module.css';
import moment from 'moment';
import TimerUtils from './useTimerUtils';

const EventForm = ({ createEvent, numbers, units }) => {
  const timerUtils = TimerUtils([], {});

  const renderOptions = (options) => {
    return options.map((option, index) => (
      <option key={option + index} value={option}>
        {option}
      </option>
    ));
  };

  const formik = useFormik({
    initialValues: {
      eventName: '',
      eventEndDate: '',
      notificationNumber: '',
      notificationUnit: '',
    },
    validationSchema: Yup.object({
      eventName: Yup.string().required('Please enter a valid event name'),
      eventEndDate: Yup.date()
        .min(new Date())
        .required('Please choose a future date'),
      notificationNumber: Yup.number().integer('Please enter a valid number'),
      notificationUnit: Yup.string('Please select a unit'),
    }),
    onSubmit: (values, { resetForm }) => {
      const notifyBeforeInSeconds =
        values.notificationNumber *
        timerUtils.calculateUnitMultiplier(values.notificationUnit);
      const timeUntilEvent = moment(values.eventEndDate).diff(
        moment(),
        'seconds'
      );

      if (notifyBeforeInSeconds >= timeUntilEvent) {
        alert(
          'Notification time should be less than the time until the event.'
        );
        return;
      }

      createEvent({
        ...values,
        notificationNumber: Number(values.notificationNumber),
      });
      resetForm();
    },
  });

  return (
    <form onSubmit={(event) => formik.handleSubmit(event)}>
      <div className={styles.formContainer}>
        <div className={styles.inputContainer}>
          <label>Event name*:</label>
          <br />
          <input
            type="text"
            name="eventName"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.eventName}
            className={styles.inputField}
          />
          {formik.touched.eventName && formik.errors.eventName && (
            <div className={styles.error}>{formik.errors.eventName}</div>
          )}
        </div>

        <div className={styles.inputContainer}>
          <label>Event date*:</label>
          <br />
          <input
            type="datetime-local"
            name="eventEndDate"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.eventEndDate}
            className={styles.inputField}
          />
          {formik.touched.eventEndDate && formik.errors.eventEndDate && (
            <div className={styles.error}>{formik.errors.eventEndDate}</div>
          )}
        </div>

        <div className={styles.inputContainer}>
          <label>Notify before:</label>
          <br />
          <select
            name="notificationNumber"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.notificationNumber}
            className={styles.selectField}
          >
            {renderOptions(numbers)}
          </select>
          {formik.touched.notificationNumber &&
            formik.errors.notificationNumber && (
              <div className={styles.error}>
                {formik.errors.notificationNumber}
              </div>
            )}
          <select
            name="notificationUnit"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.notificationUnit}
            className={styles.selectField}
          >
            {renderOptions(units)}
          </select>
          {formik.touched.notificationUnit &&
            formik.errors.notificationUnit && (
              <div className={styles.error}>
                {formik.errors.notificationUnit}
              </div>
            )}
        </div>

        <button type="submit" className={styles.createButton}>
          CREATE EVENT
        </button>
      </div>
    </form>
  );
};

export default EventForm;
