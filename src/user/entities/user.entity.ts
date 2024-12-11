import { Column, Entity } from 'typeorm';
import { EntityHelper } from '../../utils/entity-helper';

@Entity()
export class User extends EntityHelper {
  @Column({ unique: true, nullable: true, default: undefined })
  email: string;

  @Column({ nullable: true, default: undefined })
  firstName: string;

  @Column({ nullable: true, default: undefined })
  lastName: string;

  @Column({ nullable: true, default: undefined })
  avatar: string;

  @Column({ nullable: true, default: undefined })
  password?: string;
}
