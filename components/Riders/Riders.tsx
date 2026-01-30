import s from "./Riders.module.scss"
import Rider from "@/bases/Rider/Rider"
import { useRiders } from "@/contexts/Riders.context"

export default function Riders() {
	const { riders } = useRiders()
	return (
		<section className={s["pk-riders__container"]}>
			<div className={s["pk-riders"]}>
				<div className={s["pk-riders__title"]}>
					<h3>Repartidores:</h3>
					<span>{riders.length}</span>
				</div>
				<div className={s["pk-riders__list"]}>
					{riders.map((rider,index) => (
						<Rider key={index} {...rider} />
					))}
				</div>
			</div>
		</section>
	)
}
