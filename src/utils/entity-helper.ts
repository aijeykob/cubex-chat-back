import {
  BaseEntity,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ValueTransformer,
} from 'typeorm';

const dateTransformer: ValueTransformer = {
  // createdAt and updatedAt are automatically generated values, so we don't care about what values are passed here
  to: (value: any) => value,
  from: (value: Date) => (value ? value.toISOString() : value),
};

export abstract class EntityHelper extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamp', transformer: dateTransformer })
  createdAt: string;

  @UpdateDateColumn({ type: 'timestamp', transformer: dateTransformer })
  updatedAt: string;
}
