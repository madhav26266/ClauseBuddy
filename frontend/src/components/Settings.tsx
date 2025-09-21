import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Separator } from './ui/separator';
import { 
  User, 
  Mail, 
  Bell, 
  Moon, 
  Sun, 
  Shield, 
  LogOut, 
  Camera,
  Save,
  AlertTriangle
} from 'lucide-react';

export default function Settings() {
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: ''
  });

  const [preferences, setPreferences] = useState({
    darkMode: true,
    notifications: true,
    emailAlerts: false,
    riskAlerts: true,
    autoAnalysis: true
  });

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const handleProfileChange = (field: string, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
  };

  const handlePreferenceChange = (field: string, value: boolean) => {
    setPreferences(prev => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
  };

  const handleSaveChanges = () => {
    // In a real app, this would save to backend
    setHasUnsavedChanges(false);
    console.log('Settings saved:', { profile, preferences });
  };

  const handleLogout = () => {
    // In a real app, this would handle logout
    console.log('Logging out...');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-purple-200">
          Manage your account preferences and application settings
        </p>
      </div>

      {/* Unsaved Changes Alert */}
      {hasUnsavedChanges && (
        <Card className="bg-yellow-900/20 border-yellow-600/30 backdrop-blur-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
              <p className="text-yellow-200">You have unsaved changes</p>
            </div>
            <Button 
              onClick={handleSaveChanges}
              className="bg-yellow-600 hover:bg-yellow-700 text-black"
            >
              <Save size={16} className="mr-2" />
              Save Changes
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Profile Section */}
      <Card className="bg-gray-900/50 border-purple-900/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <User className="mr-2 h-5 w-5" />
            Profile Information
          </CardTitle>
          <CardDescription className="text-purple-200">
            Update your personal information and profile picture
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar Section */}
          <div className="flex items-center space-x-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profile.avatar} />
              <AvatarFallback className="bg-purple-600 text-white text-lg">
                {profile.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <Button variant="outline" className="border-purple-600 text-purple-400 hover:bg-purple-900/30">
                <Camera size={16} className="mr-2" />
                Change Photo
              </Button>
              <p className="text-sm text-purple-300">
                JPG, PNG or GIF. Max size 2MB.
              </p>
            </div>
          </div>

          {/* Profile Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-purple-200">Full Name</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => handleProfileChange('name', e.target.value)}
                className="bg-gray-800/50 border-purple-900/30 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-purple-200">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => handleProfileChange('email', e.target.value)}
                className="bg-gray-800/50 border-purple-900/30 text-white"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preferences Section */}
      <Card className="bg-gray-900/50 border-purple-900/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Shield className="mr-2 h-5 w-5" />
            Preferences
          </CardTitle>
          <CardDescription className="text-purple-200">
            Customize your ClauseBuddy experience
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Theme Settings */}
          <div className="space-y-4">
            <h3 className="text-white font-medium">Appearance</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {preferences.darkMode ? (
                  <Moon className="h-5 w-5 text-purple-400" />
                ) : (
                  <Sun className="h-5 w-5 text-yellow-400" />
                )}
                <div>
                  <Label className="text-purple-200">Dark Mode</Label>
                  <p className="text-sm text-purple-300">Use dark theme throughout the app</p>
                </div>
              </div>
              <Switch
                checked={preferences.darkMode}
                onCheckedChange={(checked) => handlePreferenceChange('darkMode', checked)}
              />
            </div>
          </div>

          <Separator className="bg-purple-900/30" />

          {/* Notification Settings */}
          <div className="space-y-4">
            <h3 className="text-white font-medium flex items-center">
              <Bell className="mr-2 h-4 w-4" />
              Notifications
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-purple-200">Push Notifications</Label>
                  <p className="text-sm text-purple-300">Receive notifications in the app</p>
                </div>
                <Switch
                  checked={preferences.notifications}
                  onCheckedChange={(checked) => handlePreferenceChange('notifications', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-purple-200">Email Alerts</Label>
                  <p className="text-sm text-purple-300">Get updates via email</p>
                </div>
                <Switch
                  checked={preferences.emailAlerts}
                  onCheckedChange={(checked) => handlePreferenceChange('emailAlerts', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-purple-200">Risk Alerts</Label>
                  <p className="text-sm text-purple-300">Notify when high risks are detected</p>
                </div>
                <Switch
                  checked={preferences.riskAlerts}
                  onCheckedChange={(checked) => handlePreferenceChange('riskAlerts', checked)}
                />
              </div>
            </div>
          </div>

          <Separator className="bg-purple-900/30" />

          {/* Analysis Settings */}
          <div className="space-y-4">
            <h3 className="text-white font-medium">Document Analysis</h3>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-purple-200">Auto Analysis</Label>
                <p className="text-sm text-purple-300">Automatically analyze uploaded documents</p>
              </div>
              <Switch
                checked={preferences.autoAnalysis}
                onCheckedChange={(checked) => handlePreferenceChange('autoAnalysis', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Actions */}
      <Card className="bg-gray-900/50 border-purple-900/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Account Actions</CardTitle>
          <CardDescription className="text-purple-200">
            Manage your account and session
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-gray-800/30">
            <div className="flex items-center space-x-3">
              <LogOut className="h-5 w-5 text-red-400" />
              <div>
                <p className="text-white font-medium">Sign Out</p>
                <p className="text-sm text-purple-300">Sign out of your ClauseBuddy account</p>
              </div>
            </div>
            <Button 
              variant="destructive"
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700"
            >
              Sign Out
            </Button>
          </div>

          <div className="text-center pt-4">
            <p className="text-sm text-purple-300">
              Account created: August 15, 2025
            </p>
            <p className="text-xs text-purple-400 mt-1">
              ClauseBuddy v1.0.0 • Last updated: September 4, 2025
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}