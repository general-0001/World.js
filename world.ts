// world.ts

/**
 * エンティティを一意に識別するための型。実体は単なる数値。
 */
export type Entity = number;

/**
 * システム関数の型定義。Worldインスタンスを引数に取る。
 */
export type System = (world: World) => void;

/**
 * コンポーネントクラスの型定義。
 */
export type ComponentClass<T> = new (...args: any[]) => T;


/**
 * シンプルなイベント発行・購読のためのクラス。
 */
class EventEmitter {
  private listeners: { [event: string]: Function[] } = {};

  /**
   * イベントを購読する。
   * @param event イベント名
   * @param callback コールバック関数
   * @returns 購読を解除するための関数
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
   * イベントを発行する。
   * @param event イベント名
   * @param args コールバック関数に渡す引数
   */
  emit(event: string, ...args: any[]) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(...args));
    }
  }
}


/**
 * ECSの全体を管理するWorldクラス。
 * すべてのエンティティ、コンポーネント、システムを保持する。
 */
export class World {
  public readonly events = new EventEmitter();

  private entities = new Map<Entity, Map<Function, object>>();
  private systems: System[] = [];
  private nextEntityId: Entity = 0;

  /**
   * 新しいエンティティを作成し、一意のIDを返す。
   * @returns 作成されたエンティティのID
   */
  createEntity(): Entity {
    const entity = this.nextEntityId++;
    this.entities.set(entity, new Map());
    this.events.emit('entityCreated', entity);
    return entity;
  }

  /**
   * エンティティを破棄する。
   * @param entity 破棄するエンティティのID
   */
  destroyEntity(entity: Entity): void {
    if (this.entities.has(entity)) {
      this.entities.delete(entity);
      this.events.emit('entityDestroyed', entity);
    }
  }

  /**
   * エンティティにコンポーネントを追加する。
   * @param entity 対象のエンティティID
   * @param component 追加するコンポーネントのインスタンス
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
   * エンティティからコンポーネントを削除する。
   * @param entity 対象のエンティティID
   * @param componentClass 削除するコンポーネントのクラス
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
   * エンティティが特定のコンポーネントを持っているか確認する。
   * @param entity 対象のエンティティID
   * @param componentClass 確認するコンポーネントのクラス
   * @returns コンポーネントを持っていればtrue
   */
  hasComponent<T>(entity: Entity, componentClass: ComponentClass<T>): boolean {
    return this.entities.get(entity)?.has(componentClass) ?? false;
  }

  /**
   * エンティティから特定のコンポーネントを取得する。
   * @param entity 対象のエンティティID
   * @param componentClass 取得するコンポーネントのクラス
   * @returns コンポーネントのインスタンス、またはundefined
   */
  getComponent<T>(entity: Entity, componentClass: ComponentClass<T>): T | undefined {
    return this.entities.get(entity)?.get(componentClass) as T | undefined;
  }

  /**
   * 指定されたコンポーネントクラスをすべて持つエンティティを検索する（クエリ）。
   * @param componentClasses 検索条件となるコンポーネントクラスの配列
   * @returns 条件に合致するエンティティIDの配列
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
   * システムをWorldに登録する。
   * @param system 登録するシステム関数
   */
  addSystem(system: System): void {
    this.systems.push(system);
  }

  /**
   * 登録されたすべてのシステムを順に実行する。
   * これを毎フレーム呼び出すことで、Worldの状態が更新される。
   */
  run(): void {
    for (const system of this.systems) {
      system(this);
    }
  }
}
