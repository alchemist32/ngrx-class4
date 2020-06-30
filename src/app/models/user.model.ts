export class User {
  constructor(
    public uid: string,
    public name: string,
    public email: string
  ){}

  public static fromFirebase({ email, uid, name }): User {
    return new User(uid, name, email);
  }
}