export interface IUser {
  gender: string;
  name: {
    first: string;
    last: string;
  };
  location: {
    city: string;
  };
  email: string;
  dob: {
    date: string;
    age: number;
  };
  phone: string;
  role?: string;
  accessibility?: string;
  id: string;
}
