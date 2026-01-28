import { Fragment } from 'react'
import s from './OrderCard.module.scss'
import { Order } from '@/dtos/Order.dto'
import useOrderCard from '@/hooks/useOrderCard'
import { useOrderDelay } from '@/hooks/useOrderDealy'

interface OrderCardProps {
    order: Order
}

const OrderCard = ({order}:OrderCardProps) => {

    const { 
        handleChangeState, 
        canAdvanceState, 
        getNextState, 
        isLoading, 
        actionView, setActionView,
        priorityView,
        error 
    } = useOrderCard()

    const delayInfo =  useOrderDelay(order);

    return <div className={`${s['pk-order-card']} ${priorityView ? s['priority'] : s[delayInfo.delayLevel]}`}>
        <div className={s['pk-order-card__header']}>
            <div className={s['pk-order-card__header-info']}>
                <h2># {order.id}</h2>
                <h4>{order.name || 'usuario'}</h4>
            </div>
            <div className={s['pk-order-card__header-status']}>
                { order.date && <span>{new Date(order.date).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>}
            </div>
            
        </div>
        <div className={s['pk-order-card__body']}>
            {order.items.map((item, index) => (
                <Fragment key={index}>
                {order.state !== 'IN_PROGRESS' ? <div key={index} className={s['pk-order-card__item']}>
                    <p>{item.quantity} x {item.name}</p>
                    {item.note && <small>{item.note}</small>}
                </div>
                :
                <label key={index} className={s['pk-order-card__item']}>
                    <p>{item.quantity} x {item.name}</p>
                    {item.note && <small>{item.note}</small>}
                    <input type="checkbox" id={item.id} value={item.id} hidden />
                </label>}
                </Fragment>
            ))}
        </div>
        <div className={s['pk-order-card__footer']}>
            <button 
                className={`${s['pk-order-card__btn-state']} ${error ? s['pk-order-card__btn-state--error'] : ''}`}
                disabled={!canAdvanceState(order)}
                onClick={async() => await handleChangeState(order)}
            >
                {!isLoading && (getNextState(order.state) || 'Completado')}
                {isLoading && '...'}
            </button>
            <button 
                className={s['pk-order-card__btn-option']}
                onClick={() => setActionView(!actionView)}
            >. . .</button>
        </div>
        <div className={`${s['pk-order-card__admin-actions']} ${actionView ? s['pk-order-card__admin-actions--open'] : ''}`}>
            <button
                className={s['pk-order-card__admin-actions__prioritize']}
            >Priorizar</button>
            <button
                className={s['pk-order-card__admin-actions__cancel']}
            >Cancelar</button>
        </div>
    </div>
}

export default OrderCard