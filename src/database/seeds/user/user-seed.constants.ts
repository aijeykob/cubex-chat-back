import { DeepPartial } from 'typeorm';
import { User } from '../../../user/entities/user.entity';

export const userSeeds: DeepPartial<User>[] = [
  {
    firstName: 'Cat',
    lastName: 'Murka',
    password: '12345',
    email: 'catmurka@gmail.com',
    avatar: '/static/avatars/user-cat.png',
  },
  {
    firstName: 'Dog',
    lastName: 'Sharik',
    password: '12345',
    email: 'dogsharik@gmail.com',
    avatar: '/static/avatars/user-dog.png',
  },
  {
    firstName: 'Bear',
    lastName: 'Misha',
    password: '12345',
    email: 'bearmisha@gmail.com',
    avatar: '/static/avatars/user-bear.png',
  },
];
