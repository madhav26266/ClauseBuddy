import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { 
  ChevronRight, 
  ChevronLeft, 
  FileText, 
  AlertTriangle, 
  CheckCircle2,
  Eye,
  Download,
  Copy
} from 'lucide-react';

interface RightPanelProps {
  isExpanded: boolean;
  onToggle: () => void;
}

export default function RightPanel({ isExpanded, onToggle }: RightPanelProps) {
  const [activeTab, setActiveTab] = useState<'summary' | 'risks'>('summary');

  const documentSummary = {
    title: 'Rental Agreement - Simplified',
    type: 'Lease Agreement',
    pages: 12,
    sections: [
      {
        title: 'Property Details',
        content: 'This agreement is for a 2-bedroom apartment at 123 Main Street, furnished, available from January 1, 2025.'
      },
      {
        title: 'Rent & Payments',
        content: 'Monthly rent is $2,500, due on the 1st of each month. Late fees of $50 apply after the 5th. Security deposit is $2,500.'
      },
      {
        title: 'Term & Renewal',
        content: '12-month lease starting January 1, 2025. Automatic renewal unless 60-day notice is given by either party.'
      },
      {
        title: 'Tenant Responsibilities',
        content: 'Maintain property cleanliness, no smoking, no pets without written permission. Tenant pays utilities except water/sewer.'
      }
    ]
  };

  const risks = [
    {
      id: 1,
      level: 'high',
      title: 'Excessive Late Fees',
      description: 'Late fee of $50 may be considered excessive for a $2,500 monthly rent.',
      clause: 'Section 3.2 - Payment Terms',
      recommendation: 'Negotiate for a lower late fee or percentage-based calculation.'
    },
    {
      id: 2,
      level: 'medium',
      title: 'Automatic Renewal Clause',
      description: 'Lease automatically renews unless notice is given 60 days in advance.',
      clause: 'Section 8.1 - Term and Renewal',
      recommendation: 'Consider requesting a shorter notice period or opt-out clause.'
    },
    {
      id: 3,
      level: 'low',
      title: 'Pet Policy Restriction',
      description: 'No pets allowed without written permission from landlord.',
      clause: 'Section 6.3 - Property Use',
      recommendation: 'If you have pets, negotiate pet policy before signing.'
    }
  ];

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high':
        return 'bg-red-900/30 text-red-400 border-red-600/30';
      case 'medium':
        return 'bg-yellow-900/30 text-yellow-400 border-yellow-600/30';
      case 'low':
        return 'bg-blue-900/30 text-blue-400 border-blue-600/30';
      default:
        return 'bg-gray-900/30 text-gray-400 border-gray-600/30';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-red-400" />;
      case 'medium':
        return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      case 'low':
        return <CheckCircle2 className="h-4 w-4 text-blue-400" />;
      default:
        return null;
    }
  };

  return (
    <div className={`
      fixed right-0 top-0 h-full bg-gray-900/80 backdrop-blur-sm border-l border-purple-900/30 
      transition-all duration-300 z-10
      ${isExpanded ? 'w-96' : 'w-12'}
    `}>
      {/* Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggle}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1/2 bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-lg z-20"
      >
        {isExpanded ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </Button>

      {isExpanded && (
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-purple-900/30">
            <h2 className="text-white font-semibold mb-3">Document Analysis</h2>
            <div className="flex space-x-1">
              <Button
                variant={activeTab === 'summary' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('summary')}
                className={`flex-1 ${
                  activeTab === 'summary' 
                    ? 'bg-purple-600 text-white' 
                    : 'text-purple-200 hover:text-white hover:bg-purple-900/30'
                }`}
              >
                <FileText size={14} className="mr-1" />
                Summary
              </Button>
              <Button
                variant={activeTab === 'risks' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('risks')}
                className={`flex-1 ${
                  activeTab === 'risks' 
                    ? 'bg-purple-600 text-white' 
                    : 'text-purple-200 hover:text-white hover:bg-purple-900/30'
                }`}
              >
                <AlertTriangle size={14} className="mr-1" />
                Risks ({risks.length})
              </Button>
            </div>
          </div>

          {/* Content */}
          <ScrollArea className="flex-1">
            {activeTab === 'summary' ? (
              <div className="p-4 space-y-4">
                {/* Document Info */}
                <Card className="bg-gray-800/50 border-purple-900/30">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white text-sm">{documentSummary.title}</CardTitle>
                      <Button variant="ghost" size="icon" className="text-purple-400 hover:text-white">
                        <Copy size={14} />
                      </Button>
                    </div>
                    <div className="flex items-center space-x-2 text-xs">
                      <Badge variant="outline" className="border-purple-600 text-purple-300">
                        {documentSummary.type}
                      </Badge>
                      <span className="text-purple-300">{documentSummary.pages} pages</span>
                    </div>
                  </CardHeader>
                </Card>

                {/* Summary Sections */}
                <div className="space-y-3">
                  {documentSummary.sections.map((section, index) => (
                    <Card key={index} className="bg-gray-800/30 border-purple-900/30">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-white text-sm">{section.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-purple-200 text-sm leading-relaxed">
                          {section.content}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Actions */}
                <div className="space-y-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full border-purple-600 text-purple-400 hover:bg-purple-900/30"
                  >
                    <Eye size={14} className="mr-2" />
                    View Full Document
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full border-teal-600 text-teal-400 hover:bg-teal-900/30"
                  >
                    <Download size={14} className="mr-2" />
                    Export Summary
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-4 space-y-4">
                {/* Risk Overview */}
                <Card className="bg-gray-800/50 border-purple-900/30">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white text-sm">Risk Assessment</CardTitle>
                    <CardDescription className="text-xs text-purple-200">
                      {risks.filter(r => r.level === 'high').length} high, {' '}
                      {risks.filter(r => r.level === 'medium').length} medium, {' '}
                      {risks.filter(r => r.level === 'low').length} low risk items found
                    </CardDescription>
                  </CardHeader>
                </Card>

                {/* Risk Items */}
                <div className="space-y-3">
                  {risks.map((risk) => (
                    <Card key={risk.id} className="bg-gray-800/30 border-purple-900/30">
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-2">
                            {getRiskIcon(risk.level)}
                            <CardTitle className="text-white text-sm">{risk.title}</CardTitle>
                          </div>
                          <Badge className={getRiskColor(risk.level)}>
                            {risk.level}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0 space-y-3">
                        <p className="text-purple-200 text-xs leading-relaxed">
                          {risk.description}
                        </p>
                        <div className="space-y-2">
                          <div className="p-2 bg-gray-900/50 rounded text-xs">
                            <p className="text-purple-300 font-medium">Found in:</p>
                            <p className="text-purple-200">{risk.clause}</p>
                          </div>
                          <div className="p-2 bg-blue-900/20 rounded text-xs">
                            <p className="text-blue-300 font-medium">Recommendation:</p>
                            <p className="text-blue-200">{risk.recommendation}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Actions */}
                <div className="space-y-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full border-red-600 text-red-400 hover:bg-red-900/30"
                  >
                    <AlertTriangle size={14} className="mr-2" />
                    Export Risk Report
                  </Button>
                </div>
              </div>
            )}
          </ScrollArea>
        </div>
      )}
    </div>
  );
}