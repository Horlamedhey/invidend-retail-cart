import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '@/app/models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly productsUrl = 'assets/products.json';
  constructor(private readonly httpClient: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.httpClient.get<Product[]>(this.productsUrl);
  }
}
