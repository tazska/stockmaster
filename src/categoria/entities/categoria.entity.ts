import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('categorias')
export class Categoria {
  @ApiProperty({ example: 1, description: 'ID único de la categoría' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Electrónica', description: 'Nombre de la categoría' })
  @Column({ length: 100, unique: true })
  nombre: string;

  @ApiProperty({ example: 'Productos electrónicos y tecnología', description: 'Descripción de la categoría' })
  @Column({ length: 255, nullable: true })
  descripcion: string;

  // Relación OneToMany con Producto
  // Se descomenta cuando el módulo de productos esté disponible
  // @OneToMany(() => Producto, (producto) => producto.categoria)
  // productos: Producto[];
}
