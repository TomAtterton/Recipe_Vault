type SuspensePromise<T> = Promise<T> & {
  status: 'pending' | 'fulfilled' | 'rejected';
  value?: T;
  reason?: any;
};

export function use<T>(promise: SuspensePromise<T> | Promise<T>): T {
  if (isReactUsePromise(promise)) {
    if (promise.status === 'fulfilled') {
      if (promise.value === undefined) {
        throw new Error('[use] Unexpected undefined value from promise');
      }
      return promise.value;
    } else if (promise.status === 'rejected') {
      throw promise.reason;
    } else if (promise.status === 'pending') {
      throw promise;
    }
    throw new Error('[use] Promise is in an invalid state');
  }

  const suspensePromise = promise as SuspensePromise<T>;
  suspensePromise.status = 'pending';
  suspensePromise.then(
    (result: T) => {
      suspensePromise.status = 'fulfilled';
      suspensePromise.value = result;
    },
    (reason: any) => {
      suspensePromise.status = 'rejected';
      suspensePromise.reason = reason;
    }
  );
  throw suspensePromise;
}

function isReactUsePromise(promise: any): promise is SuspensePromise<any> {
  return typeof promise === 'object' && promise !== null && 'status' in promise;
}
