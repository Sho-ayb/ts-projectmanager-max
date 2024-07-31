export enum ProjectStatus {
  Active,
  Finished,
}

// Creating a class to create Projects
export class Project {
  // using the shorthand way of defining class properties
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public numOfPeople: number,
    public status: ProjectStatus
  ) {}
}
