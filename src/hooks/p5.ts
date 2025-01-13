'use client';

import { useRef, useEffect } from 'react';
import p5 from 'p5';

const useP5 = (sketch: (p: p5) => void) => {
  const p5ref = useRef<HTMLDivElement| null>(null);

  useEffect(() => {
    let instance: p5 | undefined;
    if (p5ref.current) {
      instance = new p5(sketch, p5ref.current);
    }
    return () => {
      console.log("cleaning up...");
      
      // comment this out to get 2 canvases and 2 draw() loops
      instance?.remove();
    };
  }, [sketch]);

  return p5ref;
};

export default useP5;