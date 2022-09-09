export class UserComment {
  id: number;
  date: Date;
  comment: string;
  user: string;

  public constructor(id: number, user: string, comment: string, date: Date) {
    this.id = id;
    this.user = user;
    this.comment = comment;
    this.date = date;
  }
}

