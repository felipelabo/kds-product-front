import {
	ReactNode,
	createContext,
	useContext,
	useEffect,
	useState,
} from "react"
import { useOrders } from "@/contexts/Orders.context"
import { getRandomInterval } from "@/helpers/utilities"
import { Rider } from "@/dtos/Rider.dto"

export type RidersContextProps = {
	riders: Array<Rider>
}

export const RidersContext = createContext<RidersContextProps>(
	// @ts-ignore
	{},
)

export type RidersProviderProps = {
	children: ReactNode
}

export function RidersProvider(props: RidersProviderProps) {
	const [riders, setRiders] = useState<Array<Rider>>([])
	const [assignedOrders, setAssignedOrders] = useState<string[]>([])
	const { orders, pickup } = useOrders()

	useEffect(() => {
		const order = orders.find((order) => !assignedOrders.includes(order.id))
		if (order) {
			const newRider: Rider = {
				orderWanted: order.id,
				pickup: () => pickup(order),
			}
			setAssignedOrders((prev) => [...prev, order.id])
			setTimeout(
				() => {
					setRiders((prev) => [...prev,newRider])
				},
				getRandomInterval(4_000, 10_000),
			)
		}
	}, [orders])

	const context = { riders }
	return (
		<RidersContext.Provider value={context}>
			{props.children}
		</RidersContext.Provider>
	)
}

export const useRiders = () => useContext(RidersContext)
