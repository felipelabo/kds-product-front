import {
	ReactNode,
	createContext,
	useContext,
	useEffect,
	useState,
	useMemo,
	useCallback,
	use,
} from "react"
import { useOrders } from "@/contexts/Orders.context"
import { getRandomInterval } from "@/helpers/utilities"
import { Rider } from "@/dtos/Rider.dto"
import { RiderService } from "@/services/RiderService"

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
	//const [assignedOrders, setAssignedOrders] = useState<string[]>([])
	//const { orders, pickup } = useOrders()

	const riderService = useMemo(() => new RiderService(), [])

	const getRiders = useCallback(async () => {
		try {
			const fetchedRiders = await riderService.getRiders()
			setRiders(fetchedRiders)
		} catch (error) {
			console.error("Polling getRiders failed:", error)
		}
	}, [riderService])

	useEffect(() => {
		// Primera carga inmediata
		getRiders()
		// Polling cada 15s
		const polling = setInterval(() => {
			console.log("Polling riders...")
			getRiders()
		}, 6_000)

		return () => clearInterval(polling)
	}, [getRiders])

	const context = { riders }
	return (
		<RidersContext.Provider value={context}>
			{props.children}
		</RidersContext.Provider>
	)
}

export const useRiders = () => useContext(RidersContext)
