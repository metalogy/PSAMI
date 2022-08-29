export class Event {
  name: string;
  city: string;
  address: string;
  suggestedAge: number;
  minUsers: number;
  maxUsers: number;
  date: string;

  constructor(name: string, city: string, address: string, suggestedAge: number, minUsers: number, maxUsers: number, date: string) {
    this.name = name;
    this.city = city;
    this.address = address;
    this.suggestedAge = suggestedAge;
    this.minUsers = minUsers;
    this.maxUsers = maxUsers;
    this.date = date;
  }
}

