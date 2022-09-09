export class Comment {
  id: number;
  date: Date;
  comment: string;
  user: string;
  rating?: number;

  public constructor(id: number, user: string, comment: string, date: Date, rating?: string) {
    this.id = id;
    this.user = user;
    this.comment = comment;
    this.date = date;
    this.rating = Number(rating);
  }
}

