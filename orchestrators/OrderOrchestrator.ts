import { Order } from "@/dtos/Order.dto"
import { EventEmitter } from "events"
import { getRandomId, getRandomInterval } from "@/helpers/utilities"

export class OrderOrchestrator {
	private interval: NodeJS.Timeout | undefined
	private maxOrders: number = getRandomInterval(10, 30)
	private eventEmitter = new EventEmitter()

	private emit(order: Order) {
		this.eventEmitter.emit("order", order)
	}

	public run() {
		this.interval = setInterval(() => {
			this.emit({
				id: getRandomId(),
				state: "PENDING",
				items: [
					{
						id: getRandomId(),
						name: "Hamburguesa",
						image: "https://example.com/burger.png",
						price: {
							currency: "USD",
							amount: 5.99,
						},
						quantity: 2,
					},
					{
						id: getRandomId(),
						name: "Papas Fritas",
						image: "https://example.com/fries.png",
						price: {
							currency: "USD",
							amount: 2.99,
						},
						note: "Sin sal",
						quantity: 1,
					},
				],
				name: 'usuario',
				date: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
			})
			this.maxOrders--
			if (this.maxOrders <= 0) {
				clearInterval(this.interval)
			}
		}, 2000)
		return this.eventEmitter
	}
}
