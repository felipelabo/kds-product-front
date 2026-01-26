import { useCallback, useMemo } from 'react';
import { Order } from "@/dtos/Order.dto";
import { OrderService } from "@/services/OrderService";
import { useOrders } from '@/contexts/Orders.context';

type nextStateType = 'Preparar' | 'Terminar' | 'Entregar' 

const useOrderCard = () => {

    // Instancia única del servicio
    const orderService = useMemo(() => new OrderService(), [])
    
    // TODO: Conectar con el contexto cuando esté disponible
    const { updateOrder } = useOrders()

    const handleChangeState = useCallback((order: Order) => {
        try {
            let updatedOrder: Order;
            
            switch(order.state) {
                case 'PENDING':
                    updatedOrder = orderService.moveToInProgress(order);
                    break;
                case 'IN_PROGRESS':
                    updatedOrder = orderService.moveToReady(order);
                    break;
                case 'READY':
                    // TODO: Implementar lógica de entrega
                    console.log('Order ready for pickup:', order.id);
                    return order;
                default:
                    return order;
            }
            
            updateOrder(updatedOrder)
            console.log(`Order ${order.id} moved from ${order.state} to ${updatedOrder.state}`);
            
            return updatedOrder;
        } catch (error) {
            console.error("Error changing order state:", error);
            return order; // Retornar orden original en caso de error
        }
    }, [orderService])

    const canAdvanceState = useCallback((order: Order): boolean => {
        switch(order.state) {
            case 'PENDING':
            case 'IN_PROGRESS':
                return true;
            case 'READY':
                return orderService.canBePickedUp(order);
            default:
                return false;
        }
    }, [orderService])

    const getNextState = (state: Order['state']): nextStateType | null => {
        switch(state) {
            case 'PENDING':
                return 'Preparar'
            case 'IN_PROGRESS':
                return 'Terminar'
            case 'READY':
                return 'Entregar'
            default:
                return null
        }
    }

    return {
        handleChangeState,
        canAdvanceState,
        orderService,
        getNextState
    }
}

export default useOrderCard;