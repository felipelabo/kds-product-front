import { Order } from '../dtos/Order.dto'

export class OrderService {
  
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