import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Upload, MessageCircle, FileText, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';

interface DashboardProps {
  onSectionChange: (section: string) => void;
}

export default function Dashboard({ onSectionChange }: DashboardProps) {
  const stats = [
    {
      title: 'Documents Analyzed',
      value: '24',
      icon: FileText,
      color: 'text-teal-400',
      bgColor: 'bg-teal-900/20'
    },
    {
      title: 'Risks Flagged',
      value: '7',
      icon: AlertTriangle,
      color: 'text-red-400',
      bgColor: 'bg-red-900/20'
    },
    {
      title: 'Summaries Created',
      value: '15',
      icon: CheckCircle2,
      color: 'text-green-400',
      bgColor: 'bg-green-900/20'
    }
  ];

  const recentActivity = [
    {
      title: 'Rental Agreement Analysis',
      description: 'Identified 3 potential risks in lease terms',
      time: '2 hours ago',
      status: 'completed'
    },
    {
      title: 'Employment Contract Review',
      description: 'Summary generated for HR department',
      time: '1 day ago',
      status: 'completed'
    },
    {
      title: 'NDA Simplification',
      description: 'Plain English version created',
      time: '2 days ago',
      status: 'completed'
    },
    {
      title: 'Service Agreement Upload',
      description: 'Currently processing document',
      time: '3 days ago',
      status: 'processing'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-white mb-2">
          Welcome to ClauseBuddy
        </h1>
        <p className="text-purple-200 text-lg max-w-2xl mx-auto">
          Your AI-powered legal document analyzer. Upload contracts, get plain English summaries, 
          and identify potential risks instantly.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="flex justify-center space-x-4">
        <Button
          size="lg"
          className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-600/30 transition-all duration-200"
          onClick={() => onSectionChange('uploads')}
        >
          <Upload className="mr-2" size={20} />
          Upload Document
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="border-teal-400 text-teal-400 hover:bg-teal-400 hover:text-black transition-all duration-200"
          onClick={() => onSectionChange('chat')}
        >
          <MessageCircle className="mr-2" size={20} />
          Start New Chat
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="bg-gray-900/50 border-purple-900/30 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-purple-200">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <Card className="bg-gray-900/50 border-purple-900/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Recent Activity</CardTitle>
          <CardDescription className="text-purple-200">
            Your latest document analyses and summaries
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-4 p-4 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 transition-colors">
                <div className={`p-2 rounded-full ${
                  activity.status === 'completed' ? 'bg-green-900/30' : 'bg-yellow-900/30'
                }`}>
                  {activity.status === 'completed' ? (
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                  ) : (
                    <Clock className="h-4 w-4 text-yellow-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium">{activity.title}</p>
                  <p className="text-purple-200 text-sm">{activity.description}</p>
                  <p className="text-purple-300 text-xs mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}