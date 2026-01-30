import { Item } from "@/dtos/Item.dto"

export type Order = {
	id: string
	state: "PENDING" | "IN_PROGRESS" | "READY" | "DELIVERED" | "CANCELLED"
	items: Array<Item>
	name?: string
	date: string
}
