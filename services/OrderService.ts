import { Order } from '../dtos/Order.dto'
import { fetchApi } from '@/helpers/utilities'

const API_URL_BASE = `${process.env.NEXT_PUBLIC_API_ORDERSERVICE_BASE}`;

const API_URL_GETACTIVEORDERS = `${process.env.NEXT_PUBLIC_API_URL_GETACTIVEORDERS}`;
const API_URL_MOVEINPROGRESS = `${process.env.NEXT_PUBLIC_API_URL_MOVEINPROGRESS}`;
const API_URL_MOVEREADY = `${process.env.NEXT_PUBLIC_API_URL_MOVEREADY}`;
const API_URL_MOVEDELIVERED = `${process.env.NEXT_PUBLIC_API_URL_MOVEDELIVERED}`;
const API_URL_CANCELORDER = `${process.env.NEXT_PUBLIC_API_URL_CANCELORDER}`;

export class OrderService {

  async getOrders(): Promise<Order[]> {
    try {
      const res = await fetchApi<Order[]>(API_URL_BASE + API_URL_GETACTIVEORDERS,{
        method: 'GET',
      });

      return res;
      
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  }
  
  async moveToInProgress(order: Order): Promise<Order> {

    if (order.state !== 'PENDING') throw new Error('Order must be pending to move to in progress')
    const url = `${API_URL_BASE}/${order.id}${API_URL_MOVEINPROGRESS}`;

    try{
      
      const res = await fetchApi<{message:string,data:Order}>(url, {
        method: 'POST',
      });

      if (res.data.id == order.id && res.data.state == 'IN_PROGRESS') return res.data;
      return order;
      
      
    }catch(error){
      console.error('Error moving order to in progress:', error);
      throw error;
    }
    
  }

  async moveToReady(order: Order): Promise<Order> {
    if (order.state !== 'IN_PROGRESS') throw new Error('Order must be in progress to move to ready')
    const url = `${API_URL_BASE}/${order.id}${API_URL_MOVEREADY}`;

    try{
      
      const res = await fetchApi<{message:string,data:Order}>(url, {
        method: 'POST',
      });

      if (res.data.id == order.id && res.data.state == 'READY') return res.data;
      return order;
      
      
    }catch(error){
      console.error('Error moving order to ready:', error);
      throw error;
    }
  }

  async moveToDelivered(order: Order): Promise<Order> {
    if (order.state !== 'READY') throw new Error('Order must be ready to move to delivered')
    const url = `${API_URL_BASE}/${order.id}${API_URL_MOVEDELIVERED}`;

    try{
      
      const res = await fetchApi<{message:string,data:Order}>(url, {
        method: 'POST',
      });
      if (res.data.id == order.id && res.data.state == 'DELIVERED') return res.data;
      return order;

    }catch(error){
      console.error('Error moving order to delivered:', error);
      throw error;
    }
  }

  async cancelOrder(order: Order): Promise<Order> {
    //IMPLEMENTAR CANCELAR ORDEN
    if (order.state === 'CANCELLED') throw new Error('Order is already cancelled')
    const url = `${API_URL_BASE}/${order.id}${API_URL_CANCELORDER}`;
  
    try{
      
      const res = await fetchApi<{message:string,data:Order}>(url, {
        method: 'POST',
      });
      //VERIFICAR RESPUESTA Y ACTUALIZAR ESTADO DE LA ORDEN
      if (res.data.id == order.id && res.data.state == 'CANCELLED') return res.data;
      return order;
    }catch(error){
      console.error('Error cancelling order:', error);
      throw error;
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