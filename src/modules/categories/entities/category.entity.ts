import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('category')
export class Category {
  @ApiProperty({ example: 1, description: 'id' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Electronics', description: 'name' })
  @Column()
  name: string;

  @ApiProperty({ example: 1, description: 'parent_id' })
  @ManyToOne(() => Category, (category) => category.children, {
    nullable: true,
    onDelete: 'SET NULL',
    
  })
  @JoinColumn({ name: 'parent_id' })
  @Index('PARENT_ID_IDX')
  parent: Category;
  
  @ApiProperty({ example: [], description: 'children' })
  @OneToMany(() => Category, (category) => category.parent)
  children: Category[];
  
}
