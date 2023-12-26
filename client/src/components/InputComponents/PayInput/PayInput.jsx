import React from 'react';
import classNames from 'classnames';
import InputMask from 'react-input-mask';
import { useField } from 'formik';

const PayInput = ({ label, changeFocus, classes, isInputMask, mask, name }) => {
  const [field, meta] = useField(name);
  const { touched, error } = meta;

  const { value, ...rest } = field;
  const inputValue = value || '';

  if (field.name === 'sum') {
    return (
      <div className={classes.container}>
        <input
          {...rest}
          value={inputValue}
          placeholder={label}
          className={classNames(classes.input, {
            [classes.notValid]: touched && error,
          })}
        />
        {touched && error && (
          <span className={classes.error}>{error.message}!</span>
        )}
      </div>
    );
  }

  if (isInputMask) {
    return (
      <div className={classes.container}>
        <InputMask
          mask={mask}
          maskChar={null}
          {...rest}
          value={inputValue}
          placeholder={label}
          className={classNames(classes.input, {
            [classes.notValid]: touched && error,
          })}
          onFocus={() => changeFocus(field.name)}
        />
        {touched && error && (
          <span className={classes.error}>{error.message}!</span>
        )}
      </div>
    );
  }

  return (
    <div className={classes.container}>
      <input
        {...rest}
        value={inputValue}
        placeholder={label}
        className={classNames(classes.input, {
          [classes.notValid]: touched && error,
        })}
        onFocus={() => changeFocus(field.name)}
      />
      {touched && error && (
        <span className={classes.error}>{error.message}!</span>
      )}
    </div>
  );
};

export default PayInput;
