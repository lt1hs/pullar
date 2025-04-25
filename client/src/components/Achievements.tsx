import React from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { CheckIcon, TrophyIcon, CrownIcon, RocketIcon } from "lucide-react";

interface Achievement {
  id: number;
  title: string;
  description: string;
  iconClass: string;
  unlocked: boolean;
}

interface Challenge {
  id: number;
  title: string;
  progress: number;
  maxProgress: number;
  completed: boolean;
}

interface AchievementsProps {
  achievements: Achievement[];
  challenges: Challenge[];
}

const Achievements: React.FC<AchievementsProps> = ({ achievements, challenges }) => {
  const completedChallenges = challenges.filter(c => c.completed).length;
  const totalChallenges = challenges.length;
  
  const renderIcon = (iconClass: string) => {
    switch (iconClass) {
      case "ri-trophy-line":
        return <TrophyIcon className="text-xl text-primary" />;
      case "ri-vip-crown-line":
        return <CrownIcon className="text-xl text-secondary" />;
      case "ri-rocket-line":
        return <RocketIcon className="text-xl text-gray-400" />;
      default:
        return <TrophyIcon className="text-xl text-primary" />;
    }
  };
  
  return (
    <section className="px-4 py-3">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-rajdhani font-bold text-xl">Achievements</h2>
        <Link href="/profile">
          <motion.div
            whileHover={{ x: 3 }}
            className="text-primary text-sm flex items-center cursor-pointer"
          >
            All badges
            <i className="ri-arrow-right-s-line ml-1"></i>
          </motion.div>
        </Link>
      </div>
      
      <div className="grid grid-cols-3 gap-3 mb-4">
        {achievements.slice(0, 3).map((achievement, index) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="bg-surface rounded-xl p-3 flex flex-col items-center"
          >
            <div className={`w-12 h-12 rounded-full ${achievement.unlocked ? `bg-${index === 1 ? 'secondary' : 'primary'}/20` : 'bg-gray-500/20'} flex items-center justify-center mb-2 ${!achievement.unlocked && 'grayscale opacity-50'}`}>
              {renderIcon(achievement.iconClass)}
            </div>
            <div className="text-xs text-center font-medium">
              {achievement.title}
            </div>
          </motion.div>
        ))}
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="neon-border rounded-xl bg-surface p-3 mb-4"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-medium">Daily Challenges</div>
          <div className="text-xs text-primary">{completedChallenges}/{totalChallenges} completed</div>
        </div>
        
        <div className="space-y-3">
          {challenges.map((challenge) => (
            <div key={challenge.id} className="flex items-center">
              <div className={`w-5 h-5 rounded-full border ${challenge.completed ? 'border-success' : 'border-gray-500'} flex items-center justify-center mr-3`}>
                {challenge.completed && <CheckIcon className="text-xs text-success h-3 w-3" />}
              </div>
              <div className="flex-1">
                <div className="text-sm">{challenge.title}</div>
                <div className="w-full h-1.5 bg-surface-light rounded-full">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(challenge.progress / challenge.maxProgress) * 100}%` }}
                    transition={{ duration: 0.5 }}
                    className={`h-full rounded-full ${challenge.completed ? 'bg-success' : 'bg-primary'}`}
                  ></motion.div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default Achievements;
