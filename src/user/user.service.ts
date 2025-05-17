import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  private users: User[] = [];

  async create(createUserDto: CreateUserDto): Promise<User> {
    const saltOrRounds = 10;
    const passwordHashed = await bcrypt.hash(createUserDto.password, saltOrRounds);

    const user: User = {
      ...createUserDto,
      id: this.users.length + 1,
      password: passwordHashed,
    };

    this.users.push(user);

    return user
  }

   async findAll(): Promise<User[]> {
    return this.users;
  }

 findOne(id: number) {
  const user = this.users.find(u => u.id === id);
  if (!user) {
    return `Usuário com id #${id} não encontrado`;
  }
  return user;
}

  update(id: number, updateUserDto: UpdateUserDto) {
  const user = this.users.find(u => u.id === id);
  if (!user) {
    return `Usuário com id #${id} não encontrado`;
  }

  if (updateUserDto.email) {
    user.email = updateUserDto.email;
  }
  if (updateUserDto.phone) {
    user.phone = updateUserDto.phone;
  }

  return user;
}

  remove(id: number) {
    const userIndex = this.users.findIndex(u => u.id === id);
    if (userIndex === -1){
      return `Usuário com id #${id} não encontrado`;

    }
    this.users.splice(userIndex, 1);
    return `O usuário #${id} foi removido com sucesso`;
  }
}
