import { useCallback, useMemo, useState, useRef } from 'react';
import { Order } from "@/dtos/Order.dto";
import { OrderService } from "@/services/OrderService";
import { useOrders } from '@/contexts/Orders.context';
import { useRiders } from '@/contexts/Riders.context';

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

    const {riders} = useRiders();
    
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

    const verifyCode = useCallback(async (order: Order) => {
        if (!valueRef.current) {
            console.error("Input ref not found");
            return;
        }
        
        const enteredCode = valueRef.current.value;
        if (!enteredCode) console.error("No code entered");

        const rider = riders.find(rider => rider.code === enteredCode && rider.orderWanted === order.id);
        if (rider) {
            console.log("Valid delivery code:", enteredCode);
            setError(false);
            handleChangeState(order);
            valueRef.current.value = '';
        } else {
            console.error("Invalid delivery code:", enteredCode);
            setError(true);
        }

        /*setIsLoading(true);
        try {
            // Buscar rider con el código ingresado
            const rider = riders.find(rider => rider.code === enteredCode);
            
            if (rider) {
                // Código válido, proceder con la entrega
                const updatedOrder = await orderService.moveToDelivered(order);
                updateOrder(updatedOrder);
                console.log(`Order ${order.id} delivered to rider with code ${enteredCode}`);
                
                // Limpiar el input
                valueRef.current.value = '';
                setIsLoading(false);
                if(error) setError(false);
                return updatedOrder;
            } else {
                // Código inválido
                console.error("Invalid delivery code:", enteredCode);
                setError(true);
                setIsLoading(false);
                return order;
            }
        } catch (error) {
            console.error("Error verifying delivery code:", error);
            setIsLoading(false);
            setError(true);
            return order;
        }*/
    }, [orderService, riders, updateOrder, error]);

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
        setError,
        actionView,
        setActionView,
        priorityView, 
        setPriorityView,
        valueRef,
        codeView, setCodeView,
        verifyCode
    }
}

export default useOrderCard;