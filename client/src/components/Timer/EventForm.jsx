import React from 'react';
import { useFormik } from 'formik';
import styles from './Timer.module.css';
import moment from 'moment';
import TimerUtils from './useTimerUtils';
import Schems from '../../utils/validators/validationSchems';

const renderOptions = (options) => {
  return options.map((option) => (
    <option key={option.id} value={option}>
      {option}
    </option>
  ));
};

const InputField = ({ label, type, field, form }) => (
  <div className={styles.inputContainer}>
    <label>{label}:</label>
    <br />
    <input type={type} {...field} className={styles.inputField} />
    {form.touched[field.name] && form.errors[field.name] && (
      <div className={styles.error}>{form.errors[field.name]}</div>
    )}
  </div>
);

const SelectField = ({ label, options, field, form }) => (
  <div className={styles.inputContainer}>
    <label>{label}:</label>
    <br />
    <select {...field} className={styles.selectField}>
      {renderOptions(options)}
    </select>
    {form.touched[field.name] && form.errors[field.name] && (
      <div className={styles.error}>{form.errors[field.name]}</div>
    )}
  </div>
);

const EventForm = ({ createEvent, numbers, units }) => {
  const timerUtils = TimerUtils([], {});

  const formik = useFormik({
    initialValues: {
      eventName: '',
      eventEndDate: '',
      notificationNumber: '',
      notificationUnit: '',
    },
    validationSchema: Schems.EventSchema,
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
    <form onSubmit={formik.handleSubmit}>
      <div className={styles.formContainer}>
        <InputField
          label="Event name"
          type="text"
          field={formik.getFieldProps('eventName')}
          form={formik}
        />
        <InputField
          label="Event date"
          type="datetime-local"
          field={formik.getFieldProps('eventEndDate')}
          form={formik}
        />
        <SelectField
          label="Notify before"
          options={numbers}
          field={formik.getFieldProps('notificationNumber')}
          form={formik}
        />
        <SelectField
          label="Notification unit"
          options={units}
          field={formik.getFieldProps('notificationUnit')}
          form={formik}
        />
        <button type="submit" className={styles.createButton}>
          CREATE EVENT
        </button>
      </div>
    </form>
  );
};

export default EventForm;
