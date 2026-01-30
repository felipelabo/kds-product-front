import { useCallback, useMemo, useState, useRef } from 'react';
import { Order } from "@/dtos/Order.dto";
import { OrderService } from "@/services/OrderService";
import { useOrders } from '@/contexts/Orders.context';
import { useRiders } from '@/contexts/Riders.context';
import { toast } from 'react-toastify';

type nextStateType = 'Preparar' | 'Terminar' | 'Entregar' 

const useOrderCard = () => {

    // Instancia única del servicio
    const orderService = useMemo(() => new OrderService(), [])
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const [actionView, setActionView] = useState<boolean>(false);
    const [priorityView, setPriorityView] = useState<boolean>(false);
    const valueRef = useRef<HTMLInputElement>(null);
    const [codeView, setCodeView] = useState<boolean>(false);
    
    // TODO: Conectar con el contexto cuando esté disponible
    const { updateOrder } = useOrders()

    // Maneja el cambio de estado de la orden
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

    // Verificar código de entrega y avanza al estado DELIVERED si es correcto
    const verifyCode = useCallback(async (order: Order) => {
        if (!valueRef.current) {
            console.error("Input ref not found");
            return;
        }
        
        const enteredCode = valueRef.current.value;
        if (!enteredCode) {
            console.error("No code entered");
            setError(true);
            return;
        }

        try{
            setError(false);
            const updatedOrder = await orderService.moveToDelivered(order, enteredCode);
            if(updatedOrder.state === 'DELIVERED'){
                updateOrder(updatedOrder);
                toast.success(`Orden ${order.id} entregada con éxito.`,{
                    hideProgressBar: true,
                    autoClose: 3000,
                    theme: "colored"
                });
            } else {
                console.error("Incorrect code entered.");
            }

        }catch(error){
            console.error("Error verifying code:", error);
            setError(true);
        }

    }, [orderService]);

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

    // Obtener el siguiente estado legible (Botón de acción)
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

    const cancelOrder = useCallback(async(order: Order) => {
        setIsLoading(true);
        try {
            const updatedOrder = await orderService.cancelOrder(order);
            updateOrder(updatedOrder)
            console.log(`Order ${order.id} cancelled.`);
            setIsLoading(false);
            if(error) setError(false)
            toast.success(`Orden ${order.id} cancelada.`,{
                hideProgressBar: true,
                autoClose: 3000,
                theme: "colored"
            });
            return updatedOrder;
        } catch (error) {
            console.error("Error cancelling order:", error);
            setIsLoading(false);
            setError(true);
            return order; // Retornar orden original en caso de error
        }
    }, [orderService])

    return {
        handleChangeState,
        canAdvanceState,
        orderService,
        getNextState,
        isLoading,
        error,
        setError,
        actionView,
        setActionView,
        priorityView, 
        setPriorityView,
        valueRef,
        codeView, setCodeView,
        verifyCode,
        cancelOrder
    }
}

export default useOrderCard;