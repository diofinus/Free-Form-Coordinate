'use client';

import { useState, useEffect, StrictMode, useCallback } from 'react';
import p5 from 'p5';

import useP5 from '@/hooks/p5';
import ExampleImage from '@/assets/images/example.jpg';

const coordinates = [
  { x: 30, y: 20 },
  { x: 85, y: 20 },
  { x: 85, y: 75 },
  { x: 30, y: 75 }
];

export default function Home() {
  const [pointArr, setPointArr] = useState<Array<{ x: number; y: number }>>(coordinates);
  const [pointArrPrint, setPointArrPrint] = useState<Array<{ x: number; y: number }>>([]);

  const printCoordinate = (
    points: Array<{ x: number; y: number }>,
    x: number,
    y: number,
    dragIdx: number
  ) => {
    console.log(points);
    const currentDragPoint = [...points];
    currentDragPoint[dragIdx] = {
      x,
      y
    };
    setPointArrPrint(currentDragPoint);
  };

  const sketch = useCallback(
    (p: p5) => {
      const points: Array<p5.Vector> = [];
      const dragRadius = 10;
      let dragPoint: p5.Vector | null = null;
      let dragIdx: number = -1;
      let p5Img: p5.Image;

      p.preload = () => {
        p5Img = p.loadImage(ExampleImage.src);
      };

      p.setup = () => {
        p.frameRate(60);
        p.createCanvas(ExampleImage.width, ExampleImage.height);
        pointArr.forEach((coord) => {
          points.push(p.createVector(coord.x, coord.y));
        });
      };

      p.draw = () => {
        if (!p5Img) return;
        p.image(p5Img, 0, 0);
        p.noFill();

        // Start drawing the shape.
        p.beginShape();

        // Add vertices.
        points.forEach((point) => {
          p.vertex(point.x, point.y);
        });

        p.fill(242, 196, 184, 80);

        // Stop drawing the shape.
        // Connect the first and last vertices.
        p.endShape(p.CLOSE);

        p.fill(255, 255, 186);
        // Add point to the shape.
        points.forEach((point) => {
          p.circle(point.x, point.y, dragRadius);
        });
        p.fill(0, 0, 0, 0);
      };

      p.mousePressed = () => {
        for (let i = 0; i < points.length; i++) {
          const isPressed = mouseInCircle(points[i], dragRadius);
          if (isPressed) {
            dragPoint = points[i];
            dragIdx = i;
            return;
          }
        }
      };

      p.mouseDragged = () => {
        if (dragPoint) {
          dragPoint.x = p.mouseX;
          dragPoint.y = p.mouseY;
          printCoordinate(points, p.mouseX, p.mouseY, dragIdx);
        }
      };

      p.mouseReleased = () => {
        dragPoint = null;
        setPointArrPrint(points);
      };

      p.doubleClicked = () => {
        for (let i = 0; i < points.length; i++) {
          const isPressed = mouseInCircle(points[i], dragRadius);
          if (isPressed) {
            points.splice(i, 1);
            setPointArrPrint(points);
            return;
          }
        }
      };

      const mouseInCircle = (pos: p5.Vector, radius: number) => {
        return p.dist(p.mouseX, p.mouseY, pos.x, pos.y) < radius;
      };
    },
    [pointArr]
  );

  ////// Force a second render //////
  const [, setTest] = useState<string>('');
  useEffect(() => {
    setTest('force a second render');
  }, []);
  ///////////////////////////////////
  console.log('rendered');

  const p5Ref = useP5(sketch);

  return (
    <StrictMode>
      <div ref={p5Ref}></div>
      <div className="mt-4 flex flex-row items-start gap-2">
        <div
          className="m-4 h-fit w-fit cursor-pointer rounded-xl border border-solid border-slate-700 bg-slate-800 px-4 py-2 text-white transition-colors hover:bg-slate-600 active:bg-slate-500"
          onClick={() => {
            setPointArr([...pointArr, { x: 50, y: 50 }]);
            setPointArrPrint([...pointArr, { x: 50, y: 50 }]);
          }}>
          Add more coordinate
        </div>
        <div className="flex flex-col items-start">
          {pointArrPrint.map((pointPrint, i) => (
            <div key={`point-${i}`}>{`x: ${pointPrint.x} | y: ${pointPrint.y}`}</div>
          ))}
        </div>
      </div>
    </StrictMode>
  );
}
