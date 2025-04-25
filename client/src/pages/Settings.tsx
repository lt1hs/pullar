import React, { useEffect } from "react";
import { motion } from "framer-motion";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import { useUser } from "@/hooks/useUser";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { NeonButton } from "@/components/ui/neon-button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  BellIcon, 
  MoonIcon, 
  ShieldIcon, 
  HelpCircleIcon, 
  LogOutIcon,
  UserIcon,
  InfoIcon
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Settings: React.FC = () => {
  const { user, logout } = useUser();
  const { toast } = useToast();
  
  useEffect(() => {
    document.title = "CryptoVerse - Settings";
  }, []);
  
  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
  };
  
  const handleSettingToggle = (setting: string) => {
    toast({
      title: `${setting} ${setting === 'Dark Mode' ? 'enabled' : 'notifications toggled'}`,
      description: `Your ${setting.toLowerCase()} preference has been updated`,
    });
  };
  
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
        <h1 className="text-3xl font-bold text-center mb-4 neon-text-primary">CryptoVerse</h1>
        <p className="text-center mb-4">Please login to access settings</p>
      </div>
    );
  }
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-background pb-20"
    >
      <TopBar />
      
      <main className="mt-16 px-4 py-6">
        <h1 className="font-rajdhani font-bold text-2xl mb-6">Settings</h1>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          <motion.div variants={itemVariants}>
            <Card className="bg-surface border-none neon-border">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <UserIcon className="mr-3 h-5 w-5 text-primary" />
                  <h2 className="font-medium">Account</h2>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Username</span>
                    <span className="text-gray-400">{user.username}</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between items-center">
                    <span>Level</span>
                    <span className="text-gray-400">{user.level}</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between items-center">
                    <span>Game Tokens</span>
                    <span className="text-gray-400">{user.gameTokens}</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between items-center">
                    <span>Trade Tokens</span>
                    <span className="text-gray-400">{user.tradeTokens}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Card className="bg-surface border-none neon-border">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <BellIcon className="mr-3 h-5 w-5 text-primary" />
                  <h2 className="font-medium">Notifications</h2>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Push Notifications</span>
                    <Switch defaultChecked onCheckedChange={() => handleSettingToggle('Push Notifications')} />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between items-center">
                    <span>Trade Alerts</span>
                    <Switch defaultChecked onCheckedChange={() => handleSettingToggle('Trade Alerts')} />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between items-center">
                    <span>Social Updates</span>
                    <Switch defaultChecked onCheckedChange={() => handleSettingToggle('Social Updates')} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Card className="bg-surface border-none neon-border">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <MoonIcon className="mr-3 h-5 w-5 text-primary" />
                  <h2 className="font-medium">Appearance</h2>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Dark Mode</span>
                    <Switch defaultChecked onCheckedChange={() => handleSettingToggle('Dark Mode')} />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between items-center">
                    <span>Neon Effects</span>
                    <Switch defaultChecked onCheckedChange={() => handleSettingToggle('Neon Effects')} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Card className="bg-surface border-none neon-border">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <ShieldIcon className="mr-3 h-5 w-5 text-primary" />
                  <h2 className="font-medium">Security</h2>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Biometric Login</span>
                    <Switch onCheckedChange={() => handleSettingToggle('Biometric Login')} />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between items-center">
                    <span>Two-Factor Authentication</span>
                    <Switch onCheckedChange={() => handleSettingToggle('Two-Factor Authentication')} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Card className="bg-surface border-none neon-border">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <HelpCircleIcon className="mr-3 h-5 w-5 text-primary" />
                  <h2 className="font-medium">Support</h2>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Help Center</span>
                    <InfoIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between items-center">
                    <span>FAQs</span>
                    <InfoIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between items-center">
                    <span>Contact Support</span>
                    <InfoIcon className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Alert variant="destructive" className="bg-surface border-error/30">
              <AlertDescription className="flex justify-between items-center">
                <span>Log out from your account</span>
                <NeonButton 
                  onClick={handleLogout}
                  variant="outline" 
                  size="sm"
                  className="border-error/50 text-error hover:bg-error/10"
                >
                  <LogOutIcon className="mr-2 h-4 w-4" />
                  Logout
                </NeonButton>
              </AlertDescription>
            </Alert>
          </motion.div>
          
          <motion.div variants={itemVariants} className="text-center text-gray-400 text-sm pt-4">
            <p>CryptoVerse v1.0.0</p>
            <p className="mt-1">© 2023 CryptoVerse. All rights reserved.</p>
          </motion.div>
        </motion.div>
      </main>
      
      <BottomNav />
    </motion.div>
  );
};

export default Settings;
