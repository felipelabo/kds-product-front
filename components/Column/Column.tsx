import s from "./Column.module.scss"
import { Order } from "@/dtos/Order.dto"
import OrderCard from "../OrderCard/OrderCard"

export type ColumnProps = {
	orders: Array<Order>
	title: string
	onClick?: (order: Order) => void
}

export default function Column(props: ColumnProps) {
	return (
		<div className={s["pk-column"]}>
			<div className={s["pk-column__title"]}>
				<h3>{props.title}</h3><span>{props.orders.length}</span>
			</div>
			<div className={s["pk-column__body"]}>
				{props.orders.map((order) => (
					<OrderCard key={order.id} order={order} />
				))}
			</div>
		</div>
	)
}
