import React from 'react';

interface PixelTreeProps {
  className?: string;
  scale?: number;
}

const PixelTree: React.FC<PixelTreeProps> = ({ className = "", scale = 1 }) => {
  // Pixel Art Definition for "Sprout Phase 1"
  // Each character represents a color. '.' is transparent.
  const pixelMap = [
    "........................",
    "........................",
    "..........LLLL..........", // Top tips of leaves
    "........LLAGALL.........", // A: Light Green, G: Base Green
    ".......LAGGGGALL........",
    "......LAGGGGGGGAL.......",
    "......LAGGGGGGGAL.......",
    ".......LAGGGGGAL........",
    "........LAGGGAL.........",
    "..........LSL...........", // Stem starts connecting
    "...........S............",
    "...........S............",
    "...........S............",
    "...........S............",
    ".........DDDDD..........", // Dirt mound starts
    ".......DDDDDDDDD........",
    "......DDDDDDDDDDD.......",
    ".....DDDDDDDDDDDDD......",
    "....DDDDDDDDDDDDDDD.....",
    "........................",
  ];

  // Color Palette
  const colors: Record<string, string> = {
    'L': '#1a4910', // Dark Outline Green (Leaves)
    'A': '#86efac', // Accent Light Green
    'G': '#4ade80', // Base Green
    'S': '#22c55e', // Stem Green
    'D': '#78350f', // Dirt Brown
  };

  const pixelSize = 10;
  const width = pixelMap[0].length * pixelSize;
  const height = pixelMap.length * pixelSize;

  // Separate static (dirt) and animated (plant) parts
  const staticRects: React.ReactElement[] = [];
  const animatedRects: React.ReactElement[] = [];

  pixelMap.forEach((row, rowIndex) => {
    row.split('').forEach((char, colIndex) => {
      if (char === '.') return;
      
      const color = colors[char];
      const rect = (
        <rect
          key={`${rowIndex}-${colIndex}`}
          x={colIndex * pixelSize}
          y={rowIndex * pixelSize}
          width={pixelSize}
          height={pixelSize}
          fill={color}
        />
      );

      // Heuristic: Dirt rows are at the bottom (index > 13)
      if (rowIndex >= 14) {
        staticRects.push(rect);
      } else {
        animatedRects.push(rect);
      }
    });
  });

  return (
    <div 
      className={`select-none ${className}`}
      style={{ 
        transform: `scale(${scale})`,
        transformOrigin: 'center bottom'
      }}
    >
      <svg 
        width={width} 
        height={height} 
        viewBox={`0 0 ${width} ${height}`}
        shapeRendering="crispEdges" // CRITICAL for pixel art look
        style={{ overflow: 'visible' }}
      >
        {/* Static Base (Dirt) */}
        <g>
          {staticRects}
        </g>

        {/* Animated Plant (Swaying) */}
        {/* Transform origin is set to the base of the stem (approx row 14, col 12) */}
        <g 
          className="animate-wind-sway origin-bottom"
          style={{ transformBox: 'fill-box', transformOrigin: '50% 100%' }}
        >
          {animatedRects}
        </g>
      </svg>
    </div>
  );
};

export default PixelTree;