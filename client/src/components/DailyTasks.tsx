import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
} from "@/components/ui/card";
import { 
  CheckCircle2, 
  Clock, 
  Gift, 
  Sparkles, 
  Coins, 
  ArrowRight, 
  BarChart3, 
  User, 
  Building, 
  RefreshCw 
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

interface Task {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  reward: string;
  progress: number;
  maxProgress: number;
  completed: boolean;
}

const DailyTasks: React.FC = () => {
  const { toast } = useToast();
  const [dailyTasks, setDailyTasks] = useState<Task[]>([
    {
      id: 1,
      title: "Log in daily",
      description: "Log in to the app",
      icon: <User className="h-5 w-5 text-primary" />,
      reward: "10 GCC",
      progress: 1,
      maxProgress: 1,
      completed: true,
    },
    {
      id: 2,
      title: "Trade crypto",
      description: "Make 3 trades today",
      icon: <RefreshCw className="h-5 w-5 text-primary" />,
      reward: "25 GCC",
      progress: 1,
      maxProgress: 3,
      completed: false,
    },
    {
      id: 3,
      title: "Mine tokens",
      description: "Collect mining rewards",
      icon: <Building className="h-5 w-5 text-primary" />,
      reward: "15 GCC",
      progress: 0,
      maxProgress: 1,
      completed: false,
    },
    {
      id: 4,
      title: "Check portfolio",
      description: "View your portfolio summary",
      icon: <BarChart3 className="h-5 w-5 text-primary" />,
      reward: "5 GCC",
      progress: 0,
      maxProgress: 1,
      completed: false,
    },
    {
      id: 5,
      title: "Social interaction",
      description: "Post or comment in the social feed",
      icon: <User className="h-5 w-5 text-primary" />,
      reward: "10 GCC",
      progress: 0,
      maxProgress: 1,
      completed: false,
    },
  ]);

  const [dailyProgress, setDailyProgress] = useState<number>(20);
  
  const handleClaimReward = (taskId: number) => {
    setDailyTasks(
      dailyTasks.map((task) => {
        if (task.id === taskId) {
          return { ...task, completed: true };
        }
        return task;
      })
    );
    
    // Update overall daily progress
    const completedTasks = dailyTasks.filter(task => task.completed || task.id === taskId).length;
    const totalTasks = dailyTasks.length;
    const newProgress = Math.floor((completedTasks / totalTasks) * 100);
    setDailyProgress(newProgress);
    
    // Show toast
    toast({
      title: "Reward claimed!",
      description: "The reward has been added to your wallet",
    });
  };
  
  const handleCompleteTask = (taskId: number) => {
    setDailyTasks(
      dailyTasks.map((task) => {
        if (task.id === taskId && task.progress < task.maxProgress) {
          const newProgress = task.progress + 1;
          return { 
            ...task, 
            progress: newProgress,
            completed: newProgress >= task.maxProgress,
          };
        }
        return task;
      })
    );
    
    // Show toast
    toast({
      title: "Task progress updated!",
      description: "Keep going to complete all daily tasks",
    });
  };

  return (
    <Card className="bg-surface border-none neon-border">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-medium flex items-center">
            <Clock className="mr-2 h-5 w-5 text-primary" />
            Daily Tasks
          </CardTitle>
          <Badge className="bg-primary/20 text-primary hover:bg-primary/30 hover:text-primary">
            {dailyProgress}% Complete
          </Badge>
        </div>
        <CardDescription>Complete tasks to earn rewards</CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="mb-4">
          <Progress value={dailyProgress} className="h-2" />
          
          <div className="flex justify-between mt-2 items-center">
            <div className="text-xs text-muted-foreground">Daily Progress</div>
            {dailyProgress === 100 ? (
              <div className="flex items-center text-xs text-primary font-medium">
                <Sparkles className="h-3 w-3 mr-1" />
                All tasks completed!
              </div>
            ) : (
              <div className="text-xs text-muted-foreground">
                {dailyProgress}% Complete
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-3">
          {dailyTasks.map((task) => (
            <div key={task.id} className="relative">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-3 rounded-lg flex items-center justify-between ${
                  task.completed 
                    ? "bg-primary/10 border border-primary/30" 
                    : "bg-surface-light"
                }`}
              >
                <div className="flex items-center">
                  <div className="mr-3 p-2 rounded-full bg-background">
                    {task.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">{task.title}</h3>
                    <p className="text-xs text-muted-foreground">{task.description}</p>
                    
                    {task.maxProgress > 1 && (
                      <div className="mt-1">
                        <div className="flex justify-between text-xs mb-1">
                          <span>{task.progress} / {task.maxProgress}</span>
                        </div>
                        <Progress 
                          value={(task.progress / task.maxProgress) * 100} 
                          className="h-1" 
                        />
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col items-end">
                  <div className="flex items-center text-xs font-medium mb-1">
                    <Coins className="h-3 w-3 text-primary mr-1" />
                    {task.reward}
                  </div>
                  
                  {task.completed ? (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs h-8 px-3"
                      onClick={() => handleClaimReward(task.id)}
                    >
                      <Gift className="h-3 w-3 mr-1" />
                      Claim
                    </Button>
                  ) : (
                    <Button 
                      size="sm" 
                      className="text-xs h-8 px-3 bg-primary text-primary-foreground hover:bg-primary/90"
                      onClick={() => handleCompleteTask(task.id)}
                    >
                      <ArrowRight className="h-3 w-3 mr-1" />
                      Go
                    </Button>
                  )}
                </div>
                
                {task.completed && (
                  <div className="absolute -right-2 -top-2 bg-primary rounded-full p-1">
                    <CheckCircle2 className="h-4 w-4 text-background" />
                  </div>
                )}
              </motion.div>
            </div>
          ))}
        </div>
        
        <Separator className="my-4" />
        
        <div className="flex justify-between items-center">
          <div>
            <div className="text-sm font-medium">Daily Streak</div>
            <div className="text-xs text-muted-foreground">5 days</div>
          </div>
          
          <div className="flex">
            {[1, 2, 3, 4, 5, 6, 7].map((day) => (
              <div 
                key={day} 
                className={`w-4 h-4 mx-0.5 rounded-full flex items-center justify-center text-[8px] ${
                  day <= 5 
                    ? "bg-primary text-background" 
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {day}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyTasks;
