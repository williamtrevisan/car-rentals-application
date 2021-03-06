import { getRepository, Repository } from "typeorm";

import { ICreateUserDTO } from "../../../dto/ICreateUserDTO";
import { IUsersRepository } from "../../../repositories/IUsersRepository";
import { User } from "../entities/User";

class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async create({
    id,
    name,
    email,
    password,
    driver_license,
    avatar,
  }: ICreateUserDTO): Promise<void> {
    const user = this.repository.create({
      id,
      name,
      email,
      password,
      driver_license,
      avatar,
    });

    await this.repository.save(user);
  }

  findByEmail(email: string): Promise<User> {
    return this.repository.findOne({ email });
  }

  findByPk(id: string): Promise<User> {
    return this.repository.findOne(id);
  }
}

export { UsersRepository };
