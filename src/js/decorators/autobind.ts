// Autobind decorator

export function Autobind(
  target: any,
  methodName: string,
  descriptor: PropertyDescriptor
): PropertyDescriptor {
  // need to get the original method from the descriptor

  const originalMethod = descriptor.value;

  // create a new adjusted property descriptor object here

  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    enumerable: false,

    // a getter method

    get(this: any) {
      // lets now create a variable that is bound to the "this ref" of the original method

      const boundFn = originalMethod.bind(this);
      return boundFn;
    },
  };

  // finally return the adjusted descriptor

  return adjDescriptor;
}
