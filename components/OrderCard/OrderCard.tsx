import { Fragment } from 'react'
import s from './OrderCard.module.scss'
import { Order } from '@/dtos/Order.dto'
import useOrderCard from '@/hooks/useOrderCard'
import { useOrderDelay } from '@/hooks/useOrderDealy'
import { 
    ChevronRight,
    Ellipsis,
    X as CloseIcon
} from 'lucide-react';

interface OrderCardProps {
    order: Order
}

const OrderCard = ({order}:OrderCardProps) => {

    const { 
        canAdvanceState, 
        getNextState, 
        isLoading, 
        actionView, setActionView,
        priorityView,
        error,
        valueRef,
        codeView,
        cancelOrder,
        stateChangeButton,
        closeButtonOption
    } = useOrderCard()

    const delayInfo =  useOrderDelay(order);

    return <div className={`${s['pk-order-card']} ${priorityView ? s['priority'] : s[delayInfo.delayLevel]}`}>
        <div className={s['pk-order-card__header']}>
            <div className={s['pk-order-card__header-info']}>
                <h2># {order.id}</h2>
                <h4>{order.name || 'usuario'}</h4>
            </div>
            <div className={s['pk-order-card__header-status']}>
                <span>items: <b>{order.items.length}</b></span>
                { order.date && <span>{new Date(order.date).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}</span>}
            </div>
            
        </div>
        <div className={s['pk-order-card__body']}>
            {order.items.map((item, index) => (

                /*POSIBLE MEJORA: Agregar funcionalidad y utilizar a nivel de negocio la seleccion de items */

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
            {/* State Change Button */}
            <button 
                className={`${s['pk-order-card__btn-state']} ${error ? s['pk-order-card__btn-state--error'] : codeView ? s['pk-order-card__btn-state--code'] : ''}`}
                disabled={!canAdvanceState(order)}
                onClick={async() => await stateChangeButton(order)}
            >
                {!isLoading && <>
                    {(getNextState(order.state) || 'Completado')}
                    <ChevronRight />
                </>}
                {isLoading && '...'}
            </button>
            {/* Options Button */}
            {!codeView && <button 
                className={s['pk-order-card__btn-option']}
                onClick={() => setActionView(!actionView)}
            >
                <Ellipsis />
            </button>}
            {codeView && <button 
                className={s['pk-order-card__btn-option-close']}
                onClick={() => closeButtonOption()}
            >
                <CloseIcon />
            </button>}
        </div>

        {/* Admin Actions */}
        <div className={`${s['pk-order-card__admin-actions']} ${actionView ? s['pk-order-card__admin-actions--open'] : ''}`}>

            {/* POSIBLE MEJOR: Funcionalidad de agregar nuevos botones segun la necesidad de cada estado  */}
            
            <button className={s['pk-order-card__admin-actions__prioritize']} disabled>Desactivado</button>
            <button
                className={s['pk-order-card__admin-actions__cancel']}
                onClick={()=>cancelOrder(order)}
            >Cancelar</button>
        </div>

        {/* Delivery Code Input */}
        {order.state == 'READY' && <div className={`${s['pk-order-card__delivery-code']} ${codeView ? s['pk-order-card__delivery-code--open'] : ''}`}>
            <label htmlFor="delivery-code">
                Código de delivery:
                <input ref={valueRef} id="delivery-code" type="number"  min={0} max={9999} />
            </label>
            {!error && <small className={s['pk-order-card__delivery-code__hint']}>Ingresa el código proporcionado al repartidor</small>}
            {error && <div className={s['pk-order-card__delivery-code__error']}>Código inválido. Intenta de nuevo.</div>}
        </div>}
    </div>
}

export default OrderCard