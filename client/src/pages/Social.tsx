import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import { useUser } from "@/hooks/useUser";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, 
  Bell, 
  TrendingUp, 
  Sparkles,
  MessageCircle,
  Heart,
  Share,
  Search,
  Image,
  Smile,
  Link2,
  Award,
  Gift,
  Tag,
  Star,
  Clock,
  Zap,
  UserPlus,
  MessageSquare,
  ThumbsUp,
  Globe,
  HashIcon,
  Trophy,
  User,
  Plus,
  Shield,
  PieChart,
  Settings,
  Coins,
  Loader2,
  Cpu,
  BadgeDollarSign,
  ChevronRight,
  Calendar,
  Headphones,
  Mic,
  File,
  Monitor,
  MicOff,
  Volume2,
  VolumeX
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// Sample data for posts, challenges, and communities
const samplePosts = [
  {
    id: 1,
    user: {
      username: "CryptoWhale",
      avatar: null,
      verified: true,
      influenceScore: 87
    },
    content: "Just made 500 GCC from my new trading strategy! Anyone else seeing success with the swing trading approach?",
    image: null,
    timeAgo: "30 minutes ago",
    likes: 24,
    comments: 5,
    shares: 2
  },
  {
    id: 2,
    user: {
      username: "MiningPro",
      avatar: null,
      verified: false,
      influenceScore: 64
    },
    content: "Just upgraded my mining rig! Now getting 45 H/s with minimal power consumption. The new cooling system really helps! #MiningMastery",
    image: "/assets/mining-rig.jpg",
    timeAgo: "2 hours ago",
    likes: 18,
    comments: 3,
    shares: 1
  },
  {
    id: 3,
    user: {
      username: "CryptoTeacher",
      avatar: null,
      verified: true,
      influenceScore: 92
    },
    content: "Just launched my new mentorship program! Looking for 5 dedicated newcomers to guide through the basics of crypto trading. Comment below if interested! #CryptoMentor",
    image: null,
    timeAgo: "5 hours ago",
    likes: 42,
    comments: 15,
    shares: 7
  }
];

const communityChallenges = [
  {
    id: 1,
    title: "Mining Mastery Group",
    description: "Achieve a combined hash rate of 1000 H/s",
    progress: 67,
    members: 24,
    reward: "500 GCC + Rare Mining NFT",
    endsIn: "2 days"
  },
  {
    id: 2,
    title: "Top Traders Guild",
    description: "Execute 1000 profitable trades as a team",
    progress: 42,
    members: 18,
    reward: "0.05 ETH + Trading Badge NFT",
    endsIn: "5 days"
  }
];

const trendingCommunities = [
  {
    id: 1,
    name: "Crypto Mining Pros",
    members: 1287,
    category: "Mining",
    isJoined: true
  },
  {
    id: 2,
    name: "Trading Strategies",
    members: 842,
    category: "Trading",
    isJoined: false
  },
  {
    id: 3,
    name: "NFT Collectors",
    members: 653,
    category: "NFTs",
    isJoined: false
  }
];

const suggestedMentors = [
  {
    id: 1,
    username: "CryptoSage",
    specialty: "DeFi Trading",
    rating: 4.9,
    students: 76
  },
  {
    id: 2,
    username: "MiningMaster",
    specialty: "Mining Optimization",
    rating: 4.7,
    students: 54
  }
];

const upcomingEvents = [
  {
    id: 1,
    title: "Summer Mining Festival",
    date: "July 15-22",
    participants: 342
  },
  {
    id: 2,
    title: "Trading Tournament",
    date: "August 5-12",
    participants: 215
  }
];

