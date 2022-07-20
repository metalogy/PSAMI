export class UserComment {
  date: Date;
  comment: string;
  user: string;

  public constructor(user: string, comment: string, date: Date) {
    this.user = user;
    this.comment = comment;
    this.date = date;
  }
}

