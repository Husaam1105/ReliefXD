import { Incident } from '../types/incident';
import { Clock, MapPin, AlertTriangle, CheckCircle2, Activity, MoreHorizontal, Globe } from 'lucide-react';
import { format } from 'date-fns';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

interface HistoryViewProps {
    incidents: Incident[];
    onDelete?: (id: string) => void;
    onViewOnMap?: (incident: Incident) => void;
    onViewDetails?: (incident: Incident) => void;
}

export function HistoryView({ incidents, onDelete, onViewOnMap, onViewDetails }: HistoryViewProps) {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Request History</h2>
                <span className="text-sm text-slate-400">Total Records: {incidents.length}</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-400">
                        <thead className="bg-slate-950/50 text-slate-200 uppercase tracking-wider text-xs font-semibold border-b border-slate-800">
                            <tr>
                                <th className="px-6 py-4">Status & Urgency</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Description</th>
                                <th className="px-6 py-4">Resources</th>
                                <th className="px-6 py-4">Confidence</th>
                                <th className="px-6 py-4">Time</th>
                                <th className="px-6 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {incidents.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                                        No history available.
                                    </td>
                                </tr>
                            ) : (
                                incidents.map((incident) => (
                                    <tr key={incident.id} className="hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                {incident.urgency === 'critical' || incident.urgency === 'high' ? (
                                                    <AlertTriangle className={`w-4 h-4 ${incident.urgency === 'critical' ? 'text-red-500' : 'text-orange-600'}`} />
                                                ) : incident.urgency === 'medium' ? (
                                                    <Activity className="w-4 h-4 text-yellow-500" />
                                                ) : incident.urgency === 'low' ? (
                                                    <Activity className="w-4 h-4 text-blue-500" />
                                                ) : (
                                                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                                                )}
                                                <span className={`capitalize font-medium ${incident.urgency === 'critical' ? 'text-red-400' :
                                                        incident.urgency === 'high' ? 'text-orange-500' :
                                                            incident.urgency === 'medium' ? 'text-yellow-400' :
                                                                incident.urgency === 'low' ? 'text-blue-400' :
                                                                    'text-green-400'
                                                    }`}>
                                                    {incident.urgency}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="bg-slate-800 text-white px-2 py-1 rounded-md text-xs capitalize border border-slate-700">
                                                {incident.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 max-w-xs truncate" title={incident.description}>
                                            {incident.description}
                                            <div className="text-xs text-slate-500 mt-1 truncate">{incident.summary}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1">
                                                {incident.resources.slice(0, 2).map((res: string, i: number) => (
                                                    <span key={i} className="text-[10px] bg-blue-900/30 text-blue-300 px-1.5 py-0.5 rounded border border-blue-900/50">
                                                        {res}
                                                    </span>
                                                ))}
                                                {incident.resources.length > 2 && (
                                                    <span className="text-[10px] text-slate-500 px-1">+ {incident.resources.length - 2}</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-16 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                                                    <div className="bg-blue-500 h-full" style={{ width: `${incident.confidence}%` }} />
                                                </div>
                                                <span>{incident.confidence}%</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 tabular-nums text-slate-500">
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-3 h-3" />
                                                {format(incident.timestamp, 'MMM d, HH:mm')}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <DropdownMenu.Root>
                                                <DropdownMenu.Trigger asChild>
                                                    <button className="h-8 w-8 p-0 flex items-center justify-center rounded-md hover:bg-slate-800 text-slate-400 hover:text-white">
                                                        <span className="sr-only">Open menu</span>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </button>
                                                </DropdownMenu.Trigger>
                                                <DropdownMenu.Content align="end" className="w-[160px] bg-slate-900 border border-slate-800 rounded-lg p-1 shadow-xl z-50">
                                                    <DropdownMenu.Label className="px-2 py-1.5 text-xs font-semibold text-slate-500">Actions</DropdownMenu.Label>
                                                    <DropdownMenu.Item
                                                        className="px-2 py-1.5 text-sm text-slate-200 outline-none cursor-pointer hover:bg-slate-800 rounded"
                                                        onClick={() => onViewDetails?.(incident)}
                                                    >
                                                        View Details
                                                    </DropdownMenu.Item>
                                                    <DropdownMenu.Item
                                                        className="px-2 py-1.5 text-sm text-slate-200 outline-none cursor-pointer hover:bg-slate-800 rounded"
                                                        onClick={() => onViewOnMap?.(incident)}
                                                    >
                                                        View on Map
                                                    </DropdownMenu.Item>
                                                    <DropdownMenu.Separator className="h-px bg-slate-800 my-1" />
                                                    <DropdownMenu.Item
                                                        className="px-2 py-1.5 text-sm text-red-400 outline-none cursor-pointer hover:bg-red-500/10 rounded"
                                                        onClick={() => onDelete?.(incident.id)}
                                                    >
                                                        Delete Incident
                                                    </DropdownMenu.Item>
                                                </DropdownMenu.Content>
                                            </DropdownMenu.Root>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
