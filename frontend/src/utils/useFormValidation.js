import { useCallback, useState } from "react";

export default function useFormValidation() {
  const [listValue, setListValue] = useState({})
  const [errorMessages, setErrorMessages] = useState({})
  const [isValid, setIsValid] = useState(false)
  const [isValidInput, setIsValidInput] = useState({})

  function handleChange(evt) {
    const name = evt.target.name
    const value = evt.target.value
    const validationMessage = evt.target.validationMessage
    const valid = evt.target.validity.valid
    const form = evt.target.form

    setListValue((oldListValue) => {
      return { ...oldListValue, [name]: value };
    });

    setErrorMessages((oldErrorMessages) => {
      return { ...oldErrorMessages, [name]: validationMessage };
    });

    setIsValidInput((oldIsValidInput) => {
      return { ...oldIsValidInput, [name]: valid };
    });

    setIsValid(form.checkValidity())
  }

  function reset(data = {}) {
    setListValue(data)
    setErrorMessages({})
    setIsValid(false)
    setIsValidInput({})
  }

  const setListValues = useCallback((name, value) => {
    setListValue((oldListValue) => {
      return { ...oldListValue, [name]: value }
    })
  }, [])

  return { listValue, errorMessages, isValidInput, isValid, handleChange, reset, setListValues }
}