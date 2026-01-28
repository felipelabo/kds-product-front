import { useCallback, useMemo, useState } from 'react';
import { Order } from "@/dtos/Order.dto";
import { OrderService } from "@/services/OrderService";
import { useOrders } from '@/contexts/Orders.context';

type nextStateType = 'Preparar' | 'Terminar' | 'Entregar' 

const useOrderCard = () => {

    // Instancia única del servicio
    const orderService = useMemo(() => new OrderService(), [])
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const [actionView, setActionView] = useState<boolean>(false);
    const [priorityView, setPriorityView] = useState<boolean>(false);
    
    // TODO: Conectar con el contexto cuando esté disponible
    const { updateOrder } = useOrders()

    const handleChangeState = useCallback(async(order: Order) => {
        setIsLoading(true);
        try {
            let updatedOrder: Order;
            
            switch(order.state) {
                case 'PENDING':
                    updatedOrder = await orderService.moveToInProgress(order);
                    break;
                case 'IN_PROGRESS':
                    updatedOrder = await orderService.moveToReady(order);
                    break;
                case 'READY':
                    // TODO: Implementar lógica de entrega
                    updatedOrder = await orderService.moveToDelivered(order);
                    break;
                default:
                    updatedOrder = order;
            }
            
            updateOrder(updatedOrder)
            console.log(`Order ${order.id} moved from ${order.state} to ${updatedOrder.state}`);
            setIsLoading(false);
            if(error) setError(false)
            return updatedOrder;
        } catch (error) {
            console.error("Error changing order state:", error);
            setIsLoading(false);
            setError(true);
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
        getNextState,
        isLoading,
        error,
        actionView,
        setActionView,
        priorityView, 
        setPriorityView
    }
}

export default useOrderCard;