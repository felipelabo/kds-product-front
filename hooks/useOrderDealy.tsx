import { Order } from '@/dtos/Order.dto';

/**
 * HOOK ESTADO DELAY DE LA ORDEN
 * 
 * Este hook calcula el nivel de retraso de una orden 
 * en función del tiempo transcurrido desde su creación.
 * 
 * 
 * Niveles de retraso:
 * - 'normal': La orden está dentro del tiempo esperado.
 * - 'warning': La orden ha superado el umbral de advertencia.
 * - 'danger': La orden ha superado el umbral de peligro.
 * 
 * Umbrales configurables mediante variables de entorno:
 * - NEXT_PUBLIC_WARNING_DELAY: Umbral de advertencia en minutos.
 * - NEXT_PUBLIC_DANGER_DELAY: Umbral de peligro en minutos.
 * 
 * Si alguna de estas variables es 0 o no está definida, 
 * ese nivel de retraso no se aplica.
 * 
 * @param order - La orden a evaluar.
 * @returns Un objeto con la propiedad delayLevel que indica el nivel de retraso.
 * 
 */

export function useOrderDelay(order: Order) {
    const now = Date.now();
    const createdAt = new Date(order.date).getTime();
    const minutes = (now - createdAt) / 60000;

    let delayLevel: 'normal' | 'warning' | 'danger' = 'normal';

    const delayWarningThreshold = Number(process.env.NEXT_PUBLIC_WARNING_DELAY);
    const delayDangerThreshold = Number(process.env.NEXT_PUBLIC_DANGER_DELAY);

    // Verificar danger primero (si no es 0)
    if (!isNaN(delayDangerThreshold) && delayDangerThreshold > 0 && minutes >= delayDangerThreshold) {
        delayLevel = 'danger';
    }
    // Verificar warning solo si no se cumplió danger y warning no es 0
    else if (!isNaN(delayWarningThreshold) && delayWarningThreshold > 0 && minutes >= delayWarningThreshold) {
        delayLevel = 'warning';
    }

    return { delayLevel };
}
