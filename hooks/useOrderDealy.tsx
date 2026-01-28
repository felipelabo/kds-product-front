import { Order } from '@/dtos/Order.dto';

export function useOrderDelay(order: Order) {
    const now = Date.now();
    const createdAt = new Date(order.date).getTime();
    const minutes = (now - createdAt) / 60000;

    let delayLevel: 'normal' | 'warning' | 'danger' = 'normal';

    const delayWarningThreshold = Number(process.env.NEXT_PUBLIC_WARNING_DELAY);
    const delayDangerThreshold = Number(process.env.NEXT_PUBLIC_DANGER_DELAY);

    if (minutes >= delayDangerThreshold) delayLevel = 'danger';
    else if (minutes >= delayWarningThreshold) delayLevel = 'warning';

    return { delayLevel };
}
