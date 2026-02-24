'use client';

import { Users, UserPlus } from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const stats = [
  { title: 'Total members', value: '20', icon: Users, color: 'text-pink-500' },
  { title: 'Active members', value: '13', subtitle: 'Last 2 meetings', icon: Users, color: 'text-teal-500' },
  { title: 'New Member(s)', value: '05', subtitle: 'Last 4 weeks', icon: UserPlus, color: 'text-blue-500' },
];

const pieData = [
  { name: 'Impressions', value: 40, fill: '#3b82f6' },
  { name: 'Click-Through Rate', value: 30, fill: '#10b981' },
  { name: 'Engagement Rate', value: 30, fill: '#8b5cf6' },
];

const upcomingEvents = [
  { name: 'Healing Streams', date: 'April 9th' },
  { name: 'Reach out world', date: 'March 5th' },
  { name: "Pastors Birthday", date: 'Dec 7th' },
];

const celebrations = [
  { name: 'Esteemed Bro. John Ezra', day: '05' },
  { name: 'Esteemed Sis. Praise Oluchi', day: '20' },
];

const COLORS = ['#3b82f6', '#10b981', '#8b5cf6'];

const CustomLabel = ({ cx, cy }: any) => (
  <g>
    <text x={cx} y={cy - 10} textAnchor="middle" dominantBaseline="central">
      <tspan fontSize="22" fontWeight="bold" fill="#374151">
        $11,675
      </tspan>
    </text>
    <text x={cx} y={cy + 15} textAnchor="middle" dominantBaseline="central">
      <tspan fontSize="13" fill="#6b7280">Total Ad Revenue</tspan>
    </text>
  </g>
);

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="border-none shadow-sm">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm text-gray-500 font-medium">{stat.title}</p>
                  {stat.subtitle && (
                    <p className="text-xs text-gray-400 mt-0.5">{stat.subtitle}</p>
                  )}
                </div>
                <div className={`p-3 rounded-full bg-opacity-10 ${stat.color.replace('text-', 'bg-')}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
              <p className="text-4xl md:text-5xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Average Attendance Pie */}
        <Card className="border-none shadow-sm lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Average Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={2}
                    dataKey="value"
                    label={CustomLabel}
                    labelLine={false}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {upcomingEvents.map((event, i) => (
                <li key={i} className="flex justify-between text-sm">
                  <span className="text-gray-700 font-medium">{i + 1}. {event.name}</span>
                  <span className="text-gray-500">{event.date}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Celebrations */}
        <Card className="border-none shadow-sm lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">celebrations</CardTitle>
              <Badge variant="outline" className="px-3 py-1">
                MONTH : March
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full min-w-125">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Names</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-gray-600 w-24">DAY</th>
                  </tr>
                </thead>
                <tbody>
                  {celebrations.map((item, i) => (
                    <tr key={i} className="border-b last:border-none hover:bg-gray-50">
                      <td className="py-4 px-2 text-gray-800">
                        {i + 1}. {item.name}
                      </td>
                      <td className="py-4 px-2 text-gray-600">{item.day}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}