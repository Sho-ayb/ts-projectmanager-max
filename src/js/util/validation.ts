// imports

import { Validatable } from '../models/interfaces';

// a function to handle valid inputs

export function validInput(validInput: Validatable): boolean {
  // keep a variable here to determine to return truthy || falsy
  let isValid: boolean = true;

  // checking if anything is entered as an input
  if (validInput.required) {
    // this checks if isValid is truthy and then converts the value of this input to a string, because a validInput could also be a number. We get rid of empty spaces using trim() and then check its length and if it is not equal to 0 then the && operator will return a truthy.
    isValid = isValid && validInput.value.toString().trim().length !== 0;
  }

  // our inputs have also a minLength but because all are validatables are optional, we need to check if the prop is a null or undefined and != null returns both and we also check if the validInputs value is a string.
  if (validInput.minLength != null && typeof validInput.value === 'string') {
    isValid =
      isValid && validInput.value.toString().length > validInput.minLength;
  }

  if (validInput.maxLength != null && typeof validInput.value === 'string') {
    isValid =
      isValid && validInput.value.toString().length <= validInput.maxLength;
  }

  if (validInput.min != null && typeof validInput.value === 'number') {
    isValid = isValid && validInput.value >= validInput.min;
  }

  if (validInput.max != null && typeof validInput.value === 'number') {
    isValid = isValid && validInput.value <= validInput.max;
  }

  // in the end we ruturn a boolean
  return isValid;
}
