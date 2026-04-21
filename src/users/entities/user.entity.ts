import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from '../../common/enums/role.enum';
import { Exclude } from 'class-transformer';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  nombre: string;

  @Column()
  @Exclude() // ← nunca se serializa en respuestas
  password: string;

  @Column({ type: 'enum', enum: Role, default: Role.CONSULTOR })
  rol: Role;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'varchar', length: 500, nullable: true })
  @Exclude() // ← nunca se serializa en respuestas
  refreshToken: string | null;

  @CreateDateColumn()
  creadoEn: Date;

  @UpdateDateColumn()
  actualizadoEn: Date;

  // Relación con movimientos (se agrega cuando se cree ese módulo)
  // @OneToMany(() => Movimiento, (m) => m.usuario)
  // movimientos: Movimiento[];
}
