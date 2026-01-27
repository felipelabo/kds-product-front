import { Order } from '../dtos/Order.dto'

// Opción 1: Usar proxy de Next.js (recomendado)
const API_URL = 'http://localhost:3001/orders'; //'/api/orders'

// Opción 2: API directa (requiere configurar CORS en tu servidor)
// const API_URL = 'http://localhost:3001/orders'

export class OrderService {

  async getOrders(): Promise<Order[]> {
    try {
      console.log('Fetching orders from', API_URL);
      const res = await fetch(API_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        // Opcional: si necesitas credenciales
        // credentials: 'include',
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log('Fetched orders:', data);
      return data;
      
    } catch (error) {
      console.error('Error fetching orders:', error);
      
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        console.error('🚨 CORS or Network error detected');
        console.error('💡 Possible solutions:');
        console.error('   1. Check if API server is running on', API_URL);
        console.error('   2. Configure CORS on your API server');
        console.error('   3. Use Next.js API routes as proxy');
      }
      
      throw error;
    }
  }
  
  moveToInProgress(order: Order): Order {
    if (order.state !== 'PENDING') {
      throw new Error('Order must be pending to move to in progress')
    }
    return { 
      ...order, 
      state: 'IN_PROGRESS'
    }
  }

  moveToReady(order: Order): Order {
    if (order.state !== 'IN_PROGRESS') {
      throw new Error('Order must be in progress to move to ready')
    }
    return { 
      ...order, 
      state: 'READY'
    }
  }

  canBePickedUp(order: Order): boolean {
    //VERIFICAR QUE LLEGO EL RIDER PARA HACER PICKUP
    return order.state === 'READY'
  }

  validateOrder(order: Order): void {
    if (!order.id) throw new Error('Order ID is required')
    if (!order.items?.length) throw new Error('Order must have items')
  }
}