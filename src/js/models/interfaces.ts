// a new interface object to validate user inputs

interface Validatable {
  value: string | number;
  required: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

// a new interface object that includes methods that certain class's need to implement

interface Draggable {
  dragStartHandler(event: DragEvent): void;
  dragEndHandler(event: DragEvent): void;
}

// the above is an interface for a class that implements a drag, the following interface is for the class that implements listening events methods on the target element

interface DragTarget {
  dragOverHandler(event: DragEvent): void;
  dropHandler(event: DragEvent): void;
  dragLeaveHandler(event: DragEvent): void;
}

export { Validatable, Draggable, DragTarget };
