export const processArrayInChunks = async <T, R>(
  array: T[],
  processor: (item: T, index: number) => R,
  chunkSize = 100
): Promise<R[]> => {
  const result: R[] = [];
  
  for (let i = 0; i < array.length; i += chunkSize) {
    const chunk = array.slice(i, i + chunkSize);
    
    const chunkResult = await new Promise<R[]>((resolve) => {
      const processChunk = () => {
        const processed = chunk.map((item, chunkIndex) => 
          processor(item, i + chunkIndex)
        );
        resolve(processed);
      };
      
      if (window.requestIdleCallback) {
        window.requestIdleCallback(() => processChunk(), { timeout: 5 });
      } else {
        setTimeout(processChunk, 0);
      }
    });
    
    result.push(...chunkResult);
  }
  
  return result;
};

export const filterArrayInChunks = async <T>(
  array: T[],
  predicate: (item: T, index: number) => boolean,
  chunkSize = 200
): Promise<T[]> => {
  const result: T[] = [];
  
  for (let i = 0; i < array.length; i += chunkSize) {
    const chunk = array.slice(i, i + chunkSize);
    
    const filteredChunk = await new Promise<T[]>((resolve) => {
      const filterChunk = () => {
        const filtered = chunk.filter((item, chunkIndex) => 
          predicate(item, i + chunkIndex)
        );
        resolve(filtered);
      };
      
      if (window.requestIdleCallback) {
        window.requestIdleCallback(() => filterChunk(), { timeout: 5 });
      } else {
        setTimeout(filterChunk, 0);
      }
    });
    
    result.push(...filteredChunk);
  }
  
  return result;
};
