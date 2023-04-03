export class SuccessResponseClass<T> {
  message: string;
  data: Partial<T>;
  status: number;
  constructor(Object: Partial<T>) {
    this.message = 'success';
    this.data = Object;
    this.status = 200;
  }
}

export function SuccessResponse(target: FunctionConstructor) {
  return class extends target {
    constructor(...args: any[]) {
      super(...args);
      this['data'] = new SuccessResponseClass(this);
      this['status'] = 200;
    }
  };
}
