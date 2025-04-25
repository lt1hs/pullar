import React, { useState, useEffect } from "react";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";
import { 
  TrophyIcon, 
  Gamepad2Icon, 
  CoinsIcon, 
  ClockIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  XIcon,
  HelpCircleIcon
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Logo game configuration
const logoOptions = [
  { name: "Bitcoin", logo: "₿" },
  { name: "Ethereum", logo: "Ξ" },
  { name: "Litecoin", logo: "Ł" },
  { name: "Ripple", logo: "✗" },
  { name: "Monero", logo: "ɱ" },
  { name: "Binance", logo: "Ƀ" },
  { name: "Dogecoin", logo: "Ð" },
  { name: "Cardano", logo: "₳" },
  { name: "Polkadot", logo: "●" },
  { name: "Tether", logo: "₮" }
];

const Games: React.FC = () => {
  const { t, dir } = useLanguage();
  const { toast } = useToast();
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [logoGameState, setLogoGameState] = useState({
    score: 0,
    round: 0,
    maxRounds: 10,
    timeLeft: 10,
    isActive: false,
    currentLogo: { name: "", logo: "" },
    options: [] as string[],
    correct: 0,
    incorrect: 0,
    streak: 0
  });
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
  const [showGameOver, setShowGameOver] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  // List of available games
  const gamesList = [
    {
      id: "logo-quiz",
      name: t('games.logo.name'),
      description: t('games.logo.description'),
      icon: "₿",
      reward: "+25 GT",
      difficulty: "easy",
      color: "primary"
    },
    {
      id: "price-guess",
      name: t('games.price.name'),
      description: t('games.price.description'),
      icon: "📊",
      reward: "+40 GT",
      difficulty: "medium",
      color: "secondary"
    },
    {
      id: "memory-match",
      name: t('games.memory.name'),
      description: t('games.memory.description'),
      icon: "🎮",
      reward: "+60 GT",
      difficulty: "hard",
      color: "error"
    }
  ];

  // Prepare a new logo quiz round
  const prepareLogoRound = () => {
    const randomIndex = Math.floor(Math.random() * logoOptions.length);
    const correctLogo = logoOptions[randomIndex];
    
    // Generate 3 random options excluding the correct one
    const shuffled = logoOptions
      .filter(logo => logo.name !== correctLogo.name)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map(logo => logo.name);
    
    // Add correct answer and shuffle
    shuffled.push(correctLogo.name);
    shuffled.sort(() => 0.5 - Math.random());
    
    setLogoGameState(prev => ({
      ...prev,
      currentLogo: correctLogo,
      options: shuffled,
      timeLeft: 10
    }));
  };

  // Start the logo game
  const startLogoGame = () => {
    setLogoGameState({
      score: 0,
      round: 1,
      maxRounds: 10,
      timeLeft: 10,
      isActive: true,
      currentLogo: { name: "", logo: "" },
      options: [],
      correct: 0,
      incorrect: 0,
      streak: 0
    });
    setActiveGame("logo-quiz");
    setShowGameOver(false);
    prepareLogoRound();

    // Start timer
    const interval = setInterval(() => {
      setLogoGameState(prev => {
        if (prev.timeLeft <= 1) {
          // Time's up, move to next round or end game
          handleAnswer("");
          return prev;
        }
        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);
    
    setTimerInterval(interval);
  };

  // Handle user answer
  const handleAnswer = (answer: string) => {
    if (!logoGameState.isActive) return;
    
    const isCorrect = answer === logoGameState.currentLogo.name;
    const newStreak = isCorrect ? logoGameState.streak + 1 : 0;
    const streakBonus = Math.floor(newStreak / 3) * 5;
    const pointsEarned = isCorrect ? 10 + streakBonus : 0;
    
    if (isCorrect) {
      toast({
        title: t('games.correct'),
        description: `+${pointsEarned} ${t('games.points')}`,
        variant: "default",
      });
    } else if (answer !== "") { // Only show wrong answer toast if they actually selected (not timeout)
      toast({
        title: t('games.wrong'),
        description: t('games.correct.answer', { answer: logoGameState.currentLogo.name }),
        variant: "destructive",
      });
    }
    
    // Check if game is over
    if (logoGameState.round >= logoGameState.maxRounds) {
      endGame();
      return;
    }
    
    // Prepare next round
    setLogoGameState(prev => ({
      ...prev,
      score: prev.score + pointsEarned,
      round: prev.round + 1,
      correct: isCorrect ? prev.correct + 1 : prev.correct,
      incorrect: isCorrect ? prev.incorrect : prev.incorrect + 1,
      streak: newStreak
    }));
    
    prepareLogoRound();
  };

  // End the game
  const endGame = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
    
    setLogoGameState(prev => ({
      ...prev,
      isActive: false
    }));
    
    setShowGameOver(true);
    
    // Convert score to tokens
    const tokensEarned = Math.floor(logoGameState.score / 10);
    
    // Add tokens to user balance
    if (tokensEarned > 0) {
      toast({
        title: t('games.rewards.earned'),
        description: `${tokensEarned} ${t('games.tokens')}`,
        variant: "default",
      });
    }
  };

  // Exit current game
  const exitGame = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
    setActiveGame(null);
    setShowGameOver(false);
  };

  useEffect(() => {
    return () => {
      // Cleanup timer when component unmounts
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [timerInterval]);

  return (
    <div className="min-h-screen pb-20 bg-background" dir={dir()}>
      <TopBar />
      
      <main className="container max-w-md mx-auto pt-20 px-4">
        {!activeGame ? (
          <>
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-2xl font-bold mb-6 neon-text-primary"
            >
              {t('games.title')}
            </motion.h1>
            
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="mb-6 bg-surface rounded-xl p-4 border border-surface-light"
            >
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold">{t('games.stats')}</h2>
                <span className="text-xs text-muted-foreground">
                  {t('games.daily.limit')}: 5/5
                </span>
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-lg bg-surface-light p-3 flex flex-col items-center">
                  <TrophyIcon className="w-5 h-5 text-primary mb-1" />
                  <p className="text-xs text-muted-foreground">{t('games.best.score')}</p>
                  <p className="font-medium">860</p>
                </div>
                
                <div className="rounded-lg bg-surface-light p-3 flex flex-col items-center">
                  <Gamepad2Icon className="w-5 h-5 text-primary mb-1" />
                  <p className="text-xs text-muted-foreground">{t('games.played')}</p>
                  <p className="font-medium">12</p>
                </div>
                
                <div className="rounded-lg bg-surface-light p-3 flex flex-col items-center">
                  <CoinsIcon className="w-5 h-5 text-primary mb-1" />
                  <p className="text-xs text-muted-foreground">{t('games.rewards')}</p>
                  <p className="font-medium">240 GT</p>
                </div>
              </div>
            </motion.section>
            
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="mb-6"
            >
              <h2 className="text-lg font-semibold mb-3">{t('games.available')}</h2>
              
              <div className="space-y-3">
                {gamesList.map((game) => (
                  <motion.div 
                    key={game.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => game.id === "logo-quiz" ? startLogoGame() : {}}
                    className={`bg-surface rounded-lg border border-surface-light p-4 cursor-pointer hover:border-${game.color}/40 transition-colors`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <div className={`w-12 h-12 rounded-lg bg-${game.color}/20 flex items-center justify-center text-2xl mr-3`}>
                          {game.icon}
                        </div>
                        <div>
                          <h3 className="font-medium mb-1">{game.name}</h3>
                          <p className="text-xs text-muted-foreground">{game.description}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between mt-3">
                      <span className={`text-xs bg-${game.color}/20 text-${game.color} px-2 py-0.5 rounded`}>
                        {game.difficulty}
                      </span>
                      
                      <span className="text-xs text-primary font-medium">
                        {game.reward}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          </>
        ) : activeGame === "logo-quiz" ? (
          <div className="pt-2">
            {/* Game header */}
            <div className="flex justify-between items-center mb-6">
              <button 
                onClick={exitGame}
                className="w-8 h-8 rounded-full bg-surface-light flex items-center justify-center"
              >
                <ArrowLeftIcon className="w-4 h-4" />
              </button>
              
              <h2 className="text-lg font-bold">{t('games.logo.name')}</h2>
              
              <button 
                onClick={() => setShowInstructions(true)}
                className="w-8 h-8 rounded-full bg-surface-light flex items-center justify-center"
              >
                <HelpCircleIcon className="w-4 h-4" />
              </button>
            </div>
            
            {/* Game stats */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-4 gap-2 mb-6"
            >
              <div className="bg-surface-light rounded-lg p-2 text-center">
                <p className="text-xs text-muted-foreground">{t('games.score')}</p>
                <p className="font-medium">{logoGameState.score}</p>
              </div>
              
              <div className="bg-surface-light rounded-lg p-2 text-center">
                <p className="text-xs text-muted-foreground">{t('games.round')}</p>
                <p className="font-medium">{logoGameState.round}/{logoGameState.maxRounds}</p>
              </div>
              
              <div className="bg-surface-light rounded-lg p-2 text-center">
                <p className="text-xs text-muted-foreground">{t('games.streak')}</p>
                <p className="font-medium">{logoGameState.streak}x</p>
              </div>
              
              <div className="bg-surface-light rounded-lg p-2 text-center">
                <p className="text-xs text-muted-foreground">{t('games.time')}</p>
                <p className="font-medium">{logoGameState.timeLeft}s</p>
              </div>
            </motion.div>
            
            {/* Logo display */}
            {!showGameOver && (
              <>
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="bg-surface rounded-xl border border-surface-light p-8 mb-6"
                >
                  <div className="flex flex-col items-center">
                    <h3 className="text-sm text-muted-foreground mb-6">{t('games.logo.question')}</h3>
                    <div className="w-32 h-32 rounded-2xl bg-primary/20 flex items-center justify-center mb-4">
                      <span className="text-7xl text-primary">{logoGameState.currentLogo.logo}</span>
                    </div>
                    
                    {/* Timer bar */}
                    <div className="w-full h-2 bg-surface-light rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: '100%' }}
                        animate={{ width: `${(logoGameState.timeLeft / 10) * 100}%` }}
                        transition={{ duration: 0.3 }}
                        className="h-full bg-primary"
                      />
                    </div>
                  </div>
                </motion.div>
                
                {/* Answer options */}
                <div className="grid grid-cols-2 gap-3">
                  {logoGameState.options.map((option, index) => (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      onClick={() => handleAnswer(option)}
                      className="bg-surface-light hover:bg-primary/10 rounded-lg py-4 px-3 text-center transition-colors"
                    >
                      {option}
                    </motion.button>
                  ))}
                </div>
              </>
            )}
            
            {/* Game over screen */}
            {showGameOver && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-surface rounded-xl border border-surface-light p-6 text-center"
              >
                <h3 className="text-xl font-bold mb-2">{t('games.over')}</h3>
                <p className="text-muted-foreground mb-5">{t('games.final.score')}: {logoGameState.score}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-surface-light rounded-lg p-3">
                    <CheckIcon className="w-5 h-5 text-primary mx-auto mb-1" />
                    <p className="text-xs text-muted-foreground">{t('games.correct')}</p>
                    <p className="text-lg font-bold">{logoGameState.correct}</p>
                  </div>
                  
                  <div className="bg-surface-light rounded-lg p-3">
                    <XIcon className="w-5 h-5 text-error mx-auto mb-1" />
                    <p className="text-xs text-muted-foreground">{t('games.wrong')}</p>
                    <p className="text-lg font-bold">{logoGameState.incorrect}</p>
                  </div>
                </div>
                
                <div className="bg-primary/20 rounded-lg p-4 mb-6">
                  <p className="text-sm text-primary mb-1">{t('games.rewards.earned')}</p>
                  <p className="text-2xl font-bold">{Math.floor(logoGameState.score / 10)} GT</p>
                </div>
                
                <div className="space-y-3">
                  <button 
                    onClick={startLogoGame}
                    className="w-full py-3 rounded-lg bg-gradient-to-r from-primary to-secondary text-white font-medium"
                  >
                    {t('games.play.again')}
                  </button>
                  
                  <button 
                    onClick={exitGame}
                    className="w-full py-3 rounded-lg bg-surface-light text-foreground"
                  >
                    {t('games.back')}
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        ) : null}
      </main>
      
      {/* Instructions Modal */}
      {showInstructions && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-surface rounded-xl w-full max-w-sm border border-surface-light p-5"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{t('games.how.to.play')}</h2>
              <button 
                onClick={() => setShowInstructions(false)}
                className="w-8 h-8 rounded-full bg-surface-light flex items-center justify-center"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4 mb-5">
              <div className="flex">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                  <span className="font-bold">1</span>
                </div>
                <p className="flex-1">{t('games.instructions.1')}</p>
              </div>
              
              <div className="flex">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                  <span className="font-bold">2</span>
                </div>
                <p className="flex-1">{t('games.instructions.2')}</p>
              </div>
              
              <div className="flex">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                  <span className="font-bold">3</span>
                </div>
                <p className="flex-1">{t('games.instructions.3')}</p>
              </div>
              
              <div className="flex">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                  <span className="font-bold">4</span>
                </div>
                <p className="flex-1">{t('games.instructions.4')}</p>
              </div>
            </div>
            
            <button 
              onClick={() => setShowInstructions(false)}
              className="w-full py-3 rounded-lg bg-primary/20 text-primary font-medium"
            >
              {t('games.got.it')}
            </button>
          </motion.div>
        </div>
      )}
      
      <BottomNav />
    </div>
  );
};

export default Games;