const Social: React.FC = () => {
  const { user } = useUser();
  const { toast } = useToast();
  
  // State variables
  const [activeTab, setActiveTab] = useState("feed");
  const [postContent, setPostContent] = useState("");
  const [showMentorDialog, setShowMentorDialog] = useState(false);
  const [showChallengeDialog, setShowChallengeDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<any>(null);
  const [selectedMentor, setSelectedMentor] = useState<any>(null);
  
  // Room state variables
  const [activeRoom, setActiveRoom] = useState<any>(null);
  const [showRoomDialog, setShowRoomDialog] = useState(false);
  const [roomMessage, setRoomMessage] = useState("");
  const [micEnabled, setMicEnabled] = useState(false);
  const [speakerEnabled, setSpeakerEnabled] = useState(true);
  
  // Miner trading state
  const [showMinerTradingDialog, setShowMinerTradingDialog] = useState(false);
  const [selectedMiner, setSelectedMiner] = useState<any>(null);
  
  // Mini-game state
  const [showMiniGameDialog, setShowMiniGameDialog] = useState(false);
  const [selectedGame, setSelectedGame] = useState<string>("");
  const [gameProgress, setGameProgress] = useState<number>(0);
  
  // Token exchange state
  const [showTokenExchangeDialog, setShowTokenExchangeDialog] = useState(false);
  const [exchangeAmount, setExchangeAmount] = useState<string>("");
  const [exchangeType, setExchangeType] = useState<string>("buy");
  
  // Screen sharing state
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showScreenShareDialog, setShowScreenShareDialog] = useState(false);
  
  useEffect(() => {
    document.title = "CryptoVerse - Social Network";
  }, []);
  
  const handlePostSubmit = () => {
    if (!postContent.trim()) return;
    
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Post Published!",
        description: "Your post has been shared with the community",
      });
      setPostContent("");
      setLoading(false);
    }, 1000);
  };
  
  const handleLike = (postId: number) => {
    toast({
      title: "Post Liked!",
      description: "You earned 1 Social Token for engagement",
    });
  };
  
  const handleShare = (postId: number) => {
    toast({
      title: "Post Shared!",
      description: "You earned 2 Social Tokens for sharing",
    });
  };
  
  const handleJoinChallenge = (challenge: any) => {
    setSelectedChallenge(challenge);
    setShowChallengeDialog(true);
  };
  
  const handleConnectMentor = (mentor: any) => {
    setSelectedMentor(mentor);
    setShowMentorDialog(true);
  };
  
  const handleJoinRoom = (room: any) => {
    setActiveRoom(room);
    setShowRoomDialog(true);
    
    toast({
      title: "Joining Room",
      description: `You're joining ${room.name || 'the room'}`,
    });
  };
  
  const handleOpenMinerTrading = () => {
    setShowMinerTradingDialog(true);
    
    toast({
      title: "Miner Trading",
      description: "Opening the miner marketplace",
    });
  };
  
  const handleOpenMiniGame = (game: string) => {
    setSelectedGame(game);
    setShowMiniGameDialog(true);
    setGameProgress(0);
    
    toast({
      title: "Mini-Game",
      description: `Opening ${game}`,
    });
  };
  
  const handleOpenTokenExchange = (type: string) => {
    setExchangeType(type);
    setShowTokenExchangeDialog(true);
    setExchangeAmount("");
    
    toast({
      title: "Token Exchange",
      description: `Opening the token exchange`,
    });
  };
  
  const handleToggleScreenShare = () => {
    setShowScreenShareDialog(true);
    
    if (isScreenSharing) {
      setIsScreenSharing(false);
      toast({
        title: "Screen Sharing Stopped",
        description: "You've stopped sharing your screen",
      });
    } else {
      // In a real implementation, this would request screen sharing permissions
      setShowScreenShareDialog(true);
    }
  };
  
  const handleStartScreenShare = () => {
    setIsScreenSharing(true);
    setShowScreenShareDialog(false);
    
    toast({
      title: "Screen Sharing Started",
      description: "You are now sharing your screen with the room",
    });
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-background pb-20"
    >
      <TopBar />
      
      {/* Main Content */}
      <main className="mt-16 px-4 py-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="font-rajdhani font-bold text-3xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Social Hub</h1>
            <p className="text-muted-foreground text-sm">Connect, share, and earn with the community</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" className="h-9 w-9 rounded-full" aria-label="Search">
              <Search className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-9 w-9 rounded-full relative" aria-label="Notifications">
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 bg-primary h-5 w-5 rounded-full text-[10px] flex items-center justify-center text-primary-foreground font-medium">
                3
              </span>
            </Button>
            <Button variant="outline" size="icon" className="h-9 w-9 rounded-full" aria-label="Messages">
              <MessageSquare className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* User Stats Card */}
        <Card className="bg-surface border-none neon-border shadow-glow mb-6 overflow-hidden">
          <CardContent className="p-0">
            <div className="flex items-center p-4 gap-4">
              <Avatar className="h-16 w-16 border-2 border-primary">
                <AvatarFallback className="bg-primary/20 text-primary text-lg">
                  {user?.username?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
                {user?.avatar && <AvatarImage src={user.avatar} />}
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium text-lg">{user?.username || "User"}</h3>
                  <Badge className="bg-primary/20 text-primary hover:bg-primary/30">
                    <Star className="h-3 w-3 mr-1" /> Level 7
                  </Badge>
                </div>
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" /> 128 Connections
                  </span>
                  <span className="flex items-center gap-1">
                    <Award className="h-3 w-3" /> 450 Social Tokens
                  </span>
                </div>
              </div>
              
              <Button size="sm" className="bg-primary rounded-full">
                <Plus className="h-4 w-4 mr-1" /> 
                Edit Profile
              </Button>
            </div>
            
            <div className="grid grid-cols-3 border-t border-border/30">
              <div className="p-3 text-center hover:bg-surface-light transition-colors cursor-pointer">
                <div className="text-sm font-medium">42</div>
                <div className="text-xs text-muted-foreground">Posts</div>
              </div>
              <div className="p-3 text-center border-x border-border/30 hover:bg-surface-light transition-colors cursor-pointer">
                <div className="text-sm font-medium">3</div>
                <div className="text-xs text-muted-foreground">Active Challenges</div>
              </div>
              <div className="p-3 text-center hover:bg-surface-light transition-colors cursor-pointer">
                <div className="text-sm font-medium">8</div>
                <div className="text-xs text-muted-foreground">Achievements</div>
              </div>
            </div>
          </CardContent>
        </Card>
      
        {/* Main Tabs */}
        <Tabs defaultValue="feed" className="mb-6" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-6 mb-6 bg-surface-light p-1 rounded-xl">
            <TabsTrigger value="feed" className="data-[state=active]:neon-text-primary data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary/10 data-[state=active]:to-surface-light data-[state=active]:shadow-sm py-3 rounded-lg">
              <Sparkles className="mr-2 h-4 w-4" />
              Feed
            </TabsTrigger>
            <TabsTrigger value="discover" className="data-[state=active]:neon-text-primary data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary/10 data-[state=active]:to-surface-light data-[state=active]:shadow-sm py-3 rounded-lg">
              <Globe className="mr-2 h-4 w-4" />
              Discover
            </TabsTrigger>
            <TabsTrigger value="challenges" className="data-[state=active]:neon-text-primary data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary/10 data-[state=active]:to-surface-light data-[state=active]:shadow-sm py-3 rounded-lg">
              <Trophy className="mr-2 h-4 w-4" />
              Challenges
            </TabsTrigger>
            <TabsTrigger value="communities" className="data-[state=active]:neon-text-primary data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary/10 data-[state=active]:to-surface-light data-[state=active]:shadow-sm py-3 rounded-lg">
              <Users className="mr-2 h-4 w-4" />
              Groups
            </TabsTrigger>
            <TabsTrigger value="rooms" className="data-[state=active]:neon-text-primary data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary/10 data-[state=active]:to-surface-light data-[state=active]:shadow-sm py-3 rounded-lg">
              <MessageSquare className="mr-2 h-4 w-4" />
              Rooms
            </TabsTrigger>
            <TabsTrigger value="mentorship" className="data-[state=active]:neon-text-primary data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary/10 data-[state=active]:to-surface-light data-[state=active]:shadow-sm py-3 rounded-lg">
              <User className="mr-2 h-4 w-4" />
              Mentorship
            </TabsTrigger>
          </TabsList>
          
          {/* Feed Tab */}
          <TabsContent value="feed">
            {/* Create Post Card */}
            <Card className="bg-surface border-none neon-border shadow-glow mb-6">
              <CardContent className="pt-6">
                <div className="flex gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/20 text-primary">
                      {user?.username?.[0]?.toUpperCase() || "U"}
                    </AvatarFallback>
                    {user?.avatar && <AvatarImage src={user.avatar} />}
                  </Avatar>
                  
                  <div className="flex-1">
                    <Textarea 
                      placeholder="What's happening in the crypto world?"
                      className="mb-3 bg-surface-light resize-none min-h-[80px]"
                      value={postContent}
                      onChange={(e) => setPostContent(e.target.value)}
                    />
                    
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="text-xs bg-surface-light hover:bg-surface-light/80">
                          <Image className="h-3.5 w-3.5 mr-1.5" />
                          Image
                        </Button>
                        <Button variant="outline" size="sm" className="text-xs bg-surface-light hover:bg-surface-light/80">
                          <HashIcon className="h-3.5 w-3.5 mr-1.5" />
                          Tag
                        </Button>
                        <Button variant="outline" size="sm" className="text-xs bg-surface-light hover:bg-surface-light/80">
                          <Smile className="h-3.5 w-3.5 mr-1.5" />
                          Emoji
                        </Button>
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                      <Button 
                        size="sm"
                            disabled={!postContent.trim() || loading}
                        className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                      >
                            {loading ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                                Posting...
                              </>
                            ) : (
                              <>
                                <Sparkles className="h-4 w-4 mr-1.5" />
                                Post
                              </>
                            )}
                      </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={handlePostSubmit}>
                            <Sparkles className="h-4 w-4 mr-2" />
                            <span>Post (Free)</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={handlePostSubmit}>
                            <Zap className="h-4 w-4 mr-2 text-primary" />
                            <span>Boost Post (10 GCC)</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Post Feed */}
            <div className="space-y-6">
              {samplePosts.map((post) => (
                <Card key={post.id} className="bg-surface border-none neon-border shadow-glow overflow-hidden">
              <CardContent className="pt-6">
                <div className="flex gap-3 mb-3">
                  <Avatar>
                        <AvatarFallback className="bg-primary/20 text-primary">
                          {post.user.username[0].toUpperCase()}
                        </AvatarFallback>
                  </Avatar>
                  
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                    <div className="flex items-center">
                            <span className="font-medium">{post.user.username}</span>
                            {post.user.verified && (
                              <Badge className="ml-1 h-5 px-1.5 bg-primary">
                        <svg className="h-3 w-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </Badge>
                            )}
                    </div>
                          
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="bg-primary/5 px-2 py-0 h-5 border-primary/20">
                              <Award className="h-3 w-3 text-primary mr-1" />
                              <span className="text-xs">{post.user.influenceScore}</span>
                            </Badge>
                            
                            <span className="text-xs text-muted-foreground">{post.timeAgo}</span>
                  </div>
                </div>
                
                        <p className="mt-2 text-sm">{post.content}</p>
                        
                        {post.image && (
                          <div className="mt-3 rounded-lg overflow-hidden">
                            <img src={post.image} alt="Post attachment" className="w-full h-auto max-h-[300px] object-cover" />
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-1">
                        <Badge className="bg-primary/10 text-primary border-none">
                          <Heart className="h-3 w-3 mr-1" />
                          {post.likes}
                        </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{post.comments} comments</span>
                        <span>{post.shares} shares</span>
                  </div>
                </div>
                
                    <div className="flex mt-3 pt-3 border-t border-border/30">
                  <Button
                    variant="ghost"
                    size="sm"
                        className="flex-1 flex items-center justify-center hover:bg-primary/5 hover:text-primary"
                        onClick={() => handleLike(post.id)}
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    Like
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                        className="flex-1 flex items-center justify-center hover:bg-primary/5 hover:text-primary"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Comment
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                        className="flex-1 flex items-center justify-center hover:bg-primary/5 hover:text-primary"
                        onClick={() => handleShare(post.id)}
                  >
                    <Share className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex-1 flex items-center justify-center hover:bg-primary/5 hover:text-primary"
                      >
                        <Gift className="h-4 w-4 mr-2" />
                        Gift
                  </Button>
                </div>
              </CardContent>
            </Card>
              ))}
            </div>
          </TabsContent>
          
          {/* Discover Tab */}
          <TabsContent value="discover">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                <Card className="bg-surface border-none neon-border shadow-glow">
                  <CardHeader className="pb-3 border-b border-border/30">
                    <CardTitle className="text-lg font-medium flex items-center gap-2">
                      <Globe className="h-5 w-5 text-primary" />
                      Trending Topics
                    </CardTitle>
                    <CardDescription>
                      Popular discussions in the community
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-3">
                      {["#MiningMastery", "#CryptoTrading", "#NFTCollectors", "#DeFiYield", "#GamersUnite"].map((tag, index) => (
                        <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-surface-light transition-colors cursor-pointer">
                          <div className="flex items-center gap-3">
                            <Badge className="bg-primary/10 text-primary border-none h-8 w-8 rounded-full flex items-center justify-center p-0">
                              {index + 1}
                            </Badge>
                            <div>
                              <div className="font-medium">{tag}</div>
                              <div className="text-xs text-muted-foreground">{1000 - (index * 125)} posts</div>
                            </div>
                          </div>
                          <Button size="sm" variant="outline" className="text-xs border-primary/30 text-primary">
                            Follow
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              
                <Card className="bg-surface border-none neon-border shadow-glow">
                  <CardHeader className="pb-3 border-b border-border/30">
                    <CardTitle className="text-lg font-medium flex items-center gap-2">
                      <Award className="h-5 w-5 text-primary" />
                      Popular Posts
                    </CardTitle>
                    <CardDescription>
                      Most engaged content from the last 24 hours
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-4">
                      {samplePosts.slice(0, 2).map((post, index) => (
                        <div key={index} className="p-3 rounded-lg hover:bg-surface-light transition-colors cursor-pointer border border-border/30">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-primary/20 text-primary">
                                  {post.user.username[0].toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                  <div>
                    <div className="flex items-center">
                                  <span className="font-medium text-sm">{post.user.username}</span>
                                  {post.user.verified && (
                                    <Badge className="ml-1 h-4 px-1 bg-primary">
                                      <svg className="h-2.5 w-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                      </svg>
                                    </Badge>
                                  )}
                    </div>
                                <div className="text-xs text-muted-foreground">{post.timeAgo}</div>
                  </div>
                </div>
                
                            <Badge className="bg-primary/10 text-primary border-none">
                              <ThumbsUp className="h-3 w-3 mr-1" />
                              {post.likes + (index * 15)}
                            </Badge>
                          </div>
                          
                          <p className="text-sm line-clamp-2">{post.content}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="space-y-6">
                <Card className="bg-surface border-none neon-border shadow-glow">
                  <CardHeader className="pb-3 border-b border-border/30">
                    <CardTitle className="text-lg font-medium flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      Trending Communities
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-4">
                    {trendingCommunities.map((community) => (
                      <div key={community.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-primary/20 text-primary font-medium">
                              {community.name.split(' ').map(word => word[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-sm">{community.name}</div>
                            <div className="text-xs text-muted-foreground">{community.members} members</div>
                          </div>
                        </div>
                        <Button size="sm" variant={community.isJoined ? "default" : "outline"} className={
                          community.isJoined 
                            ? "bg-primary/20 text-primary hover:bg-primary/30" 
                            : "border-primary/30 text-primary"
                        }>
                          {community.isJoined ? "Joined" : "Join"}
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
                
                <Card className="bg-surface border-none neon-border shadow-glow">
                  <CardHeader className="pb-3 border-b border-border/30">
                    <CardTitle className="text-lg font-medium flex items-center gap-2">
                      <Clock className="h-5 w-5 text-primary" />
                      Upcoming Events
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-4">
                    {upcomingEvents.map((event) => (
                      <div key={event.id} className="bg-surface-light p-3 rounded-lg">
                        <div className="font-medium">{event.title}</div>
                        <div className="flex items-center justify-between mt-1">
                          <div className="text-xs text-muted-foreground">{event.date}</div>
                          <Badge variant="outline" className="text-xs bg-primary/5 border-primary/20">
                            <Users className="h-3 w-3 mr-1 text-primary" />
                            {event.participants}
                          </Badge>
                        </div>
                        <Button size="sm" className="mt-2 w-full text-xs bg-primary/10 text-primary hover:bg-primary/20">
                          Join Event
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          {/* Challenges Tab */}
          <TabsContent value="challenges">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <Card className="bg-surface border-none neon-border shadow-glow mb-6">
                  <CardHeader className="pb-3 border-b border-border/30">
                    <CardTitle className="text-lg font-medium flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-primary" />
                      Active Community Challenges
                    </CardTitle>
                    <CardDescription>
                      Join forces with others to earn rewards
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-5">
                      {communityChallenges.map((challenge) => (
                        <div key={challenge.id} className="border border-border/30 rounded-lg overflow-hidden">
                          <div className="bg-gradient-to-r from-primary/10 to-transparent p-4">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h3 className="font-medium text-base">{challenge.title}</h3>
                                <p className="text-sm text-muted-foreground">{challenge.description}</p>
                              </div>
                              <Badge className="bg-primary/20 text-primary border-none">
                                <Clock className="h-3 w-3 mr-1" />
                                {challenge.endsIn}
                              </Badge>
                            </div>
                            
                            <div className="flex items-center justify-between mb-2 mt-3">
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-primary" />
                                <span className="text-sm">{challenge.members} participants</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Gift className="h-4 w-4 text-primary" />
                                <span className="text-sm">{challenge.reward}</span>
                              </div>
                            </div>
                            
                            <div className="mt-3">
                              <div className="flex justify-between text-xs mb-1">
                                <span>Progress</span>
                                <span className="text-primary font-medium">{challenge.progress}%</span>
                              </div>
                              <Progress value={challenge.progress} className="h-2" />
                            </div>
                          </div>
                          
                          <div className="p-3 flex justify-end bg-surface-light">
                            <Button 
                              className="bg-gradient-to-r from-primary to-secondary shadow-glow text-white"
                              size="sm"
                              onClick={() => handleJoinChallenge(challenge)}
                            >
                              Join Challenge
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-surface border-none neon-border shadow-glow">
                  <CardHeader className="pb-3 border-b border-border/30">
                    <CardTitle className="text-lg font-medium flex items-center gap-2">
                      <Star className="h-5 w-5 text-primary" />
                      Challenge Leaderboard
                    </CardTitle>
                    <CardDescription>
                      Top performers in current challenges
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-3">
                      {[
                        { username: "CryptoElite", points: 2450, rank: 1 },
                        { username: "BlockchainMaster", points: 2130, rank: 2 },
                        { username: "MiningGuru", points: 1975, rank: 3 },
                        { username: "TradeWizard", points: 1840, rank: 4 },
                        { username: "TokenCollector", points: 1690, rank: 5 }
                      ].map((user, index) => (
                        <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-surface-light border border-border/10">
                          <div className="flex items-center gap-3">
                            <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                              user.rank === 1 
                                ? 'bg-gradient-to-r from-yellow-500 to-amber-400'
                                : user.rank === 2
                                  ? 'bg-gradient-to-r from-slate-400 to-slate-300'
                                  : user.rank === 3
                                    ? 'bg-gradient-to-r from-amber-700 to-amber-600'
                                    : 'bg-primary/20 text-primary'
                            }`}>
                              {user.rank}
                            </div>
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-primary/10 text-primary">
                                {user.username[0].toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="font-medium text-sm">{user.username}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-primary/10 text-primary border-none">
                              <Trophy className="h-3 w-3 mr-1" />
                              {user.points}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="space-y-6">
                <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-none neon-border shadow-glow">
                  <CardHeader>
                    <CardTitle className="text-lg font-medium">Create a Challenge</CardTitle>
                    <CardDescription>
                      Start your own team challenge
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Challenge Types</h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 p-2 rounded-lg border border-border/30 hover:bg-surface-light cursor-pointer">
                            <Cpu className="h-4 w-4 text-primary" />
                            <div className="text-sm">Mining Challenge</div>
                          </div>
                          <div className="flex items-center gap-2 p-2 rounded-lg border border-border/30 hover:bg-surface-light cursor-pointer">
                            <TrendingUp className="h-4 w-4 text-primary" />
                            <div className="text-sm">Trading Challenge</div>
                          </div>
                          <div className="flex items-center gap-2 p-2 rounded-lg border border-border/30 hover:bg-surface-light cursor-pointer">
                            <Coins className="h-4 w-4 text-primary" />
                            <div className="text-sm">Staking Challenge</div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-2">Requirements</h4>
                        <div className="text-sm text-muted-foreground p-3 bg-surface rounded-lg">
                          <ul className="space-y-1 list-disc pl-4">
                            <li>At least 500 GCC tokens</li>
                            <li>Minimum 5 participants</li>
                            <li>Challenge duration: 1-30 days</li>
                          </ul>
                        </div>
                      </div>
                      
                      <Button className="w-full bg-gradient-to-r from-primary to-secondary text-white">
                        Start Creating
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-surface border-none neon-border shadow-glow">
                  <CardHeader className="pb-3 border-b border-border/30">
                    <CardTitle className="text-lg font-medium flex items-center gap-2">
                      <Award className="h-5 w-5 text-primary" />
                      Your Challenge Rewards
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-3">
                      <div className="bg-surface-light p-3 rounded-lg flex items-center gap-3 border border-border/20">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                          <Trophy className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <div className="text-sm font-medium">Mining Master NFT</div>
                          <div className="text-xs text-muted-foreground">Earned from Mining Challenge</div>
                        </div>
                      </div>
                      
                      <div className="bg-surface-light p-3 rounded-lg flex items-center gap-3 border border-border/20">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                          <BadgeDollarSign className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <div className="text-sm font-medium">250 GCC Tokens</div>
                          <div className="text-xs text-muted-foreground">From Trading Challenge</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          {/* Communities Tab */}
          <TabsContent value="communities">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                <Card className="bg-surface border-none neon-border shadow-glow">
                  <CardHeader className="pb-3 border-b border-border/30">
                    <CardTitle className="text-lg font-medium flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      Your Communities
                    </CardTitle>
                    <CardDescription>
                      Groups you've joined and are part of
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { 
                          id: 1, 
                          name: "Crypto Mining Pros", 
                          members: 1287,
                          newPosts: 3,
                          banner: "/assets/mining-banner.jpg"
                        },
                        { 
                          id: 2, 
                          name: "Blockchain Developers", 
                          members: 842,
                          newPosts: 0,
                          banner: "/assets/blockchain-banner.jpg"
                        },
                        { 
                          id: 3, 
                          name: "Trading Strategies", 
                          members: 653,
                          newPosts: 5,
                          banner: "/assets/trading-banner.jpg"
                        },
                        { 
                          id: 4, 
                          name: "NFT Collectors", 
                          members: 1125,
                          newPosts: 12,
                          banner: "/assets/nft-banner.jpg"
                        }
                      ].map((community) => (
                        <div key={community.id} className="border border-border/30 rounded-lg overflow-hidden hover:border-primary/30 transition-colors cursor-pointer">
                          <div className="h-20 bg-gradient-to-r from-primary/30 to-secondary/30 relative">
                            {community.newPosts > 0 && (
                              <Badge className="absolute top-2 right-2 bg-primary">
                                {community.newPosts} new
                              </Badge>
                            )}
                          </div>
                          <div className="p-3">
                            <h3 className="font-medium">{community.name}</h3>
                            <div className="flex items-center justify-between mt-1">
                              <div className="text-xs text-muted-foreground">{community.members} members</div>
                              <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                                <ChevronRight className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-surface border-none neon-border shadow-glow">
                  <CardHeader className="pb-3 border-b border-border/30">
                    <CardTitle className="text-lg font-medium flex items-center gap-2">
                      <Globe className="h-5 w-5 text-primary" />
                      Discover Communities
                    </CardTitle>
                    <CardDescription>
                      Popular groups you might be interested in
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-4">
                      {[
                        { 
                          name: "DeFi Strategies", 
                          members: 785,
                          description: "Discussion of yield farming, liquidity pools, and DeFi opportunities",
                          category: "Finance"
                        },
                        { 
                          name: "GameFi Alliance", 
                          members: 1243,
                          description: "Exploring the intersection of gaming and finance in blockchain",
                          category: "Gaming"
                        },
                        { 
                          name: "Crypto Tax Professionals", 
                          members: 456,
                          description: "Help with navigating crypto taxes and regulations",
                          category: "Finance"
                        }
                      ].map((community, index) => (
                        <div key={index} className="flex justify-between items-start p-4 border border-border/30 rounded-lg">
                          <div className="flex items-start gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback className="bg-primary/20 text-primary font-medium">
                                {community.name.split(' ').map(word => word[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{community.name}</div>
                              <div className="flex items-center gap-2 mt-0.5">
                                <Badge variant="outline" className="text-xs bg-primary/5 border-primary/20 font-normal">
                                  {community.category}
                                </Badge>
                                <span className="text-xs text-muted-foreground">{community.members} members</span>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">{community.description}</p>
                            </div>
                          </div>
                          <Button size="sm" className="bg-primary/10 text-primary hover:bg-primary/20 min-w-[80px]">
                            <UserPlus className="h-4 w-4 mr-1.5" />
                            Join
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="space-y-6">
                <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-none neon-border shadow-glow">
                  <CardHeader>
                    <CardTitle className="text-lg font-medium">Create Community</CardTitle>
                    <CardDescription>
                      Start your own group with like-minded individuals
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Community Types</h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 p-2 rounded-lg border border-border/30 hover:bg-surface-light cursor-pointer">
                            <Globe className="h-4 w-4 text-primary" />
                            <div className="text-sm">Public Community</div>
                          </div>
                          <div className="flex items-center gap-2 p-2 rounded-lg border border-border/30 hover:bg-surface-light cursor-pointer">
                            <Shield className="h-4 w-4 text-primary" />
                            <div className="text-sm">Private Community</div>
                          </div>
                          <div className="flex items-center gap-2 p-2 rounded-lg border border-border/30 hover:bg-surface-light cursor-pointer">
                            <Award className="h-4 w-4 text-primary" />
                            <div className="text-sm">Premium Community</div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-2">Requirements</h4>
                        <div className="text-sm text-muted-foreground p-3 bg-surface rounded-lg">
                          <ul className="space-y-1 list-disc pl-4">
                            <li>At least 1000 GCC tokens to create</li>
                            <li>Verification to create Premium groups</li>
                            <li>Adhere to community guidelines</li>
                          </ul>
                        </div>
                      </div>
                      
                      <Button className="w-full bg-gradient-to-r from-primary to-secondary text-white">
                        Create Community
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-surface border-none neon-border shadow-glow">
                  <CardHeader className="pb-3 border-b border-border/30">
                    <CardTitle className="text-lg font-medium flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      Community Highlights
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-3">
                      <div className="p-3 bg-surface-light rounded-lg border border-border/20">
                        <Badge className="mb-2 bg-primary/10 text-primary border-none">Upcoming Event</Badge>
                        <h4 className="font-medium text-sm">Weekly Trading Analysis</h4>
                        <p className="text-xs text-muted-foreground mb-2">Join expert traders for market insights</p>
                <div className="flex items-center justify-between">
                          <span className="text-xs font-medium">Tomorrow, 2PM</span>
                          <Button size="sm" variant="outline" className="h-7 text-xs border-primary/30 text-primary">
                            Remind me
                          </Button>
                        </div>
                  </div>
                  
                      <div className="p-3 bg-surface-light rounded-lg border border-border/20">
                        <Badge className="mb-2 bg-blue-500/10 text-blue-500 border-none">Poll</Badge>
                        <h4 className="font-medium text-sm">Which crypto will perform best in Q3?</h4>
                        <div className="space-y-2 mt-2">
                          <div className="flex items-center justify-between gap-3">
                            <div className="text-xs">Bitcoin</div>
                            <div className="flex-1">
                              <Progress value={45} className="h-1.5" />
                  </div>
                            <div className="text-xs font-medium">45%</div>
                </div>
                          <div className="flex items-center justify-between gap-3">
                            <div className="text-xs">Ethereum</div>
                            <div className="flex-1">
                              <Progress value={30} className="h-1.5" />
                            </div>
                            <div className="text-xs font-medium">30%</div>
                          </div>
                          <div className="flex items-center justify-between gap-3">
                            <div className="text-xs">Solana</div>
                            <div className="flex-1">
                              <Progress value={15} className="h-1.5" />
                            </div>
                            <div className="text-xs font-medium">15%</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          {/* Rooms Tab */}
          <TabsContent value="rooms">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left Column - Room listings and discovery */}
              <div className="md:col-span-2 space-y-6">
                <Card className="bg-surface border-none neon-border shadow-glow">
                  <CardHeader className="pb-3 border-b border-border/30">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg font-medium flex items-center gap-2">
                          <MessageSquare className="h-5 w-5 text-primary" />
                          Active Rooms
                        </CardTitle>
                        <CardDescription>
                          Join live discussions and events
                        </CardDescription>
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button className="bg-gradient-to-r from-primary to-secondary text-white shadow-glow">
                            <Plus className="h-4 w-4 mr-1.5" />
                            Create Room
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-surface border-none sm:max-w-[500px]">
                          <DialogHeader>
                            <DialogTitle>Create New Room</DialogTitle>
                            <DialogDescription>
                              Set up a custom room for discussions, trading, or events
                            </DialogDescription>
                          </DialogHeader>
                          
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Room Name</label>
                              <Input placeholder="Enter room name..." />
                            </div>
                            
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Description</label>
                              <Textarea placeholder="What's this room about?" />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <label className="text-sm font-medium">Room Type</label>
                                <select className="w-full h-10 rounded-md border border-border bg-background px-3 py-2 text-sm">
                                  <option value="public">Public</option>
                                  <option value="private">Private (Invite Only)</option>
                                </select>
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium">Category</label>
                                <select className="w-full h-10 rounded-md border border-border bg-background px-3 py-2 text-sm">
                                  <option value="trading">Trading</option>
                                  <option value="mining">Mining</option>
                                  <option value="gaming">Gaming</option>
                                  <option value="defi">DeFi</option>
                                  <option value="nft">NFTs</option>
                                </select>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Entry Requirements</label>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center space-x-2">
                                  <input type="checkbox" id="token-required" className="h-4 w-4" />
                                  <label htmlFor="token-required" className="text-sm">Token Required</label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <input type="checkbox" id="nft-required" className="h-4 w-4" />
                                  <label htmlFor="nft-required" className="text-sm">NFT Required</label>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-4 mt-2">
                                <div className="space-y-1">
                                  <label className="text-xs">In-app Tokens (GCC)</label>
                                  <Input placeholder="0" type="number" min="0" />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-xs">On-chain Tokens (ETH)</label>
                                  <Input placeholder="0" type="number" min="0" step="0.001" />
                                </div>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Room Features</label>
                              <div className="grid grid-cols-2 gap-2">
                                <div className="flex items-center space-x-2">
                                  <input type="checkbox" id="voice-chat" className="h-4 w-4" checked />
                                  <label htmlFor="voice-chat" className="text-sm">Voice Chat</label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <input type="checkbox" id="token-exchange" className="h-4 w-4" />
                                  <label htmlFor="token-exchange" className="text-sm">Token Exchange</label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <input type="checkbox" id="file-sharing" className="h-4 w-4" />
                                  <label htmlFor="file-sharing" className="text-sm">File Sharing</label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <input type="checkbox" id="miner-trading" className="h-4 w-4" />
                                  <label htmlFor="miner-trading" className="text-sm">Miner Trading</label>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <DialogFooter>
                            <Button variant="outline">Cancel</Button>
                            <Button className="bg-gradient-to-r from-primary to-secondary text-white">Create Room</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-4">
                      {/* Live Trading Room */}
                      <div className="border border-border/30 rounded-lg overflow-hidden hover:border-primary/30 transition-colors">
                        <div className="bg-gradient-to-r from-primary/10 to-transparent p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10 border-2 border-primary">
                                <AvatarFallback className="bg-primary/10 text-primary font-medium">
                                  TT
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="font-medium">Trading Tactics</h3>
                                  <Badge className="bg-green-500/20 text-green-500 border-none">Live</Badge>
                                </div>
                                <p className="text-xs text-muted-foreground">Advanced chart analysis and live trading</p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Badge variant="outline" className="bg-primary/5 border-primary/20">
                                <Users className="h-3 w-3 text-primary mr-1" />
                                42
                              </Badge>
                              <Badge variant="outline" className="bg-primary/5 border-primary/20">
                                <Coins className="h-3 w-3 text-primary mr-1" />
                                50 GCC
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 mt-3">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="bg-primary/10 text-primary text-xs">CT</AvatarFallback>
                            </Avatar>
                            <span className="text-xs font-medium">CryptoTrader</span>
                            <span className="text-xs text-muted-foreground">is presenting</span>
                          </div>
                        </div>
                        
                        <div className="p-3 flex justify-between items-center bg-surface-light">
                          <div className="flex items-center gap-3">
                            <Badge className="bg-primary/10 text-primary border-none">
                              <MessageCircle className="h-3 w-3 mr-1" />
                              Trading
                            </Badge>
                            <span className="text-xs text-muted-foreground">Started 45 min ago</span>
                          </div>
                  <Button
                            className="bg-gradient-to-r from-primary to-secondary text-white shadow-glow"
                    size="sm"
                            onClick={() => handleJoinRoom({
                              name: "Trading Tactics",
                              description: "Advanced chart analysis and live trading",
                              category: "Trading",
                              startedAgo: "45 min ago",
                              participants: 42
                            })}
                          >
                            Join Room
                  </Button>
                        </div>
                      </div>
                      
                      {/* Mining Masterclass Room */}
                      <div className="border border-border/30 rounded-lg overflow-hidden hover:border-primary/30 transition-colors">
                        <div className="bg-gradient-to-r from-primary/10 to-transparent p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10 border-2 border-primary">
                                <AvatarFallback className="bg-primary/10 text-primary font-medium">
                                  MM
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="font-medium">Mining Masterclass</h3>
                                  <Badge className="bg-blue-500/20 text-blue-500 border-none">Premium</Badge>
                                </div>
                                <p className="text-xs text-muted-foreground">Optimize your mining rigs for maximum efficiency</p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Badge variant="outline" className="bg-primary/5 border-primary/20">
                                <Users className="h-3 w-3 text-primary mr-1" />
                                28
                              </Badge>
                              <Badge variant="outline" className="bg-primary/5 border-primary/20">
                                <BadgeDollarSign className="h-3 w-3 text-primary mr-1" />
                                0.01 ETH
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 mt-3">
                            <div className="flex -space-x-2">
                              <Avatar className="h-6 w-6 border border-background">
                                <AvatarFallback className="bg-primary/10 text-primary text-xs">M1</AvatarFallback>
                              </Avatar>
                              <Avatar className="h-6 w-6 border border-background">
                                <AvatarFallback className="bg-primary/10 text-primary text-xs">M2</AvatarFallback>
                              </Avatar>
                              <Avatar className="h-6 w-6 border border-background">
                                <AvatarFallback className="bg-primary/10 text-primary text-xs">M3</AvatarFallback>
                              </Avatar>
                            </div>
                            <span className="text-xs text-muted-foreground">3 friends are in this room</span>
                          </div>
                        </div>
                        
                        <div className="p-3 flex justify-between items-center bg-surface-light">
                          <div className="flex items-center gap-3">
                            <Badge className="bg-primary/10 text-primary border-none">
                              <Cpu className="h-3 w-3 mr-1" />
                              Mining
                            </Badge>
                            <span className="text-xs text-muted-foreground">Includes miner trading</span>
                          </div>
                  <Button
                            className="bg-gradient-to-r from-primary to-secondary text-white shadow-glow"
                    size="sm"
                            onClick={() => handleJoinRoom({
                              name: "Mining Masterclass",
                              description: "Optimize your mining rigs for maximum efficiency",
                              category: "Mining",
                              startedAgo: "2 hours ago",
                              participants: 28
                            })}
                          >
                            Join Room
                  </Button>
                        </div>
                      </div>
                      
                      {/* Gaming Challenge Room */}
                      <div className="border border-border/30 rounded-lg overflow-hidden hover:border-primary/30 transition-colors">
                        <div className="bg-gradient-to-r from-primary/10 to-transparent p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10 border-2 border-primary">
                                <AvatarFallback className="bg-primary/10 text-primary font-medium">
                                  GC
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="font-medium">Gaming Challenge</h3>
                                  <Badge className="bg-amber-500/20 text-amber-500 border-none">Contest</Badge>
                                </div>
                                <p className="text-xs text-muted-foreground">Win tokens in crypto trivia and mini-games</p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Badge variant="outline" className="bg-primary/5 border-primary/20">
                                <Users className="h-3 w-3 text-primary mr-1" />
                                67
                              </Badge>
                              <Badge variant="outline" className="bg-primary/5 border-primary/20">
                                <Gift className="h-3 w-3 text-primary mr-1" />
                                Free
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 mt-3">
                            <Trophy className="h-4 w-4 text-amber-500" />
                            <span className="text-xs text-muted-foreground">Prize pool: 1000 GCC + 0.05 ETH</span>
                          </div>
                        </div>
                        
                        <div className="p-3 flex justify-between items-center bg-surface-light">
                          <div className="flex items-center gap-3">
                            <Badge className="bg-primary/10 text-primary border-none">
                              <Sparkles className="h-3 w-3 mr-1" />
                              Gaming
                            </Badge>
                            <span className="text-xs text-muted-foreground">Starts in 15 minutes</span>
                          </div>
                  <Button
                            className="bg-gradient-to-r from-primary to-secondary text-white shadow-glow"
                    size="sm"
                            onClick={() => handleJoinRoom({
                              name: "Gaming Challenge",
                              description: "Win tokens in crypto trivia and mini-games",
                              category: "Gaming",
                              startedAgo: "Just started",
                              participants: 67
                            })}
                          >
                            Join Room
                  </Button>
                        </div>
                      </div>
                </div>
              </CardContent>
            </Card>
                
                <Card className="bg-surface border-none neon-border shadow-glow">
                  <CardHeader className="pb-3 border-b border-border/30">
                    <CardTitle className="text-lg font-medium flex items-center gap-2">
                      <Globe className="h-5 w-5 text-primary" />
                      Featured Rooms
                    </CardTitle>
                    <CardDescription>
                      Popular spaces with active discussions
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="border border-border/30 rounded-lg p-4 hover:bg-surface-light transition-colors">
                        <div className="flex items-center gap-3 mb-3">
                          <Avatar>
                            <AvatarFallback className="bg-primary/10 text-primary">DF</AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium">DeFi Fundamentals</h4>
                            <div className="text-xs text-muted-foreground">Beginner-friendly DeFi discussions</div>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <Badge variant="outline" className="bg-primary/5 border-primary/20">
                            <Users className="h-3 w-3 text-primary mr-1" />
                            124
                          </Badge>
                          <Button size="sm" variant="outline" className="h-7 border-primary/30 text-primary text-xs">
                            Preview
                          </Button>
                        </div>
                      </div>
                      
                      <div className="border border-border/30 rounded-lg p-4 hover:bg-surface-light transition-colors">
                        <div className="flex items-center gap-3 mb-3">
                          <Avatar>
                            <AvatarFallback className="bg-primary/10 text-primary">NT</AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium">NFT Traders</h4>
                            <div className="text-xs text-muted-foreground">NFT marketplace and trading strategies</div>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <Badge variant="outline" className="bg-primary/5 border-primary/20">
                            <Users className="h-3 w-3 text-primary mr-1" />
                            87
                          </Badge>
                          <Button size="sm" variant="outline" className="h-7 border-primary/30 text-primary text-xs">
                            Preview
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
            </Card>
              </div>
              
              {/* Right Column - Room features and highlights */}
              <div className="space-y-6">
                <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-none neon-border shadow-glow">
                  <CardHeader>
                    <CardTitle className="text-lg font-medium">Room Features</CardTitle>
                    <CardDescription>
                      Powerful tools for group interactions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="bg-primary/20 p-2 rounded-lg">
                          <MessageCircle className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">Live Voice Chats</h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            Join Clubhouse-style audio rooms with breakout sessions
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="bg-primary/20 p-2 rounded-lg">
                          <BadgeDollarSign className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">Token Exchange</h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            Trade in-app and on-chain tokens within rooms
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="bg-primary/20 p-2 rounded-lg">
                          <Cpu className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">Miner Marketplace</h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            Buy, sell, and rent miners as NFTs
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="bg-primary/20 p-2 rounded-lg">
                          <Sparkles className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">Mini-Games & Contests</h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            Earn rewards through interactive challenges
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
            </Card>
                
                <Card className="bg-surface border-none neon-border shadow-glow">
                  <CardHeader className="pb-3 border-b border-border/30">
                    <CardTitle className="text-lg font-medium flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      Scheduled Events
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-3">
                      <div className="bg-surface-light p-3 rounded-lg border border-border/20">
                        <Badge className="mb-2 bg-primary/10 text-primary border-none">Tomorrow, 3PM UTC</Badge>
                        <h4 className="font-medium text-sm">Crypto Market Analysis</h4>
                        <p className="text-xs text-muted-foreground mb-2">Weekly review of market trends and forecasts</p>
                        <div className="flex justify-between items-center">
                          <span className="text-xs">By TradingElite</span>
                          <Button size="sm" variant="outline" className="h-7 text-xs border-primary/30 text-primary">
                            <Bell className="h-3 w-3 mr-1" /> Reminder
                          </Button>
                        </div>
                      </div>
                      
                      <div className="bg-surface-light p-3 rounded-lg border border-border/20">
                        <Badge className="mb-2 bg-amber-500/10 text-amber-500 border-none">Friday, 7PM UTC</Badge>
                        <h4 className="font-medium text-sm">Mining Rig Showcase</h4>
                        <p className="text-xs text-muted-foreground mb-2">Live demonstrations of high-performance setups</p>
                        <div className="flex justify-between items-center">
                          <span className="text-xs">By MinerMasters</span>
                          <Button size="sm" variant="outline" className="h-7 text-xs border-primary/30 text-primary">
                            <Bell className="h-3 w-3 mr-1" /> Reminder
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-surface border-none neon-border shadow-glow">
                  <CardHeader className="pb-3 border-b border-border/30">
                    <CardTitle className="text-lg font-medium flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-primary" />
                      Top Room Hosts
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-3">
                      {[
                        { name: "CryptoSage", events: 28, reputation: 98 },
                        { name: "TradingPro", events: 19, reputation: 92 },
                        { name: "MiningGuru", events: 15, reputation: 94 }
                      ].map((host, index) => (
                        <div key={index} className="flex items-center justify-between p-2 rounded-md hover:bg-surface-light">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                {host.name.substring(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="text-sm font-medium">{host.name}</div>
                              <div className="text-xs text-muted-foreground">{host.events} events hosted</div>
                            </div>
                          </div>
                          <Badge className="bg-primary/10 text-primary border-none">
                            <Shield className="h-3 w-3 mr-1" />{host.reputation}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          {/* Mentorship Tab */}
          <TabsContent value="mentorship">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                <Card className="bg-surface border-none neon-border shadow-glow overflow-hidden">
                  <div className="bg-gradient-to-r from-primary/20 to-secondary/20 p-6">
                    <h2 className="text-xl font-bold mb-2">Mentorship Program</h2>
                    <p className="text-sm text-muted-foreground mb-4">Connect with experts or help newcomers in the crypto space</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-surface p-4 rounded-lg shadow-sm">
                        <div className="flex items-center gap-2 mb-3">
                          <User className="h-5 w-5 text-primary" />
                          <h3 className="font-medium">Find a Mentor</h3>
                        </div>
                        <p className="text-xs text-muted-foreground mb-3">Learn from experienced traders and miners</p>
                        <Button size="sm" className="w-full bg-primary/20 text-primary hover:bg-primary/30">
                          Browse Mentors
                        </Button>
                      </div>
                      
                      <div className="bg-surface p-4 rounded-lg shadow-sm">
                        <div className="flex items-center gap-2 mb-3">
                          <Users className="h-5 w-5 text-primary" />
                          <h3 className="font-medium">Become a Mentor</h3>
                        </div>
                        <p className="text-xs text-muted-foreground mb-3">Share your knowledge and earn rewards</p>
                        <Button size="sm" className="w-full bg-primary/20 text-primary hover:bg-primary/30">
                          Apply Now
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <CardContent className="pt-6">
                    <h3 className="font-medium text-lg mb-4">Featured Mentors</h3>
                    
                    <div className="space-y-5">
                      {suggestedMentors.map((mentor) => (
                        <div key={mentor.id} className="flex items-start gap-4 pb-5 border-b border-border/30">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback className="bg-primary/20 text-primary">
                              {mentor.username[0].toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-medium">{mentor.username}</h4>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <Badge variant="outline" className="text-xs font-normal bg-primary/5 border-primary/20">
                                    {mentor.specialty}
                                  </Badge>
                                  <div className="flex items-center">
                                    <Star className="h-3 w-3 fill-amber-500 text-amber-500 mr-1" />
                                    <span className="text-xs font-medium">{mentor.rating}</span>
                                  </div>
                                </div>
                              </div>
                              
                              <Badge className="bg-primary/10 text-primary border-none">
                                <Users className="h-3 w-3 mr-1" />
                                {mentor.students} students
                              </Badge>
                            </div>
                            
                            <p className="text-sm text-muted-foreground mt-2">
                              {mentor.username === "CryptoSage" 
                                ? "Specialized in DeFi strategies with 5+ years of experience in crypto markets. Former financial advisor with expertise in risk management."
                                : "Mining optimization expert focused on energy efficiency and maximizing ROI. Hardware engineer with deep knowledge of GPU and ASIC setups."
                              }
                            </p>
                            
                            <div className="flex items-center gap-2 mt-3">
                              <Button size="sm" className="text-xs bg-gradient-to-r from-primary to-secondary text-white shadow-glow" onClick={() => handleConnectMentor(mentor)}>
                                Connect
                              </Button>
                              <Button size="sm" variant="outline" className="text-xs border-primary/30 text-primary">
                                View Profile
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
            </Card>
                
                <Card className="bg-surface border-none neon-border shadow-glow">
                  <CardHeader className="pb-3 border-b border-border/30">
                    <CardTitle className="text-lg font-medium flex items-center gap-2">
                      <Award className="h-5 w-5 text-primary" />
                      Mentorship Success Stories
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-4">
                      {[
                        {
                          mentor: "CryptoSage",
                          mentee: "NewTrader92",
                          outcome: "Increased portfolio by 45% in 3 months using risk management strategies",
                          testimonial: "My mentor helped me understand market cycles and avoid emotional trading decisions."
                        },
                        {
                          mentor: "MiningMaster",
                          mentee: "GPUFarmer",
                          outcome: "Optimized mining setup to reduce power consumption by 30% while maintaining hashrate",
                          testimonial: "The cooling solutions and power management tips were game changers for my mining operation."
                        }
                      ].map((story, index) => (
                        <div key={index} className="bg-surface-light p-4 rounded-lg border border-border/20">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className="bg-green-500/10 text-green-500 border-none font-normal">
                              Success Story
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-medium">{story.mentor}</span>
                            <span className="text-xs text-muted-foreground">mentored</span>
                            <span className="text-sm font-medium">{story.mentee}</span>
                          </div>
                          <p className="text-sm font-medium text-primary mb-2">{story.outcome}</p>
                          <p className="text-xs text-muted-foreground italic">"{story.testimonial}"</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="space-y-6">
                <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-none neon-border shadow-glow">
                  <CardHeader>
                    <CardTitle className="text-lg font-medium">Mentorship Benefits</CardTitle>
                    <CardDescription>
                      Powerful tools for group interactions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="bg-primary/20 p-2 rounded-lg">
                          <MessageCircle className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">Live Voice Chats</h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            Join Clubhouse-style audio rooms with breakout sessions
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="bg-primary/20 p-2 rounded-lg">
                          <BadgeDollarSign className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">Token Exchange</h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            Trade in-app and on-chain tokens within rooms
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="bg-primary/20 p-2 rounded-lg">
                          <Cpu className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">Miner Marketplace</h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            Buy, sell, and rent miners as NFTs
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="bg-primary/20 p-2 rounded-lg">
                          <Sparkles className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">Mini-Games & Contests</h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            Earn rewards through interactive challenges
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-surface border-none neon-border shadow-glow">
                  <CardHeader className="pb-3 border-b border-border/30">
                    <CardTitle className="text-lg font-medium flex items-center gap-2">
                      <PieChart className="h-5 w-5 text-primary" />
                      Mentor Statistics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-4">
                      <div className="bg-surface-light p-3 rounded-lg">
                        <div className="flex justify-between items-center mb-1">
                          <div className="text-sm">Top Specialization</div>
                          <div className="text-sm font-medium">DeFi Trading</div>
                        </div>
                        <Progress value={65} className="h-1.5 mb-1" />
                        <div className="text-xs text-muted-foreground">65% of mentors</div>
                      </div>
                      
                      <div className="bg-surface-light p-3 rounded-lg">
                        <div className="flex justify-between items-center mb-1">
                          <div className="text-sm">Average Rating</div>
                          <div className="text-sm font-medium flex items-center">
                            <Star className="h-3 w-3 fill-amber-500 text-amber-500 mr-1" />
                            4.7
                          </div>
                        </div>
                        <Progress value={94} className="h-1.5 mb-1" />
                        <div className="text-xs text-muted-foreground">Based on 234 reviews</div>
                      </div>
                      
                      <div className="bg-surface-light p-3 rounded-lg">
                        <div className="flex justify-between items-center mb-1">
                          <div className="text-sm">Completion Rate</div>
                          <div className="text-sm font-medium">92%</div>
                        </div>
                        <Progress value={92} className="h-1.5 mb-1" />
                        <div className="text-xs text-muted-foreground">Mentorships successfully completed</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      <BottomNav />
      
      {/* Active Room Dialog */}
      {activeRoom && (
        <Dialog open={showRoomDialog} onOpenChange={setShowRoomDialog}>
          <DialogContent className="bg-surface border-none sm:max-w-[800px] p-0 max-h-[90vh] overflow-hidden">
            <div className="flex flex-col h-[80vh]">
              {/* Room Header */}
              <div className="p-4 bg-gradient-to-r from-primary/20 to-secondary/20 border-b border-border/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border-2 border-primary">
                      <AvatarFallback className="bg-primary/10 text-primary font-medium">
                        {activeRoom.name?.[0]?.toUpperCase() || "R"}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{activeRoom.name || "Trading Room"}</h3>
                        <Badge className="bg-green-500/20 text-green-500 border-none">Live</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{activeRoom.description || "Join the conversation and trading strategies"}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" 
                      onClick={() => setSpeakerEnabled(!speakerEnabled)}>
                      {speakerEnabled ? (
                        <Volume2 className="h-4 w-4" />
                      ) : (
                        <VolumeX className="h-4 w-4" />
                      )}
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className={`h-8 w-8 rounded-full ${micEnabled ? 'bg-primary/20 text-primary' : ''}`} 
                      onClick={() => setMicEnabled(!micEnabled)}
                    >
                      {micEnabled ? (
                        <Mic className="h-4 w-4" />
                      ) : (
                        <MicOff className="h-4 w-4" />
                      )}
                    </Button>
                    
                    <Button variant="outline" size="icon" className="h-8 w-8 rounded-full">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex gap-2 mt-4">
                  <Badge className="bg-primary/10 text-primary">
                    <Users className="h-3 w-3 mr-1" />
                    {activeRoom.participants || 42} online
                  </Badge>
                  
                  <Badge className="bg-primary/10 text-primary">
                    <Clock className="h-3 w-3 mr-1" />
                    Started {activeRoom.startedAgo || "45 min ago"}
                  </Badge>
                  
                  {activeRoom.category && (
                    <Badge className="bg-primary/10 text-primary">
                      <HashIcon className="h-3 w-3 mr-1" />
                      {activeRoom.category}
                    </Badge>
                  )}
                </div>
              </div>
              
              {/* Room Content */}
              <div className="flex flex-1 overflow-hidden">
                {/* Main Content Area */}
                <div className="flex-1 flex flex-col">
                  {/* Chat Messages */}
                  <div className="flex-1 p-4 overflow-y-auto">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary/10 text-primary">CT</AvatarFallback>
                        </Avatar>
                        <div className="bg-surface-light p-3 rounded-lg">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">CryptoTrader</span>
                            <span className="text-xs text-muted-foreground">10:24 AM</span>
                          </div>
                          <p className="text-sm mt-1">Welcome everyone to the Trading Tactics room! Today we'll be discussing swing trading strategies.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary/10 text-primary">BM</AvatarFallback>
                        </Avatar>
                        <div className="bg-surface-light p-3 rounded-lg">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">BitMaster</span>
                            <span className="text-xs text-muted-foreground">10:26 AM</span>
                          </div>
                          <p className="text-sm mt-1">Looking forward to hearing about your RSI strategies!</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary/10 text-primary">CT</AvatarFallback>
                        </Avatar>
                        <div className="bg-surface-light p-3 rounded-lg">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">CryptoTrader</span>
                            <span className="text-xs text-muted-foreground">10:28 AM</span>
                          </div>
                          <p className="text-sm mt-1">Let's start by looking at this chart. Notice the support levels I've highlighted.</p>
                          <div className="mt-2 rounded-lg overflow-hidden bg-surface p-1">
                            <img src="/assets/chart-sample.jpg" alt="Trading chart" className="w-full h-auto rounded" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {user?.username?.[0]?.toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="bg-primary/10 p-3 rounded-lg">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{user?.username || "You"}</span>
                            <span className="text-xs text-muted-foreground">Just now</span>
                          </div>
                          <p className="text-sm mt-1">Thanks for sharing! How do you determine your entry points?</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Message Input */}
                  <div className="p-3 border-t border-border/30">
                    <div className="flex gap-2">
                      <Input 
                        placeholder="Type a message..." 
                        className="flex-1 bg-surface-light" 
                        value={roomMessage}
                        onChange={(e) => setRoomMessage(e.target.value)}
                      />
                      <Button variant="outline" size="icon" className="h-10 w-10">
                        <Smile className="h-5 w-5" />
                      </Button>
                      <Button variant="outline" size="icon" className="h-10 w-10">
                        <File className="h-5 w-5" />
                      </Button>
                      <Button 
                        className="bg-gradient-to-r from-primary to-secondary"
                        disabled={!roomMessage.trim()}
                        onClick={() => {
                          toast({
                            title: "Message Sent",
                            description: "Your message has been sent to the room",
                          });
                          setRoomMessage("");
                        }}
                      >
                        Send
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Side Panel */}
                <div className="w-64 border-l border-border/30 overflow-y-auto hidden md:block">
                  <div className="p-3 border-b border-border/30">
                    <h4 className="font-medium text-sm mb-2">Room Features</h4>
                    <div className="space-y-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full justify-start text-xs"
                        onClick={() => {
                          handleOpenTokenExchange("buy");
                        }}
                      >
                        <Coins className="h-3.5 w-3.5 mr-2" />
                        Token Exchange
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className={`w-full justify-start text-xs ${isScreenSharing ? 'bg-primary/20 text-primary' : ''}`}
                        onClick={handleToggleScreenShare}
                      >
                        <Monitor className="h-3.5 w-3.5 mr-2" />
                        {isScreenSharing ? 'Stop Sharing' : 'Screen Share'}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full justify-start text-xs"
                        onClick={() => {
                          setShowMinerTradingDialog(true);
                        }}
                      >
                        <Cpu className="h-3.5 w-3.5 mr-2" />
                        Miner Trading
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full justify-start text-xs"
                        onClick={() => {
                          handleOpenMiniGame("Crypto Trivia");
                        }}
                      >
                        <Sparkles className="h-3.5 w-3.5 mr-2" />
                        Mini-Games
                      </Button>
                    </div>
                  </div>
                  
                  <div className="p-3 border-b border-border/30">
                    <h4 className="font-medium text-sm mb-2">Participants (42)</h4>
                    <div className="space-y-2 max-h-[200px] overflow-y-auto">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="bg-primary/10 text-primary text-xs">CT</AvatarFallback>
                          </Avatar>
                          <span className="text-xs">CryptoTrader</span>
                        </div>
                        <Badge className="text-[10px] h-4 bg-blue-500/20 text-blue-500 border-none">Host</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="bg-primary/10 text-primary text-xs">BM</AvatarFallback>
                          </Avatar>
                          <span className="text-xs">BitMaster</span>
                        </div>
                        <Badge className="text-[10px] h-4 bg-primary/10 text-primary border-none">Speaker</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="bg-primary/10 text-primary text-xs">
                              {user?.username?.[0]?.toUpperCase() || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs">{user?.username || "You"}</span>
                        </div>
                        <Badge className="text-[10px] h-4 bg-primary/10 text-primary border-none">You</Badge>
                      </div>
                      
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="bg-primary/10 text-primary text-xs">U{i+1}</AvatarFallback>
                            </Avatar>
                            <span className="text-xs">User{i+1}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="p-3">
                    <h4 className="font-medium text-sm mb-2">Upcoming</h4>
                    <div className="space-y-2">
                      <div className="bg-surface-light rounded-lg p-2 text-xs">
                        <div className="font-medium">Q&A Session</div>
                        <div className="text-muted-foreground mt-1">Starts in 15 min</div>
                      </div>
                      <div className="bg-surface-light rounded-lg p-2 text-xs">
                        <div className="font-medium">Trading Contest</div>
                        <div className="text-muted-foreground mt-1">Starts in 45 min</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Miner Trading Dialog */}
      <Dialog open={showMinerTradingDialog} onOpenChange={setShowMinerTradingDialog}>
        <DialogContent className="bg-surface border-none sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Miner Marketplace</DialogTitle>
            <DialogDescription>
              Buy, sell, and rent miners using in-app or on-chain tokens
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="buy">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="buy">
                <Coins className="mr-2 h-4 w-4" />
                Buy Miners
              </TabsTrigger>
              <TabsTrigger value="sell">
                <BadgeDollarSign className="mr-2 h-4 w-4" />
                Sell Miners
              </TabsTrigger>
              <TabsTrigger value="rent">
                <Clock className="mr-2 h-4 w-4" />
                Rent Miners
              </TabsTrigger>
            </TabsList>
            
            {/* Buy Miners Tab */}
            <TabsContent value="buy" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    name: "Basic Miner",
                    hashrate: "15 H/s",
                    price: "500 GCC",
                    image: "/assets/miner-basic.jpg",
                    type: "in-app"
                  },
                  {
                    name: "Advanced Miner",
                    hashrate: "45 H/s",
                    price: "1500 GCC",
                    image: "/assets/miner-advanced.jpg",
                    type: "in-app"
                  },
                  {
                    name: "Super Miner NFT",
                    hashrate: "120 H/s",
                    price: "0.05 ETH",
                    image: "/assets/miner-super.jpg",
                    type: "on-chain"
                  },
                  {
                    name: "Mega Miner NFT",
                    hashrate: "250 H/s",
                    price: "0.12 ETH",
                    image: "/assets/miner-mega.jpg",
                    type: "on-chain"
                  }
                ].map((miner, index) => (
                  <Card key={index} className="bg-surface-light border-none overflow-hidden">
                    <div className="h-40 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                      <Cpu className="h-16 w-16 text-primary/50" />
                    </div>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{miner.name}</h3>
                          <div className="text-sm text-muted-foreground">Hashrate: {miner.hashrate}</div>
                        </div>
                        <Badge className={`${miner.type === 'on-chain' ? 'bg-blue-500/20 text-blue-500' : 'bg-primary/20 text-primary'} border-none`}>
                          {miner.type === 'on-chain' ? 'NFT' : 'Standard'}
                        </Badge>
                      </div>
                      <Separator className="my-3" />
                      <div className="flex justify-between items-center">
                        <div className="font-medium text-primary">{miner.price}</div>
                        <Button size="sm" className="bg-gradient-to-r from-primary to-secondary text-white">
                          Purchase
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            {/* Sell Miners Tab */}
            <TabsContent value="sell" className="space-y-4">
              <div className="bg-surface-light p-4 rounded-lg">
                <h3 className="font-medium mb-2">Your Miners Available for Sale</h3>
                <div className="text-muted-foreground text-sm mb-3">
                  List your miners for sale to other users in this room
                </div>
                
                <div className="space-y-3">
                  {[
                    {
                      name: "Standard Miner #1342",
                      hashrate: "25 H/s",
                      minPrice: "650 GCC",
                      type: "in-app"
                    },
                    {
                      name: "Premium Miner #897",
                      hashrate: "75 H/s",
                      minPrice: "0.03 ETH",
                      type: "on-chain"
                    }
                  ].map((miner, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-border/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                          <Cpu className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium text-sm">{miner.name}</div>
                          <div className="text-xs text-muted-foreground">Hashrate: {miner.hashrate}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input 
                          className="w-24 h-8 text-xs bg-surface" 
                          defaultValue={miner.minPrice}
                          placeholder="Price"
                        />
                        <Button size="sm" className="h-8 bg-primary/10 text-primary hover:bg-primary/20">
                          List
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Button variant="outline" className="w-full mt-4">
                  <Plus className="h-4 w-4 mr-1.5" />
                  Add More Miners
                </Button>
              </div>
            </TabsContent>
            
            {/* Rent Miners Tab */}
            <TabsContent value="rent" className="space-y-4">
              <Card className="bg-surface-light border-none">
                <CardHeader>
                  <CardTitle className="text-lg">Miner Rental System</CardTitle>
                  <CardDescription>
                    Rent miners to earn passive income or lease miners from others
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <h4 className="font-medium mb-1 flex items-center gap-2">
                        <BadgeDollarSign className="h-4 w-4 text-primary" />
                        Rent Your Miners
                      </h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Earn up to 5% of mining rewards by renting your miners to others
                      </p>
                      <Button size="sm" className="bg-primary/20 text-primary hover:bg-primary/30">
                        Setup Rental
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium">Available for Rent</h4>
                      {[
                        {
                          name: "Ultra Miner",
                          owner: "MiningPro",
                          hashrate: "180 H/s",
                          fee: "3% of rewards",
                          duration: "1-7 days"
                        },
                        {
                          name: "Supreme Rig",
                          owner: "HashKing",
                          hashrate: "350 H/s",
                          fee: "5% of rewards + 0.01 ETH",
                          duration: "1-30 days"
                        }
                      ].map((rental, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border border-border/30 rounded-lg">
                          <div>
                            <div className="font-medium">{rental.name}</div>
                            <div className="text-xs text-muted-foreground">By {rental.owner}</div>
                            <div className="text-xs text-muted-foreground">Hashrate: {rental.hashrate}</div>
                            <div className="text-xs mt-1">
                              <Badge variant="outline" className="mr-1 text-[10px] h-4 border-primary/20 bg-primary/5">
                                {rental.fee}
                              </Badge>
                              <Badge variant="outline" className="text-[10px] h-4 border-primary/20 bg-primary/5">
                                {rental.duration}
                              </Badge>
                            </div>
                          </div>
                          <Button size="sm" className="bg-gradient-to-r from-primary to-secondary text-white">
                            Rent Now
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
      
      {/* Mini-Game Dialog */}
      <Dialog open={showMiniGameDialog} onOpenChange={setShowMiniGameDialog}>
        <DialogContent className="bg-surface border-none sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                {selectedGame || "Crypto Trivia"}
              </div>
            </DialogTitle>
            <DialogDescription>
              Test your knowledge and win tokens
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Game progress */}
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>Question {gameProgress + 1} of 5</span>
                <span className="text-primary font-medium">10 GCC per correct answer</span>
              </div>
              <Progress value={(gameProgress / 5) * 100} className="h-2" />
            </div>
            
            {/* Question */}
            <Card className="bg-surface-light border-none p-4">
              <h3 className="font-medium mb-4">Which consensus mechanism does Ethereum 2.0 use?</h3>
              
              <div className="space-y-2">
                {[
                  "Proof of Work (PoW)",
                  "Proof of Stake (PoS)",
                  "Proof of Authority (PoA)",
                  "Proof of Space (PoSpace)"
                ].map((answer, index) => (
                  <div 
                    key={index} 
                    className="p-3 border border-border/30 rounded-lg cursor-pointer hover:bg-primary/5 hover:border-primary/30 transition-colors"
                    onClick={() => {
                      if (index === 1) { // Correct answer is PoS
                        toast({
                          title: "Correct!",
                          description: "You earned 10 GCC tokens!",
                        });
                      } else {
                        toast({
                          title: "Incorrect",
                          description: "The right answer is Proof of Stake (PoS)",
                        });
                      }
                      
                      if (gameProgress < 4) {
                        setGameProgress(gameProgress + 1);
                      } else {
                        toast({
                          title: "Game Completed!",
                          description: "You've earned rewards for participating",
                        });
                        setShowMiniGameDialog(false);
                      }
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-6 w-6 rounded-full border border-border/50 flex items-center justify-center text-xs">
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span>{answer}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
            
            {/* Game info */}
            <div className="bg-primary/10 p-3 rounded-lg">
              <h4 className="font-medium flex items-center gap-2 text-sm">
                <Trophy className="h-4 w-4 text-primary" />
                Leaderboard
              </h4>
              <div className="mt-2 space-y-1">
                {[
                  { name: "CryptoWiz", points: 120 },
                  { name: "BlockMaster", points: 90 },
                  { name: "User3", points: 50 }
                ].map((player, index) => (
                  <div key={index} className="flex justify-between text-xs">
                    <span>{index + 1}. {player.name}</span>
                    <span>{player.points} points</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowMiniGameDialog(false)}>
              Exit Game
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Token Exchange Dialog */}
      <Dialog open={showTokenExchangeDialog} onOpenChange={setShowTokenExchangeDialog}>
        <DialogContent className="bg-surface border-none sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              <div className="flex items-center gap-2">
                <Coins className="h-5 w-5 text-primary" />
                Token Exchange
              </div>
            </DialogTitle>
            <DialogDescription>
              Trade between in-app (GCC) and on-chain (ETH) tokens
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue={exchangeType} onValueChange={setExchangeType}>
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="buy">
                <BadgeDollarSign className="mr-2 h-4 w-4" />
                Buy GCC
              </TabsTrigger>
              <TabsTrigger value="sell">
                <Coins className="mr-2 h-4 w-4" />
                Sell GCC
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="buy" className="space-y-4">
              <Card className="bg-surface-light border-none">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Amount to Buy (GCC)</label>
                      <Input 
                        type="number" 
                        placeholder="0.00" 
                        value={exchangeAmount}
                        onChange={(e) => setExchangeAmount(e.target.value)}
                      />
                    </div>
                    
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <div className="flex justify-between text-sm">
                        <span>Exchange Rate</span>
                        <span>1 ETH = 10,000 GCC</span>
                      </div>
                      <div className="flex justify-between text-sm mt-2">
                        <span>You Pay</span>
                        <span className="font-medium">
                          {exchangeAmount ? (parseFloat(exchangeAmount) / 10000).toFixed(6) : '0.000000'} ETH
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Benefits of In-App Tokens (GCC)</h4>
                      <ul className="text-xs space-y-1 text-muted-foreground pl-4 list-disc">
                        <li>Boost posts in social feed</li>
                        <li>Join premium community challenges</li>
                        <li>Trade for mining equipment</li>
                        <li>Enter token-gated rooms</li>
                      </ul>
                    </div>
                    
                    <Button 
                      className="w-full bg-gradient-to-r from-primary to-secondary"
                      disabled={!exchangeAmount || parseFloat(exchangeAmount) <= 0}
                      onClick={() => {
                        toast({
                          title: "Purchase Successful",
                          description: `You bought ${exchangeAmount} GCC tokens`,
                        });
                        setShowTokenExchangeDialog(false);
                      }}
                    >
                      Complete Purchase
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="sell" className="space-y-4">
              <Card className="bg-surface-light border-none">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Amount to Sell (GCC)</label>
                      <Input 
                        type="number" 
                        placeholder="0.00" 
                        value={exchangeAmount}
                        onChange={(e) => setExchangeAmount(e.target.value)}
                      />
                    </div>
                    
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <div className="flex justify-between text-sm">
                        <span>Exchange Rate</span>
                        <span>10,000 GCC = 0.95 ETH</span>
                      </div>
                      <div className="flex justify-between text-sm mt-2">
                        <span>You Receive</span>
                        <span className="font-medium">
                          {exchangeAmount ? (parseFloat(exchangeAmount) / 10000 * 0.95).toFixed(6) : '0.000000'} ETH
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        (5% exchange fee applies)
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Benefits of On-Chain Tokens (ETH)</h4>
                      <ul className="text-xs space-y-1 text-muted-foreground pl-4 list-disc">
                        <li>Purchase premium NFT miners</li>
                        <li>Access exclusive on-chain features</li>
                        <li>Transfer to external wallets</li>
                        <li>Use across the wider blockchain ecosystem</li>
                      </ul>
                    </div>
                    
                    <Button 
                      className="w-full bg-gradient-to-r from-primary to-secondary"
                      disabled={!exchangeAmount || parseFloat(exchangeAmount) <= 0}
                      onClick={() => {
                        toast({
                          title: "Sale Successful",
                          description: `You sold ${exchangeAmount} GCC tokens`,
                        });
                        setShowTokenExchangeDialog(false);
                      }}
                    >
                      Complete Sale
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
      
      {/* Screen Share Dialog */}
      <Dialog open={showScreenShareDialog} onOpenChange={setShowScreenShareDialog}>
        <DialogContent className="bg-surface border-none sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>
              <div className="flex items-center gap-2">
                <Monitor className="h-5 w-5 text-primary" />
                Screen Sharing
              </div>
            </DialogTitle>
            <DialogDescription>
              Share your screen with others in the room
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="bg-primary/10 p-4 rounded-lg text-sm">
              <h4 className="font-medium mb-2">What would you like to share?</h4>
              <div className="space-y-2">
                <div className="flex items-center p-2 border border-border/30 rounded-lg hover:bg-surface-light hover:border-primary/30 transition-colors cursor-pointer">
                  <input type="radio" id="entire-screen" name="share-type" className="mr-2" />
                  <label htmlFor="entire-screen" className="flex items-center gap-2 cursor-pointer">
                    <Monitor className="h-4 w-4 text-primary" />
                    Entire Screen
                  </label>
                </div>
                
                <div className="flex items-center p-2 border border-border/30 rounded-lg hover:bg-surface-light hover:border-primary/30 transition-colors cursor-pointer">
                  <input type="radio" id="application-window" name="share-type" className="mr-2" />
                  <label htmlFor="application-window" className="flex items-center gap-2 cursor-pointer">
                    <File className="h-4 w-4 text-primary" />
                    Application Window
                  </label>
                </div>
                
                <div className="flex items-center p-2 border border-border/30 rounded-lg hover:bg-surface-light hover:border-primary/30 transition-colors cursor-pointer">
                  <input type="radio" id="browser-tab" name="share-type" className="mr-2" />
                  <label htmlFor="browser-tab" className="flex items-center gap-2 cursor-pointer">
                    <Globe className="h-4 w-4 text-primary" />
                    Browser Tab
                  </label>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Advanced Options</h4>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="share-audio" className="h-4 w-4" />
                <label htmlFor="share-audio" className="text-sm">Include system audio</label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="optimize-video" className="h-4 w-4" checked />
                <label htmlFor="optimize-video" className="text-sm">Optimize for video</label>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowScreenShareDialog(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-gradient-to-r from-primary to-secondary"
              onClick={handleStartScreenShare}
            >
              Start Sharing
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default Social;
