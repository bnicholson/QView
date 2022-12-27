interface CancelablePromise<T> {
  promise: Promise<T>;
  cancel(): void;
}

/**
 * Take a promise which may need to be canceled, and return the promise and a way to cancel it. This
 * will be useful when a state update is in a promise and the component it updates could be
 * unmounted before the state update executes. To avoid updating the state after a component
 * unmounts, call the returned `.cancel()` function.
 * ```
 *   const somePromise = new Promise(r => setTimeout(r, 1000));
 *   
 *   const cancelable = makeCancelable(somePromise);
 *   
 *   cancelable
 *     .promise
 *     .then(() => console.log('resolved'))
 *     .catch(({isCanceled, ...error}) => console.log('isCanceled', isCanceled));
 *   
 *   // Cancel promise
 *   cancelable.cancel();
 * ```
 * 
 * The original version of this function was recommended by the React team and was created by istarkov:
 * https://github.com/facebook/react/issues/5465#issuecomment-157888325.
 * @param promise The `Promise` to make cancelable
 * @returns An object containing the promise and a cancel function
 */
export const makeCancelable = <T = any,>(promise: Promise<T>): CancelablePromise<T> => {
  let hasCanceled_ = false;

  const wrappedPromise: Promise<T> = new Promise((resolve, reject) => {
    promise.then((val) =>
      hasCanceled_ ? reject({isCanceled: true}) : resolve(val)
    );
    promise.catch((error) =>
      hasCanceled_ ? reject({isCanceled: true}) : reject(error)
    );
  });

  return {
    promise: wrappedPromise,
    cancel() {
      hasCanceled_ = true;
    },
  };
};
