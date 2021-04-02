import { useState, useEffect } from 'react';
import { getAttributes } from "validation/index";

export function useFormHandler(validator, initialValues) {
  const values = {};

  // Set attributes for the locale
  validator.dictionary.container[validator.locale].attributes = getAttributes(validator.locale);

  validator.extend(
    'password_confirmation',
    (value, { password }) => {
      return value !== password;
    },
    { paramNames: ['password'] },
  );

  // Set initial values for the form fields
  validator.fields.items.forEach(
    value =>
      (values[value.name] =
        initialValues && initialValues.hasOwnProperty(value.name)
          ? initialValues[value.name]
          : ''),
  );

  const [formState, setFormState] = useState({
    values,
    errors: validator.errors,
  });

  useEffect(() => {
    if (initialValues) {
      setFormState(prevState => ({
        ...prevState,
        values,
      }));
    }
  }, [initialValues]); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Handles form change
   *
   * @param {object} event
   */
  const handleChange = event => {
    const name = event.target.name;
    const type = event.target.type;
    const id = event.target.id;
    const value = type === 'file' ? Array.from(event.target.files) : event.target.value;

    validator.errors.remove(name);

    if (type === 'checkbox') {
      const checkValue = formState.values[`${name}`] || [];
      let checkedData;

      if ((id && !checkValue.length > 0) || typeof checkValue === 'string') {
        checkedData = value;
      } else if (checkValue.includes(value)) {
        checkedData = checkValue.filter(data => data !== value);
      } else {
        checkValue.push(value);
        checkedData = checkValue;
      }

      setFormState(prevState => ({
        ...prevState,
        values: {
          ...formState.values,
          [name]: checkedData,
        },
      }));
    } else {
      setFormState(prevState => ({
        ...prevState,
        values: {
          ...prevState.values,
          [name]: value,
        },
      }));
    }

    validator.validate(name, value).then(() => {
      setFormState(prevState => ({
        ...prevState,
        errors: validator.errors,
      }));
    });
  };

  /**
   * Trigger validateAll() when submitting a form
   *
   * @param {function} callback
   */
  const submitForm = callback => {
    validator.validateAll(formState.values).then(success => {
      if (success) {
        if (callback !== undefined) {
          callback();
        }
      } else {
        setFormState(prevState => ({
          ...prevState,
          errors: validator.errors,
        }));
      }
    });
  };

  /**
   * Check if field has error
   *
   * @param field
   */
  const hasError = field => {
    return formState.errors && formState.errors.has(field);
  };

  /**
   * Clears all errors
   */
  const clearErrors = () => {
    setFormState(prevState => ({
      ...prevState,
      errors: prevState.errors && prevState.errors.clear(),
    }));
    validator.errors && validator.errors.clear();
  };

  return [formState, handleChange, submitForm, hasError, clearErrors];
}
