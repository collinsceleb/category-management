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
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Category, (category) => category.children, {
    nullable: true,
    onDelete: 'SET NULL',
    
  })
  @JoinColumn({ name: 'parent_id' })
  @Index('PARENT_ID_IDX')
  parent: Category;
  
  @OneToMany(() => Category, (category) => category.parent)
  children: Category[];
  
}
