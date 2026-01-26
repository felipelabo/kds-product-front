import { Order } from "@/dtos/Order.dto"
import { OrderOrchestrator } from "@/orchestrators/OrderOrchestrator"
import {
	ReactNode,
	createContext,
	useContext,
	useEffect,
	useState,
} from "react"

export type OrdersContextProps = {
	orders: Array<Order>
	pickup: (order: Order) => void
	updateOrder: (order: Order) => void
}

export const OrdersContext = createContext<OrdersContextProps>(
	// @ts-ignore
	{},
)

export type OrdersProviderProps = {
	children: ReactNode
}

export function OrdersProvider(props: OrdersProviderProps) {
	const [orders, setOrders] = useState<Array<Order>>([])

	useEffect(() => {
		const orderOrchestrator = new OrderOrchestrator()
		const listener = orderOrchestrator.run()
		listener.on("order", (order) => {
			setOrders((prev) => [...prev, order])
		})
	}, [])

	const pickup = (order: Order) => {
		alert(
			"necesitamos eliminar del kanban a la orden recogida! Rapido! antes que nuestra gente de tienda se confunda!",
		)
	}

	const updateOrder = (updatedOrder: Order) => {
		setOrders((prevOrders) =>
			prevOrders.map((order) =>
				order.id === updatedOrder.id ? updatedOrder : order,
			),
		)
	}

	const context = {
		orders,
		pickup,
		updateOrder
	}

	return (
		<OrdersContext.Provider value={context}>
			{props.children}
		</OrdersContext.Provider>
	)
}

export const useOrders = () => useContext(OrdersContext)
