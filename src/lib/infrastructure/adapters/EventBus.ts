import type {
	IEventBus,
	DomainEvent,
	EventHandler,
	UnsubscribeFn
} from '../../application/ports/IEventBus.js';

/**
 * 事件总线实现
 * 提供事件发布/订阅功能
 */
export class EventBus implements IEventBus {
	private handlers: Map<string, Set<EventHandler>> = new Map();

	async publish<T extends DomainEvent>(event: T): Promise<void> {
		const handlers = this.handlers.get(event.type);
		if (!handlers) return;

		const promises = Array.from(handlers).map((handler) => {
			try {
				return Promise.resolve(handler(event));
			} catch (error) {
				console.error(`Error in event handler for ${event.type}:`, error);
				return Promise.resolve();
			}
		});

		await Promise.all(promises);
	}

	subscribe<T extends DomainEvent>(eventType: string, handler: EventHandler<T>): UnsubscribeFn {
		if (!this.handlers.has(eventType)) {
			this.handlers.set(eventType, new Set());
		}

		const handlers = this.handlers.get(eventType)!;
		handlers.add(handler as EventHandler);

		return () => {
			handlers.delete(handler as EventHandler);
			if (handlers.size === 0) {
				this.handlers.delete(eventType);
			}
		};
	}

	once<T extends DomainEvent>(eventType: string, handler: EventHandler<T>): UnsubscribeFn {
		const wrappedHandler: EventHandler = async (event) => {
			unsubscribe();
			await handler(event as T);
		};

		const unsubscribe = this.subscribe(eventType, wrappedHandler);
		return unsubscribe;
	}

	clear(): void {
		this.handlers.clear();
	}

	/**
	 * 获取特定事件类型的处理器数量
	 */
	getHandlerCount(eventType: string): number {
		const handlers = this.handlers.get(eventType);
		return handlers ? handlers.size : 0;
	}

	/**
	 * 获取所有事件类型
	 */
	getEventTypes(): string[] {
		return Array.from(this.handlers.keys());
	}
}
