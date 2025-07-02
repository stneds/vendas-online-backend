import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}
  

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const userExists = await this.userRepository.findOne({where:{ cpf: createUserDto.cpf }});
    if (userExists) {
      throw new Error(`Usuário já existe`);
    }

    const saltOrRounds = 10;
    const passwordHashed = await bcrypt.hash(createUserDto.password, saltOrRounds);

    return this.userRepository.save({
      ...createUserDto,
      password: passwordHashed,
    });
  }

   async findAll(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }

 async findOne(id: number): Promise<UserEntity | string> {
  const user = await this.userRepository.findOne({ where: { id } });
  if (!user) {
    return `Usuário com id #${id} não encontrado`;
  }
  return user;
}

 
async update(id: number, updateUserDto: UpdateUserDto): Promise<UserEntity | string> {
  const user = await this.userRepository.findOne({ where: { id } });
  if (!user) {
    return `Usuário com id #${id} não encontrado`;
  }

  // Atualiza os campos permitidos
  if (updateUserDto.email) user.email = updateUserDto.email;
  if (updateUserDto.phone) user.phone = updateUserDto.phone;

  await this.userRepository.save(user);
  return user;
}

async remove(id: number): Promise<string> {
  const result = await this.userRepository.delete(id);
  if (result.affected === 0) {
    return `Usuário com id #${id} não encontrado`;
  }
  return `Usuário com id #${id} removido com sucesso`;
}
}
