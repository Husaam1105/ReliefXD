import { Activity, CheckCircle2, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';

interface LiveStatsCardProps {
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  safeCount: number;
  aiConfidence: number;
}

export function LiveStatsCard({ criticalCount, highCount, mediumCount, lowCount, safeCount, aiConfidence }: LiveStatsCardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 w-full">
      {/* Critical */}
      <motion.div
        className="bg-slate-900/50 border border-red-500/20 rounded-xl p-4 backdrop-blur-sm relative overflow-hidden group"
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
      >
        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
          <AlertTriangle className="w-16 h-16 text-red-500" />
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-2 text-red-400">
            <AlertTriangle className="w-5 h-5" />
            <span className="text-sm font-medium">Critical</span>
          </div>
          <div className="text-3xl font-bold text-white tabular-nums">
            <motion.span
              key={criticalCount}
              initial={{ scale: 1.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {criticalCount}
            </motion.span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Immediate action</p>
        </div>
      </motion.div>

      {/* High */}
      <motion.div
        className="bg-slate-900/50 border border-orange-600/20 rounded-xl p-4 backdrop-blur-sm relative overflow-hidden group"
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
      >
        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
          <AlertTriangle className="w-16 h-16 text-orange-600" />
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-2 text-orange-500">
            <AlertTriangle className="w-5 h-5" />
            <span className="text-sm font-medium">High</span>
          </div>
          <div className="text-3xl font-bold text-white tabular-nums">
            <motion.span
              key={highCount}
              initial={{ scale: 1.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {highCount}
            </motion.span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Serious threat</p>
        </div>
      </motion.div>

      {/* Medium */}
      <motion.div
        className="bg-slate-900/50 border border-yellow-500/20 rounded-xl p-4 backdrop-blur-sm relative overflow-hidden group"
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
      >
        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
          <Activity className="w-16 h-16 text-yellow-500" />
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-2 text-yellow-400">
            <Activity className="w-5 h-5" />
            <span className="text-sm font-medium">Medium</span>
          </div>
          <div className="text-3xl font-bold text-white tabular-nums">
            <motion.span
              key={mediumCount}
              initial={{ scale: 1.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {mediumCount}
            </motion.span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Monitoring</p>
        </div>
      </motion.div>

      {/* Low */}
      <motion.div
        className="bg-slate-900/50 border border-blue-500/20 rounded-xl p-4 backdrop-blur-sm relative overflow-hidden group"
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
      >
        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
          <Activity className="w-16 h-16 text-blue-500" />
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-2 text-blue-400">
            <Activity className="w-5 h-5" />
            <span className="text-sm font-medium">Low</span>
          </div>
          <div className="text-3xl font-bold text-white tabular-nums">
            <motion.span
              key={lowCount}
              initial={{ scale: 1.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {lowCount}
            </motion.span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Info only</p>
        </div>
      </motion.div>

      {/* Safe */}
      <motion.div
        className="bg-slate-900/50 border border-green-500/20 rounded-xl p-4 backdrop-blur-sm relative overflow-hidden group"
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
      >
        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
          <CheckCircle2 className="w-16 h-16 text-green-500" />
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-2 text-green-400">
            <CheckCircle2 className="w-5 h-5" />
            <span className="text-sm font-medium">Resolved</span>
          </div>
          <div className="text-3xl font-bold text-white tabular-nums">
            <motion.span
              key={safeCount}
              initial={{ scale: 1.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {safeCount}
            </motion.span>
          </div>
          <p className="text-xs text-slate-400 mt-1">No pending issues</p>
        </div>
      </motion.div>

      {/* System Health */}
      <div className="bg-slate-900/50 border border-blue-500/20 rounded-xl p-4 backdrop-blur-sm flex flex-col justify-between">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-sm font-medium text-slate-300">System Status</h3>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[10px] uppercase font-bold text-green-500">Live</span>
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500">AI Confidence</span>
            <span className="text-blue-400 font-bold">{aiConfidence.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-blue-500 h-full rounded-full transition-all duration-500" style={{ width: `${aiConfidence}%` }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
