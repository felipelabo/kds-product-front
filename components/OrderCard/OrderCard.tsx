import { Fragment } from 'react'
import s from './OrderCard.module.scss'
import { Order } from '@/dtos/Order.dto'
import useOrderCard from '@/hooks/useOrderCard'

interface OrderCardProps {
    order: Order
}

const OrderCard = ({order}:OrderCardProps) => {

    const { handleChangeState, canAdvanceState, getNextState, isLoading, error } = useOrderCard()

    

    return <div className={s['pk-order-card']}>
        <div className={s['pk-order-card__header']}>
            <div className={s['pk-order-card__header-info']}>
                <h2># {order.id}</h2>
                <h4>{order.name || 'usuario'}</h4>
            </div>
            <div className={s['pk-order-card__header-status']}>
                <span>{order.date || ''}</span>
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
            <button className={s['pk-order-card__btn-option']}>. . .</button>
        </div>
    </div>
}

export default OrderCard