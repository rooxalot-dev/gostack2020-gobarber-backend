export default interface CreateUserDTO {
  name: string;
  email: string;
  passwordHash: string;
  isProvider?: boolean;
};
