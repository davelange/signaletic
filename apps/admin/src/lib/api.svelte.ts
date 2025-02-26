// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Fn = (...args: any) => Promise<any>;
type Options<T extends Fn> = {
  fn: T;
  onSuccess?: (data: Awaited<ReturnType<T>>) => void;
};

class Mutation<T extends Fn> {
  state = $state<'idle' | 'pending' | 'error'>('idle');
  error = $state<unknown>();
  data: Awaited<ReturnType<T>> | undefined = $state();
  options: Options<T>;

  constructor(options: Options<T>) {
    this.options = options;
  }

  async mutate(...args: Parameters<T>) {
    this.state = 'pending';

    try {
      const data = await this.options.fn(...args);
      this.state = 'idle';
      this.options.onSuccess?.(data);
    } catch (err) {
      this.state = 'error';
      this.error = err;
    }
  }

  isPending = $derived(this.state === 'pending');
  isError = $derived(this.state === 'error');
}

export function useMutation<T extends Fn>(options: Options<T>) {
  return new Mutation(options);
}
