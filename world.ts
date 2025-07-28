// world.ts

/**
 * A unique identifier for an entity. Essentially just a number.
 */
export type Entity = number;

/**
 * Defines the shape of a system function, which takes a World instance as an argument.
 */
export type System = (world: World) => void;

/**
 * Defines the type for a component class constructor.
 */
export type ComponentClass<T> = new (...args: any[]) => T;


/**
 * A simple class for emitting and subscribing to events.
 */
class EventEmitter {
  private listeners: { [event: string]: Function[] } = {};

  /**
   * Subscribes to an event.
   * @param event The name of the event.
   * @param callback The callback function.
   * @returns A function to unsubscribe.
   */
  on(event: string, callback: Function): () => void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
    return () => {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    };
  }

  /**
   * Emits an event.
   * @param event The name of the event.
   * @param args Arguments to pass to the callback functions.
   */
  emit(event: string, ...args: any[]) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(...args));
    }
  }
}


/**
 * The World class manages the entire ECS.
 * It holds all entities, components, and systems.
 */
export class World {
  public readonly events = new EventEmitter();

  private entities = new Map<Entity, Map<Function, object>>();
  private systems: System[] = [];
  private nextEntityId: Entity = 0;

  /**
   * Creates a new entity and returns its unique ID.
   * @returns The created entity's ID.
   */
  createEntity(): Entity {
    const entity = this.nextEntityId++;
    this.entities.set(entity, new Map());
    this.events.emit('entityCreated', entity);
    return entity;
  }

  /**
   * Destroys an entity and all its associated components.
   * @param entity The ID of the entity to destroy.
   */
  destroyEntity(entity: Entity): void {
    if (this.entities.has(entity)) {
      this.entities.delete(entity);
      this.events.emit('entityDestroyed', entity);
    }
  }

  /**
   * Adds a component instance to an entity.
   * @param entity The ID of the target entity.
   * @param component The component instance to add.
   */
  addComponent<T extends object>(entity: Entity, component: T): void {
    const componentMap = this.entities.get(entity);
    if (componentMap) {
      const componentClass = component.constructor;
      componentMap.set(componentClass, component);
      this.events.emit('componentAdded', entity, component);
    }
  }

  /**
   * Removes a component from an entity by its class.
   * @param entity The ID of the target entity.
   * @param componentClass The class of the component to remove.
   */
  removeComponent<T>(entity: Entity, componentClass: ComponentClass<T>): void {
    const componentMap = this.entities.get(entity);
    if (componentMap?.has(componentClass)) {
      const component = componentMap.get(componentClass);
      componentMap.delete(componentClass);
      this.events.emit('componentRemoved', entity, component);
    }
  }

  /**
   * Checks if an entity has a specific component.
   * @param entity The ID of the target entity.
   * @param componentClass The class of the component to check for.
   * @returns True if the entity has the component.
   */
  hasComponent<T>(entity: Entity, componentClass: ComponentClass<T>): boolean {
    return this.entities.get(entity)?.has(componentClass) ?? false;
  }

  /**
   * Retrieves a specific component instance from an entity.
   * @param entity The ID of the target entity.
   * @param componentClass The class of the component to retrieve.
   * @returns The component instance, or undefined if not found.
   */
  getComponent<T>(entity: Entity, componentClass: ComponentClass<T>): T | undefined {
    return this.entities.get(entity)?.get(componentClass) as T | undefined;
  }

  /**
   * Finds all entities that possess a given set of component classes (a query).
   * @param componentClasses An array of component classes to query for.
   * @returns An array of entity IDs that match the query.
   */
  query(componentClasses: ComponentClass<any>[]): Entity[] {
    const matchingEntities: Entity[] = [];
    for (const [entity, components] of this.entities.entries()) {
      if (componentClasses.every(cls => components.has(cls))) {
        matchingEntities.push(entity);
      }
    }
    return matchingEntities;
  }

  /**
   * Registers a system with the World.
   * @param system The system function to register.
   */
  addSystem(system: System): void {
    this.systems.push(system);
  }

  /**
   * Executes all registered systems in order.
   * Calling this every frame updates the state of the World.
   */
  run(): void {
    for (const system of this.systems) {
      system(this);
    }
  }
}
