import React, { useState } from "react";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";
import { 
  UsersIcon, 
  TrophyIcon, 
  MessageSquareIcon, 
  SearchIcon,
  ChevronRightIcon,
  PlusIcon,
  GlobeIcon,
  ShieldIcon,
  BoltIcon,
  UserPlusIcon
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Clans: React.FC = () => {
  const { t, dir } = useLanguage();
  const { toast } = useToast();
  const [userClan, setUserClan] = useState<any>(null);
  const [showCreateClan, setShowCreateClan] = useState(false);
  const [clanName, setClanName] = useState("");
  const [clanDescription, setClanDescription] = useState("");
  const [showClanDetails, setShowClanDetails] = useState(false);
  const [selectedClan, setSelectedClan] = useState<any>(null);
  const [joinRequested, setJoinRequested] = useState<number[]>([]);

  const clans = [
    {
      id: 1,
      name: "Crypto Warriors",
      tag: "CW",
      description: "A powerful mining clan focused on maximum efficiency and daily rewards.",
      level: 15,
      members: 32,
      maxMembers: 40,
      leader: "CryptoKing",
      logo: "🛡️",
      ranking: 3,
      weeklyEarnings: 12580,
      isOpen: true
    },
    {
      id: 2,
      name: "Diamond Hands",
      tag: "DIAM",
      description: "HODL and mine together for greater rewards. Never sell, only accumulate!",
      level: 22,
      members: 45,
      maxMembers: 45,
      leader: "SatoshiFan",
      logo: "💎",
      ranking: 1,
      weeklyEarnings: 28450,
      isOpen: false
    },
    {
      id: 3,
      name: "DeFi Miners",
      tag: "DFM",
      description: "Bringing decentralized finance principles to mining operations.",
      level: 18,
      members: 28,
      maxMembers: 50,
      leader: "DeFiGuru",
      logo: "🏦",
      ranking: 5,
      weeklyEarnings: 9820,
      isOpen: true
    },
    {
      id: 4,
      name: "Moon Crew",
      tag: "MOON",
      description: "We're not stopping until we reach the moon. Join our journey!",
      level: 12,
      members: 21,
      maxMembers: 30,
      leader: "MoonMan",
      logo: "🌙",
      ranking: 8,
      weeklyEarnings: 6750,
      isOpen: true
    }
  ];

  const handleCreateClan = () => {
    if (!clanName.trim()) {
      toast({
        title: t('clans.error'),
        description: t('clans.name.required'),
        variant: "destructive",
      });
      return;
    }

    const newClan = {
      id: 5,
      name: clanName,
      tag: clanName.split(' ').map(word => word[0]).join('').toUpperCase(),
      description: clanDescription,
      level: 1,
      members: 1,
      maxMembers: 20,
      leader: "CryptoWizard",
      logo: "⚡",
      ranking: 50,
      weeklyEarnings: 0,
      isOpen: true
    };

    setUserClan(newClan);
    setShowCreateClan(false);
    setClanName("");
    setClanDescription("");

    toast({
      title: t('clans.created'),
      description: t('clans.created.success', { name: clanName }),
      variant: "default",
    });
  };

  const openClanDetails = (clan: any) => {
    setSelectedClan(clan);
    setShowClanDetails(true);
  };

  const closeClanDetails = () => {
    setShowClanDetails(false);
    setSelectedClan(null);
  };

  const handleJoinRequest = (clanId: number) => {
    setJoinRequested([...joinRequested, clanId]);
    
    toast({
      title: t('clans.request.sent'),
      description: t('clans.request.waiting'),
      variant: "default",
    });
  };

  return (
    <div className="min-h-screen pb-20 bg-background" dir={dir()}>
      <TopBar />
      
      <main className="container max-w-md mx-auto pt-20 px-4">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-2xl font-bold mb-6 neon-text-primary"
        >
          {t('clans.title')}
        </motion.h1>
        
        {userClan ? (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="mb-6 bg-surface rounded-xl p-4 border border-surface-light"
          >
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center text-xl">
                  {userClan.logo}
                </div>
                <div className="ml-3">
                  <h2 className="text-lg font-semibold">{userClan.name}</h2>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <span className="bg-surface-light px-2 py-0.5 rounded mr-2">{userClan.tag}</span>
                    <TrophyIcon className="w-3 h-3 text-warning mr-1" /> Rank #{userClan.ranking}
                  </div>
                </div>
              </div>
              <span className="bg-primary/20 text-primary text-xs rounded-full px-2 py-1">
                {t('clans.level')} {userClan.level}
              </span>
            </div>
            
            <div className="grid grid-cols-3 gap-3 mb-3">
              <div className="bg-surface-light rounded-lg p-2">
                <p className="text-xs text-muted-foreground">{t('clans.members')}</p>
                <p className="font-medium">{userClan.members}/{userClan.maxMembers}</p>
              </div>
              <div className="bg-surface-light rounded-lg p-2">
                <p className="text-xs text-muted-foreground">{t('clans.earnings')}</p>
                <p className="font-medium">{userClan.weeklyEarnings} GT</p>
              </div>
              <div className="bg-surface-light rounded-lg p-2">
                <p className="text-xs text-muted-foreground">{t('clans.bonus')}</p>
                <p className="font-medium">+{Math.floor(userClan.level * 1.5)}%</p>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button className="flex-1 bg-primary/20 text-primary py-2 rounded-lg text-sm font-medium">
                <MessageSquareIcon className="w-4 h-4 inline mr-1" /> {t('clans.chat')}
              </button>
              <button className="flex-1 bg-surface-light py-2 rounded-lg text-sm font-medium">
                <UsersIcon className="w-4 h-4 inline mr-1" /> {t('clans.members')}
              </button>
            </div>
          </motion.section>
        ) : (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="mb-6 bg-surface rounded-xl p-4 border border-surface-light text-center"
          >
            <div className="w-16 h-16 rounded-full bg-surface-light flex items-center justify-center mx-auto mb-3">
              <UsersIcon className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-semibold mb-2">{t('clans.no.clan')}</h2>
            <p className="text-sm text-muted-foreground mb-4">{t('clans.benefits')}</p>
            
            <button 
              onClick={() => setShowCreateClan(true)}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-primary to-secondary text-white font-medium"
            >
              <PlusIcon className="w-5 h-5 inline mr-1" /> {t('clans.create')}
            </button>
          </motion.section>
        )}
        
        {/* Clan Rankings */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="mb-6"
        >
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold">{t('clans.rankings')}</h2>
            <div className="relative w-24">
              <input 
                type="text" 
                placeholder={t('clans.search')}
                className="w-full bg-surface-light text-xs rounded-full py-1 pl-7 pr-2"
              />
              <SearchIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-muted-foreground" />
            </div>
          </div>
          
          <div className="space-y-3">
            {clans.map((clan) => (
              <div 
                key={clan.id}
                onClick={() => openClanDetails(clan)}
                className="bg-surface rounded-lg border border-surface-light p-3 cursor-pointer hover:border-primary/40 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-lg mr-3">
                      {clan.logo}
                    </div>
                    <div>
                      <div className="flex items-center">
                        <h3 className="font-medium">{clan.name}</h3>
                        <span className="ml-2 bg-surface-light px-1.5 py-0.5 text-xs rounded">
                          {clan.tag}
                        </span>
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <TrophyIcon className="w-3 h-3 text-warning mr-1" /> 
                        Rank #{clan.ranking}
                        <span className="mx-1.5">•</span>
                        <UsersIcon className="w-3 h-3 mr-1" /> 
                        {clan.members}/{clan.maxMembers}
                      </div>
                    </div>
                  </div>
                  <ChevronRightIcon className="w-5 h-5 text-muted-foreground" />
                </div>
                
                <p className="text-xs text-muted-foreground truncate mb-2">{clan.description}</p>
                
                <div className="flex justify-between items-center">
                  <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded">
                    {t('clans.level')} {clan.level}
                  </span>
                  
                  <span className="text-xs">
                    {clan.weeklyEarnings.toLocaleString()} GT {t('clans.weekly')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.section>
      </main>
      
      {/* Create Clan Modal */}
      {showCreateClan && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-surface rounded-xl w-full max-w-sm border border-surface-light p-5"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{t('clans.create')}</h2>
              <button 
                onClick={() => setShowCreateClan(false)}
                className="w-8 h-8 rounded-full bg-surface-light flex items-center justify-center"
              >
                ✕
              </button>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">{t('clans.name')}</label>
              <input
                type="text"
                value={clanName}
                onChange={(e) => setClanName(e.target.value)}
                placeholder={t('clans.name.placeholder')}
                className="w-full bg-surface-light rounded-lg p-3 border border-surface-light focus:border-primary/50 outline-none"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">{t('clans.description')}</label>
              <textarea
                value={clanDescription}
                onChange={(e) => setClanDescription(e.target.value)}
                placeholder={t('clans.description.placeholder')}
                className="w-full bg-surface-light rounded-lg p-3 border border-surface-light focus:border-primary/50 outline-none resize-none h-24"
              />
            </div>
            
            <div className="mb-5">
              <label className="block text-sm font-medium mb-2">{t('clans.cost')}</label>
              <div className="bg-surface-light rounded-lg p-3 border border-surface-light">
                <div className="flex justify-between items-center">
                  <span>{t('clans.creation.fee')}</span>
                  <span className="font-medium">1,000 GT</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <button 
                onClick={handleCreateClan}
                className="w-full py-3 rounded-lg bg-gradient-to-r from-primary to-secondary text-white font-medium"
              >
                {t('clans.create')} (1,000 GT)
              </button>
              
              <button 
                onClick={() => setShowCreateClan(false)}
                className="w-full py-3 rounded-lg bg-surface-light text-foreground"
              >
                {t('clans.cancel')}
              </button>
            </div>
          </motion.div>
        </div>
      )}
      
      {/* Clan Details Modal */}
      {showClanDetails && selectedClan && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-surface rounded-xl w-full max-w-sm border border-surface-light p-5 max-h-[90vh] overflow-auto"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{selectedClan.name}</h2>
              <button 
                onClick={closeClanDetails}
                className="w-8 h-8 rounded-full bg-surface-light flex items-center justify-center"
              >
                ✕
              </button>
            </div>
            
            <div className="flex items-center justify-center mb-5">
              <div className="w-20 h-20 rounded-lg bg-primary/20 flex items-center justify-center text-4xl">
                {selectedClan.logo}
              </div>
            </div>
            
            <div className="bg-surface-light rounded-lg p-3 mb-4">
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center">
                  <span className="bg-background px-2 py-0.5 rounded text-xs mr-2">
                    {selectedClan.tag}
                  </span>
                  <span className="text-sm">
                    {t('clans.level')} {selectedClan.level}
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <TrophyIcon className="w-4 h-4 text-warning mr-1" />
                  Rank #{selectedClan.ranking}
                </div>
              </div>
              <p className="text-sm mb-3">{selectedClan.description}</p>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-xs text-muted-foreground">{t('clans.leader')}</p>
                  <p className="text-sm font-medium">{selectedClan.leader}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{t('clans.members')}</p>
                  <p className="text-sm font-medium">{selectedClan.members}/{selectedClan.maxMembers}</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="bg-surface-light rounded-lg p-3 flex flex-col items-center">
                <GlobeIcon className="w-5 h-5 text-primary mb-1" />
                <p className="text-xs text-center">{t('clans.global.rank')}</p>
                <p className="font-medium">#{selectedClan.ranking}</p>
              </div>
              
              <div className="bg-surface-light rounded-lg p-3 flex flex-col items-center">
                <BoltIcon className="w-5 h-5 text-primary mb-1" />
                <p className="text-xs text-center">{t('clans.earnings')}</p>
                <p className="font-medium">{selectedClan.weeklyEarnings.toLocaleString()}</p>
              </div>
              
              <div className="bg-surface-light rounded-lg p-3 flex flex-col items-center">
                <ShieldIcon className="w-5 h-5 text-primary mb-1" />
                <p className="text-xs text-center">{t('clans.bonus')}</p>
                <p className="font-medium">+{Math.floor(selectedClan.level * 1.5)}%</p>
              </div>
            </div>
            
            <div className="space-y-3">
              {!userClan && selectedClan.isOpen && !joinRequested.includes(selectedClan.id) && (
                <button 
                  onClick={() => handleJoinRequest(selectedClan.id)}
                  className="w-full py-3 rounded-lg bg-gradient-to-r from-primary to-secondary text-white font-medium"
                >
                  <UserPlusIcon className="w-5 h-5 inline mr-1" /> {t('clans.join')}
                </button>
              )}
              
              {!userClan && joinRequested.includes(selectedClan.id) && (
                <button 
                  disabled
                  className="w-full py-3 rounded-lg bg-surface-light text-muted-foreground font-medium"
                >
                  {t('clans.request.pending')}
                </button>
              )}
              
              {!userClan && !selectedClan.isOpen && (
                <button 
                  onClick={() => handleJoinRequest(selectedClan.id)}
                  className="w-full py-3 rounded-lg bg-gradient-to-r from-primary to-secondary text-white font-medium"
                >
                  <MessageSquareIcon className="w-5 h-5 inline mr-1" /> {t('clans.apply')}
                </button>
              )}
              
              <button 
                onClick={closeClanDetails}
                className="w-full py-3 rounded-lg bg-surface-light text-foreground"
              >
                {t('clans.close')}
              </button>
            </div>
          </motion.div>
        </div>
      )}
      
      <BottomNav />
    </div>
  );
};

export default Clans;