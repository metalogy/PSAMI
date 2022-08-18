export class User {
  id: number;
  firstName: string;
  lastName: string;
  age: string;
  city: string

  public constructor(id: number, firstName: string, lastName: string, age: string, city: string) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.age = age;
    this.city = city;
  }
}

