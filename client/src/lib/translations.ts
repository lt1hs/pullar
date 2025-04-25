// Define all translations here

type TranslationKey = string;

interface Translations {
  [key: string]: {
    [key: TranslationKey]: string;
  };
}

// Persian translations (فارسی)
const fa = {
  // Common UI elements
  "app.name": "کریپتوورس",
  "app.login": "ورود",
  "app.logout": "خروج",
  "app.demo.login": "ورود آزمایشی",
  "app.continue.guest": "ادامه به عنوان مهمان",
  
  // Navigation items
  "nav.home": "خانه",
  "nav.mining": "استخراج",
  "nav.trade": "معامله",
  "nav.social": "شبکه اجتماعی",
  "nav.profile": "پروفایل",
  "nav.settings": "تنظیمات",
  
  // Dashboard
  "dashboard.title": "داشبورد",
  "dashboard.summary": "خلاصه حساب",
  "dashboard.balance": "موجودی",
  "dashboard.gameTokens": "توکن بازی",
  "dashboard.tradeTokens": "توکن معامله",
  "dashboard.level": "سطح",
  
  // Mining
  "mining.title": "عملیات استخراج",
  "mining.dashboard": "داشبورد استخراج",
  "mining.stats": "آمار عملیات استخراج شما",
  "mining.hashRate": "نرخ هش",
  "mining.powerUsage": "مصرف برق",
  "mining.dailyEarnings": "درآمد روزانه",
  "mining.efficiency": "کارایی",
  "mining.progress": "پیشرفت استخراج",
  "mining.next": "بعدی",
  "mining.collect": "جمع آوری پاداش های استخراج",
  "mining.collecting": "در حال جمع آوری...",
  "mining.progress.percent": "استخراج در حال انجام است",
  "mining.ready": "آماده!",
  "mining.rigs": "دستگاه های استخراج",
  "mining.upgrades": "ارتقاء ها",
  "mining.basic": "پایه",
  "mining.advanced": "پیشرفته",
  "mining.premium": "ویژه",
  "mining.miner": "استخراج کننده",
  "mining.rig.upgrade": "ارتقاء دستگاه استخراج",
  "mining.upgrade.description": "ارتقاء دستگاه استخراج {name} خود را برای افزایش عملکرد",
  "mining.current.level": "سطح فعلی",
  "mining.power": "توان",
  "mining.upgrade.cost": "هزینه ارتقاء",
  "mining.insufficient": "موجودی ناکافی",
  "mining.buy": "خرید",
  "mining.upgrade": "ارتقاء",
  "mining.upgrading": "در حال ارتقاء...",
  "mining.purchased": "دستگاه استخراج خریداری شد!",
  "mining.purchase.success": "شما با موفقیت {name} را خریداری کردید",
  "mining.upgraded": "دستگاه استخراج ارتقاء یافت!",
  "mining.upgraded.success": "{name} به سطح {level} ارتقاء یافت",
  "mining.settings": "تنظیمات استخراج",
  "mining.autocollect": "جمع آوری خودکار پاداش ها",
  "mining.autocollect.desc": "پاداش های استخراج را به طور خودکار هنگام آماده بودن جمع آوری کنید",
  "mining.energy": "حالت صرفه جویی در انرژی",
  "mining.energy.desc": "مصرف برق را با هزینه سرعت استخراج کاهش دهید",
  "mining.schedule": "برنامه استخراج",
  "mining.schedule.desc": "تنظیم برنامه های خودکار استخراج",
  "mining.enabled": "فعال",
  "mining.disabled": "غیرفعال",
  "mining.configure": "پیکربندی",
  
  // Social
  "social.title": "شبکه اجتماعی",
  "social.feed": "فید",
  "social.discover": "کشف",
  "social.trending": "درحال رشد",
  "social.notifications": "اعلان ها",
  "social.notifs": "اعلان ها",
  "social.post.placeholder": "چه اتفاقی در دنیای ارزهای دیجیتال می افتد؟",
  "social.image": "تصویر",
  "social.tag": "برچسب",
  "social.post": "پست",
  "social.like": "پسندیدن",
  "social.comment": "نظر",
  "social.share": "اشتراک گذاری",
  "social.comments": "نظرات",
  "social.shares": "اشتراک ها",
  "social.ago": "پیش",
  "social.minutes": "دقیقه",
  "social.hours": "ساعت",
  
  // Wallet
  "wallet.title": "کیف پول",
  "wallet.balance": "موجودی",
  "wallet.send": "ارسال",
  "wallet.receive": "دریافت",
  "wallet.exchange": "تبدیل",
  "wallet.transactions": "تراکنش ها",
  "wallet.all": "همه",
  "wallet.sent": "ارسال شده",
  "wallet.received": "دریافت شده",
  "wallet.rewards": "پاداش ها",
  
  // Trading
  "trading.title": "معاملات",
  "trading.portfolio": "پورتفولیو",
  "trading.market": "بازار",
  "trading.tradingbot": "ربات معاملات",
  "trading.buy": "خرید",
  "trading.sell": "فروش",
  "trading.price": "قیمت",
  "trading.change": "تغییر",
  "trading.volume": "حجم",
  
  // Settings
  "settings.title": "تنظیمات",
  "settings.profile": "پروفایل",
  "settings.security": "امنیت",
  "settings.notifications": "اعلان ها",
  "settings.language": "زبان",
  "settings.theme": "تم",
  "settings.support": "پشتیبانی",
  "settings.terms": "شرایط استفاده",
  "settings.privacy": "حریم خصوصی",
  
  // Languages
  "lang.en": "English",
  "lang.fa": "فارسی",
  
  // Error messages
  "error.login": "خطا در ورود",
  "error.notFound": "صفحه مورد نظر یافت نشد",
  "error.goHome": "بازگشت به خانه",
};

