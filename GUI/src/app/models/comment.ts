export class Comment {
  date: Date;
  comment: string;
  user: string;
  rating?: number;

  public constructor(user: string, comment: string, date: Date, rating?: string) {
    this.user = user;
    this.rating = Number(rating);
    this.comment = comment;
    this.date = date;
  }
}

