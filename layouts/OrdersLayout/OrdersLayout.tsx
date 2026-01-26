import Logo from "@/bases/Logo/Logo"
import s from "./OrdersLayout.module.scss"
import Riders from "@/components/Riders/Riders"
import Kanban from "@/components/Kanban/Kanban"

export default function OrdersLayout() {
	return (
		<main className={s["pk-layout"]}>
		<nav className={s["pk-layout__navbar"]}>
			<Logo size="S" />
			<strong>KDS: Krazy Display Service</strong>
		</nav>
			<article className={s["pk-layout__app"]}>
				<Kanban />
				<Riders />
			</article>
		</main>
	)
}