// English translations
const en = {
  // Common UI elements
  "app.name": "CryptoVerse",
  "app.login": "Login",
  "app.logout": "Logout",
  "app.demo.login": "Demo Login",
  "app.continue.guest": "Continue as Guest",
  
  // Navigation items
  "nav.home": "Home",
  "nav.mining": "Mining",
  "nav.trade": "Trade",
  "nav.social": "Social",
  "nav.profile": "Profile",
  "nav.settings": "Settings",
  
  // Dashboard
  "dashboard.title": "Dashboard",
  "dashboard.summary": "Account Summary",
  "dashboard.balance": "Balance",
  "dashboard.gameTokens": "Game Tokens",
  "dashboard.tradeTokens": "Trade Tokens",
  "dashboard.level": "Level",
  
  // Mining
  "mining.title": "Mining Operations",
  "mining.dashboard": "Mining Dashboard",
  "mining.stats": "Your mining operation statistics",
  "mining.hashRate": "Hash Rate",
  "mining.powerUsage": "Power Usage",
  "mining.dailyEarnings": "Daily Earnings",
  "mining.efficiency": "Efficiency",
  "mining.progress": "Mining Progress",
  "mining.next": "Next",
  "mining.collect": "Collect Mining Rewards",
  "mining.collecting": "Collecting...",
  "mining.progress.percent": "Mining in Progress",
  "mining.ready": "Ready!",
  "mining.rigs": "Mining Rigs",
  "mining.upgrades": "Upgrades",
  "mining.basic": "Basic",
  "mining.advanced": "Advanced",
  "mining.premium": "Premium",
  "mining.miner": "Miner",
  "mining.rig.upgrade": "Upgrade Mining Rig",
  "mining.upgrade.description": "Upgrade your {name} to increase performance",
  "mining.current.level": "Current Level",
  "mining.power": "Power",
  "mining.upgrade.cost": "Upgrade Cost",
  "mining.insufficient": "Insufficient Balance",
  "mining.buy": "Buy",
  "mining.upgrade": "Upgrade",
  "mining.upgrading": "Upgrading...",
  "mining.purchased": "Mining Rig Purchased!",
  "mining.purchase.success": "You have successfully purchased the {name}",
  "mining.upgraded": "Mining Rig Upgraded!",
  "mining.upgraded.success": "The {name} has been upgraded to level {level}",
  "mining.settings": "Mining Settings",
  "mining.autocollect": "Auto-Collect Rewards",
  "mining.autocollect.desc": "Automatically collect mining rewards when ready",
  "mining.energy": "Energy Saving Mode",
  "mining.energy.desc": "Reduce power consumption at the cost of mining speed",
  "mining.schedule": "Mining Schedule",
  "mining.schedule.desc": "Set up automatic mining schedules",
  "mining.enabled": "Enabled",
  "mining.disabled": "Disabled",
  "mining.configure": "Configure",
  
  // Social
  "social.title": "Social Network",
  "social.feed": "Feed",
  "social.discover": "Discover",
  "social.trending": "Trending",
  "social.notifications": "Notifications",
  "social.notifs": "Notifs",
  "social.post.placeholder": "What's happening in the crypto world?",
  "social.image": "Image",
  "social.tag": "Tag",
  "social.post": "Post",
  "social.like": "Like",
  "social.comment": "Comment",
  "social.share": "Share",
  "social.comments": "comments",
  "social.shares": "shares",
  "social.ago": "ago",
  "social.minutes": "minutes",
  "social.hours": "hours",
  
  // Wallet
  "wallet.title": "Wallet",
  "wallet.balance": "Balance",
  "wallet.send": "Send",
  "wallet.receive": "Receive",
  "wallet.exchange": "Exchange",
  "wallet.transactions": "Transactions",
  "wallet.all": "All",
  "wallet.sent": "Sent",
  "wallet.received": "Received",
  "wallet.rewards": "Rewards",
  
  // Trading
  "trading.title": "Trading",
  "trading.portfolio": "Portfolio",
  "trading.market": "Market",
  "trading.tradingbot": "Trading Bot",
  "trading.buy": "Buy",
  "trading.sell": "Sell",
  "trading.price": "Price",
  "trading.change": "Change",
  "trading.volume": "Volume",
  
  // Settings
  "settings.title": "Settings",
  "settings.profile": "Profile",
  "settings.security": "Security",
  "settings.notifications": "Notifications",
  "settings.language": "Language",
  "settings.theme": "Theme",
  "settings.support": "Support",
  "settings.terms": "Terms of Service",
  "settings.privacy": "Privacy Policy",
  
  // Languages
  "lang.en": "English",
  "lang.fa": "فارسی",
  
  // Error messages
  "error.login": "Login failed",
  "error.notFound": "Page Not Found",
  "error.goHome": "Go Home",
};

// All available translations
export const translations: Translations = {
  en,
  fa,
};

// Default language
export const DEFAULT_LANGUAGE = 'fa';

// Available languages
export const AVAILABLE_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'fa', name: 'فارسی' }
];