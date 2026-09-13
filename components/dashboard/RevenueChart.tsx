'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { formatFCFA } from '@/lib/currency';
import { Invoice } from '@/lib/types';
import { listInvoices } from '@/lib/services/invoices';

interface RevenueChartProps {
  invoices?: Invoice[];
}

const MONTH_NAMES = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jui', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];

export default function RevenueChart({ invoices: initialInvoices }: RevenueChartProps) {
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices || []);
  const [hoveredPoint, setHoveredPoint] = useState<{ index: number; month: string; amount: number; x: number; y: number } | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (initialInvoices) {
      setInvoices(initialInvoices);
      return;
    }

    async function load() {
      const data = await listInvoices();
      setInvoices(data);
    }
    load();
  }, [initialInvoices]);

  // Aggregate monthly data for current year
  const currentYear = new Date().getFullYear();
  const monthlyTotals = new Array(12).fill(0);

  for (const inv of invoices) {
    if (inv.status !== 'draft' && inv.status !== 'cancelled') {
      const d = new Date(inv.date);
      if (d.getFullYear() === currentYear || isNaN(d.getFullYear())) {
        const monthIndex = isNaN(d.getMonth()) ? 0 : d.getMonth();
        monthlyTotals[monthIndex] += inv.total;
      }
    }
  }

  // Slice up to current month (min 6 months for chart aesthetics)
  const currentMonthIdx = new Date().getMonth();
  const displayMonthsCount = Math.max(6, currentMonthIdx + 1);

  const monthlyData = MONTH_NAMES.slice(0, displayMonthsCount).map((name, i) => ({
    month: name,
    amount: monthlyTotals[i],
  }));

  const totalInvoiced = monthlyData.reduce((sum, item) => sum + item.amount, 0);

  // SVG drawing configuration
  const width = 600;
  const height = 190;
  const padding = 28;

  const rawMax = Math.max(...monthlyData.map(d => d.amount));
  const maxAmount = rawMax > 0 ? rawMax : 1000000;
  
  // Convert data points to SVG coordinates
  const points = monthlyData.map((d, index) => {
    const x = padding + (index * (width - 2 * padding)) / Math.max(1, monthlyData.length - 1);
    const y = height - padding - (d.amount / maxAmount) * (height - 2 * padding);
    return { x, y, label: d.month, raw: d.amount, index };
  });

  // Handle mobile touch scrub across chart
  const handleTouchScrub = useCallback((e: React.TouchEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const relativeX = touch.clientX - rect.left;
    const scale = width / rect.width;
    const svgX = relativeX * scale;

    let closest = points[0];
    let minDistance = Math.abs(closest.x - svgX);
    for (let i = 1; i < points.length; i++) {
      const dist = Math.abs(points[i].x - svgX);
      if (dist < minDistance) {
        minDistance = dist;
        closest = points[i];
      }
    }
    setHoveredPoint({ index: closest.index, month: closest.label, amount: closest.raw, x: closest.x, y: closest.y });
  }, [points, width]);

  // Create curved path
  let linePath = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const curr = points[i];
    const next = points[i + 1];
    const cpX1 = curr.x + (next.x - curr.x) / 3;
    const cpY1 = curr.y;
    const cpX2 = curr.x + (2 * (next.x - curr.x)) / 3;
    const cpY2 = next.y;
    linePath += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${next.x} ${next.y}`;
  }

  const fillPath = `${linePath} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

  return (
    <Card className="col-span-1 lg:col-span-2 group transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/80 dark:hover:shadow-black/50 hover:border-slate-300/80 dark:hover:border-slate-700 border-slate-200/80 dark:border-slate-800 touch-manipulation">
      <CardHeader className="flex flex-row items-center justify-between pb-2 border-none">
        <div>
          <CardTitle>{"Chiffre d'affaires facturé"}</CardTitle>
          <CardDescription>{`Évolution des factures réelles émises en ${currentYear}`}</CardDescription>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl text-xs font-semibold border border-emerald-100/80 dark:border-emerald-800/60 transition-all duration-200 hover:scale-105 select-none shadow-sm">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Données réelles Supabase</span>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-3xl font-outfit font-bold text-slate-800 dark:text-white tracking-tight transition-colors group-hover:text-brand-pink">
            {formatFCFA(hoveredPoint ? hoveredPoint.amount : totalInvoiced)}
          </span>
          <span className="text-xs text-slate-400 dark:text-slate-500 font-medium transition-colors">
            {hoveredPoint ? `Facturé en ${hoveredPoint.month}` : 'Total facturé cumulé'}
          </span>
        </div>

        {/* Responsive Chart Container */}
        <div className="w-full overflow-hidden relative touch-none">
          <svg 
            ref={svgRef}
            viewBox={`0 0 ${width} ${height}`} 
            className="w-full h-auto overflow-visible select-none cursor-pointer"
            style={{ minHeight: '190px' }}
            onTouchStart={handleTouchScrub}
            onTouchMove={handleTouchScrub}
            onTouchEnd={() => {}}
          >
            <defs>
              {/* Line gradient */}
              <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#EC4899" />
                <stop offset="100%" stopColor="#E11D48" />
              </linearGradient>
              {/* Fill area gradient */}
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#EC4899" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#EC4899" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
              const y = padding + ratio * (height - 2 * padding);
              return (
                <line
                  key={i}
                  x1={padding}
                  y1={y}
                  x2={width - padding}
                  y2={y}
                  stroke="currentColor"
                  className="text-slate-100 dark:text-slate-800"
                  strokeWidth="1"
                />
              );
            })}

            {/* Area Fill under the line */}
            <path d={fillPath} fill="url(#areaGrad)" />

            {/* Main curved path */}
            <path
              d={linePath}
              fill="none"
              stroke="url(#lineGrad)"
              strokeWidth="3.5"
              strokeLinecap="round"
              className="transition-all duration-300"
            />

            {/* Hover vertical guide line */}
            {hoveredPoint && (
              <line
                x1={hoveredPoint.x}
                y1={padding}
                x2={hoveredPoint.x}
                y2={height - padding}
                stroke="#FBCFE8"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
            )}

            {/* Data points */}
            {points.map((pt, i) => {
              const isHovered = hoveredPoint?.index === i;
              return (
                <g 
                  key={i} 
                  className="cursor-pointer"
                  onClick={() => setHoveredPoint({ index: i, month: pt.label, amount: pt.raw, x: pt.x, y: pt.y })}
                  onMouseEnter={() => setHoveredPoint({ index: i, month: pt.label, amount: pt.raw, x: pt.x, y: pt.y })}
                  onMouseLeave={() => setHoveredPoint(null)}
                >
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="22"
                    className="fill-transparent"
                  />

                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isHovered ? 14 : 7}
                    className={`transition-all duration-200 fill-brand-pink/20 ${
                      isHovered ? 'opacity-100 scale-125' : 'opacity-0 hover:opacity-80'
                    }`}
                  />
                  
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isHovered ? 6 : 4}
                    className="transition-all duration-200 fill-white dark:fill-slate-900 stroke-brand-pink stroke-[2.5]"
                  />

                  {/* Tooltip */}
                  {isHovered && (
                    <g className="pointer-events-none">
                      <rect
                        x={Math.max(10, Math.min(width - 100, pt.x - 45))}
                        y={pt.y - 34}
                        width="90"
                        height="24"
                        rx="7"
                        className="fill-brand-navy shadow-lg"
                      />
                      <text
                        x={Math.max(55, Math.min(width - 55, pt.x))}
                        y={pt.y - 18}
                        textAnchor="middle"
                        className="text-[10px] fill-white font-semibold font-outfit"
                      >
                        {formatFCFA(pt.raw)}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}

            {/* X-Axis labels */}
            {points.map((pt, i) => (
              <text
                key={i}
                x={pt.x}
                y={height - 6}
                textAnchor="middle"
                className={`text-[10px] font-medium font-outfit transition-colors duration-200 cursor-pointer ${
                  hoveredPoint?.index === i ? 'fill-brand-pink font-bold text-[11px]' : 'fill-slate-400 dark:fill-slate-500'
                }`}
                onClick={() => setHoveredPoint({ index: i, month: pt.label, amount: pt.raw, x: pt.x, y: pt.y })}
              >
                {pt.label}
              </text>
            ))}
          </svg>
        </div>
      </CardContent>
    </Card>
  );
}
