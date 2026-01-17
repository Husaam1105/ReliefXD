import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { AlertTriangle, Activity, CheckCircle2, Siren, Pill, Sandwich, Home, Info } from 'lucide-react';
import { AIAnalysisResult } from '../types/incident';
import { motion } from 'motion/react';

interface AIResponseCardProps {
  result: AIAnalysisResult | null;
}

export function AIResponseCard({ result }: AIResponseCardProps) {
  if (!result) {
    return (
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 text-center">
        <p className="text-slate-400 text-sm">
          Analyze an incident to see AI-powered insights
        </p>
      </div>
    );
  }

  const getUrgencyConfig = (urgency: AIAnalysisResult['urgency']) => {
    switch (urgency) {
      case 'critical':
        return {
          icon: AlertTriangle,
          color: 'bg-red-500',
          textColor: 'text-red-400',
          borderColor: 'border-red-500/50',
          bgGradient: 'from-red-500/20 to-red-600/10',
          label: 'CRITICAL',
        };
      case 'high':
        return {
          icon: AlertTriangle,
          color: 'bg-orange-600',
          textColor: 'text-orange-500',
          borderColor: 'border-orange-600/50',
          bgGradient: 'from-orange-600/20 to-orange-700/10',
          label: 'HIGH',
        };
      case 'medium':
        return {
          icon: Activity,
          color: 'bg-yellow-500',
          textColor: 'text-yellow-400',
          borderColor: 'border-yellow-500/50',
          bgGradient: 'from-yellow-500/20 to-yellow-600/10',
          label: 'MEDIUM',
        };
      case 'low':
        return {
          icon: Info,
          color: 'bg-blue-500',
          textColor: 'text-blue-400',
          borderColor: 'border-blue-500/50',
          bgGradient: 'from-blue-500/20 to-blue-600/10',
          label: 'LOW',
        };
      case 'safe':
        return {
          icon: CheckCircle2,
          color: 'bg-green-500',
          textColor: 'text-green-400',
          borderColor: 'border-green-500/50',
          bgGradient: 'from-green-500/20 to-green-600/10',
          label: 'SAFE',
        };
    }
  };

  const getCategoryIcon = (category: AIAnalysisResult['category']) => {
    switch (category) {
      case 'rescue':
        return Siren;
      case 'medical':
        return Pill;
      case 'food':
        return Sandwich;
      case 'shelter':
        return Home;
      default:
        return Info;
    }
  };

  const urgencyConfig = getUrgencyConfig(result.urgency);
  const CategoryIcon = getCategoryIcon(result.category);
  const UrgencyIcon = urgencyConfig.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      {/* Urgency Level */}
      <div className={`bg-gradient-to-br ${urgencyConfig.bgGradient} border-2 ${urgencyConfig.borderColor} rounded-xl p-6 backdrop-blur-sm shadow-lg`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
            Urgency Level
          </h3>
          <UrgencyIcon className={`w-6 h-6 ${urgencyConfig.textColor}`} />
        </div>
        <div className={`inline-flex items-center gap-2 px-4 py-2 ${urgencyConfig.color} rounded-lg text-white font-bold text-lg`}>
          {urgencyConfig.label}
        </div>
      </div>

      {/* Category */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
            Category
          </h3>
          <CategoryIcon className="w-6 h-6 text-blue-400" />
        </div>
        <Badge variant="secondary" className="px-4 py-2 text-base capitalize">
          {result.category}
        </Badge>
      </div>

      {/* Summary */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 backdrop-blur-sm">
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">
          AI Summary
        </h3>
        <p className="text-slate-200 text-sm leading-relaxed">{result.summary}</p>
      </div>

      {/* Required Resources */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 backdrop-blur-sm">
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">
          Required Resources
        </h3>
        <div className="flex flex-wrap gap-2">
          {result.resources.map((resource, idx) => (
            <Badge key={idx} variant="outline" className="px-3 py-1.5 text-sm border-blue-500/50 text-blue-300">
              {resource}
            </Badge>
          ))}
        </div>
      </div>

      {/* Confidence Score */}
      {/* Confidence Score */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
            AI Confidence
          </h3>
          <span className="text-lg font-bold text-blue-400 tabular-nums">{Math.round(result.confidence * 100)}%</span>
        </div>
        <p className="text-xs text-slate-400 mt-2">
          AI prediction accuracy based on analysis
        </p>
      </div>
    </motion.div>
  );
}
