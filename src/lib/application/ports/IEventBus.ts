/**
 * 事件总线端口接口
 * 用于发布和订阅领域事件
 */
export interface IEventBus {
	/**
	 * 发布事件
	 */
	publish<T extends DomainEvent>(event: T): Promise<void>;

	/**
	 * 订阅事件
	 */
	subscribe<T extends DomainEvent>(eventType: string, handler: EventHandler<T>): UnsubscribeFn;

	/**
	 * 订阅一次性事件
	 */
	once<T extends DomainEvent>(eventType: string, handler: EventHandler<T>): UnsubscribeFn;

	/**
	 * 清除所有订阅
	 */
	clear(): void;
}

/**
 * 领域事件基础接口
 */
export interface DomainEvent {
	type: string;
	payload: unknown;
	timestamp?: number;
	metadata?: Record<string, unknown>;
}

/**
 * 事件处理器类型
 */
export type EventHandler<T extends DomainEvent = DomainEvent> = (event: T) => void | Promise<void>;

/**
 * 取消订阅函数
 */
export type UnsubscribeFn = () => void;
