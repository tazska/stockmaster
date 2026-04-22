import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriaService } from '../../modules/services/categoria.service';
import { CategoriaController } from '../../modules/controllers/categoria.controller';
import { Categoria } from '../../modules/entities/categoria.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Categoria])],
  controllers: [CategoriaController],
  providers: [CategoriaService],
  exports: [CategoriaService, TypeOrmModule],
})
export class CategoriaModule {}
