import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Producto } from '../../modules/entities/producto.entity';

@Entity('categorias')
export class Categoria {
  @ApiProperty({ example: 1, description: 'ID único de la categoría' })
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty({
    example: 'Electrónica',
    description: 'Nombre de la categoría',
  })
  @Column({ length: 100, unique: true })
  nombre!: string;

  @ApiProperty({
    example: 'Productos electrónicos y tecnología',
    description: 'Descripción de la categoría',
  })
  @Column({ length: 255, nullable: true })
  descripcion?: string;

  @ApiProperty({
    type: () => [Producto],
    description: 'Productos en esta categoría',
  })
  @OneToMany(() => Producto, (producto) => producto.categoria)
  productos!: Producto[];
}
