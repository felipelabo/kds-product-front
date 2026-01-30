import { Order } from "@/dtos/Order.dto"

export type Rider = {
	id: string
	orderWanted: string
	pickup: (order?: Order) => void
	code: string
}
