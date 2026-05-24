export const runWithConcurrency = async <T>(
  tasks: Array<() => Promise<T>>,
  concurrency = 3
): Promise<Array<{ status: 'fulfilled'; value: T } | { status: 'rejected'; reason: unknown }>> => {
  const results: Array<Promise<{ status: 'fulfilled'; value: T } | { status: 'rejected'; reason: unknown }>> = [];
  const executing = new Set<Promise<{ status: 'fulfilled'; value: T } | { status: 'rejected'; reason: unknown }>>();
  
  for (let i = 0; i < tasks.length; i++) {
    const resultPromise = Promise.resolve().then(() => tasks[i]()).then(
      value => ({ status: 'fulfilled' as const, value }),
      reason => ({ status: 'rejected' as const, reason: reason as unknown })
    );
    
    results[i] = resultPromise;
    executing.add(resultPromise);
    
    const cleanup = () => executing.delete(resultPromise);
    resultPromise.then(cleanup, cleanup);
    
    if (executing.size >= concurrency) {
      await Promise.race(executing);
    }
  }
  
  return Promise.all(results);
};