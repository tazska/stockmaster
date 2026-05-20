import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from '../entities/producto.entity'; // Asumiendo esta ruta
import { CreateProductoDto } from '../dto/create-producto.dto';
import { UpdateProductoDto } from '../dto/update-producto.dto'; // Asumiendo que este DTO existe
import { StockGateway } from '../gateways/stock.gateway'; // Importar el gateway

@Injectable()
export class ProductoService {
  constructor(
    @InjectRepository(Producto)
    private productoRepository: Repository<Producto>,
    private readonly stockGateway: StockGateway, // Inyectar el gateway
  ) {}

  async create(createProductoDto: CreateProductoDto): Promise<Producto> {
    const producto = this.productoRepository.create(createProductoDto);
    const savedProducto = await this.productoRepository.save(producto);
    // Emitir evento de creación de producto
    this.stockGateway.emitProductCreated(savedProducto);
    return savedProducto;
  }

  async findAll(): Promise<Producto[]> {
    return this.productoRepository.find();
  }

  async findOne(id: number): Promise<Producto> {
    const producto = await this.productoRepository.findOne({ where: { id } });
    if (!producto) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }
    return producto;
  }

  async update(id: number, updateProductoDto: UpdateProductoDto): Promise<Producto> {
    const producto = await this.findOne(id);
    Object.assign(producto, updateProductoDto);
    const updatedProducto = await this.productoRepository.save(producto);
    
    // Tarea 4: Emitir eventos al room product:{id} al actualizar
    this.stockGateway.emitProductUpdated(updatedProducto);
    
    // Verificar alertas de stock bajo (si aplica)
    this.stockGateway.sendLowStockAlert(updatedProducto);
    
    return updatedProducto;
  }

  async remove(id: number): Promise<void> {
    const producto = await this.findOne(id);
    await this.productoRepository.remove(producto);
    // Emitir evento de eliminación de producto
    this.stockGateway.emitProductDeleted(id);
  }
}