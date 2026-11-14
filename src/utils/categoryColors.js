import {
  Utensils,
  Coffee,
  UtensilsCrossed,
  ShoppingBag,
  Navigation,
  BookOpen,
  Home,
  Tag,
  Film,
  HeartPulse,
  GraduationCap,
  Wifi,
  Sparkles,
  MoreHorizontal,
  FolderHeart,
  Laptop,
  Car,
  Music,
  Dumbbell,
  Gift,
} from 'lucide-react';

/**
 * CampusFlow 2.1 Standard Categories
 * Includes all 14 requested categories with harmonious light & dark accents.
 */
export const CATEGORIES = [
  { id: 'Food',                label: 'Food',                icon: Utensils,         light: '#1F4D3A', dark: '#5FA37F' },
  { id: 'Canteen',             label: 'Canteen',             icon: Coffee,           light: '#2D6A4F', dark: '#74C69D' },
  { id: 'Mess',                label: 'Mess',                icon: UtensilsCrossed,  light: '#5E7F4C', dark: '#8FB07A' },
  { id: 'Groceries',           label: 'Groceries',           icon: ShoppingBag,      light: '#3A6B35', dark: '#88B04B' },
  { id: 'Travel',              label: 'Travel',              icon: Navigation,       light: '#3B5B7A', dark: '#6F93B5' },
  { id: 'Books & Stationery',  label: 'Books & Stationery',  icon: BookOpen,         light: '#A07A2C', dark: '#C9A04A' },
  { id: 'Hostel Rent',         label: 'Hostel Rent',         icon: Home,             light: '#8A5A44', dark: '#C08A6E' },
  { id: 'Shopping',            label: 'Shopping',            icon: Tag,              light: '#7A4E6D', dark: '#B07FA0' },
  { id: 'Entertainment',       label: 'Entertainment',       icon: Film,             light: '#6E5A8A', dark: '#9C87BD' },
  { id: 'Health',              label: 'Health',              icon: HeartPulse,       light: '#B42318', dark: '#F04438' },
  { id: 'Education',           label: 'Education',           icon: GraduationCap,    light: '#2A6F97', dark: '#61A5C2' },
  { id: 'Recharge & Internet', label: 'Recharge & Internet', icon: Wifi,             light: '#3F7482', dark: '#6FA9B7' },
  { id: 'Personal Care',       label: 'Personal Care',       icon: Sparkles,         light: '#A0522D', dark: '#D27D2D' },
  { id: 'Other',               label: 'Other',               icon: MoreHorizontal,   light: '#8E8A7F', dark: '#A39E92' },
];

/**
 * Supported Payment Methods
 */
export const PAYMENT_METHODS = [
  { id: 'UPI',          label: 'UPI' },
  { id: 'Cash',         label: 'Cash' },
  { id: 'Debit Card',   label: 'Debit Card' },
  { id: 'Credit Card',  label: 'Credit Card' },
  { id: 'Net Banking',  label: 'Net Banking' },
  { id: 'Other',        label: 'Other' },
];

/**
 * Icons available for Custom Categories
 */
export const CUSTOM_CATEGORY_ICONS = [
  { id: 'Tag',          label: 'Tag',        icon: Tag },
  { id: 'Utensils',     label: 'Food',       icon: Utensils },
  { id: 'Coffee',       label: 'Cafe',       icon: Coffee },
  { id: 'Laptop',       label: 'Tech',       icon: Laptop },
  { id: 'Car',          label: 'Ride',       icon: Car },
  { id: 'Music',        label: 'Music',      icon: Music },
  { id: 'Dumbbell',     label: 'Gym',        icon: Dumbbell },
  { id: 'Gift',         label: 'Gift',       icon: Gift },
  { id: 'FolderHeart',  label: 'Favorites',  icon: FolderHeart },
  { id: 'Sparkles',     label: 'Special',    icon: Sparkles },
];

/**
 * Palette colors available for Custom Categories
 */
export const CUSTOM_CATEGORY_COLORS = [
  { light: '#1F4D3A', dark: '#5FA37F' }, // Forest Green
  { light: '#2D6A4F', dark: '#74C69D' }, // Sage Green
  { light: '#3B5B7A', dark: '#6F93B5' }, // Slate Blue
  { light: '#2A6F97', dark: '#61A5C2' }, // Cyan Slate
  { light: '#6E5A8A', dark: '#9C87BD' }, // Muted Violet
  { light: '#7A4E6D', dark: '#B07FA0' }, // Muted Berry
  { light: '#A07A2C', dark: '#C9A04A' }, // Ochre Gold
  { light: '#8A5A44', dark: '#C08A6E' }, // Terracotta
  { light: '#B42318', dark: '#F04438' }, // Coral Red
  { light: '#3F7482', dark: '#6FA9B7' }, // Teal
];

/**
 * Backwards compatibility normalizer
 */
const normalizeCategoryName = (cat) => {
  if (!cat) return 'Other';
  const c = cat.trim().toLowerCase();
  if (c === 'books') return 'Books & Stationery';
  if (c === 'hostel') return 'Hostel Rent';
  if (c === 'recharge') return 'Recharge & Internet';
  if (c === 'others') return 'Other';
  if (c === 'transport') return 'Travel';
  if (c === 'bills') return 'Recharge & Internet';
  return cat;
};

/**
 * Resolves color for any category, including custom user categories
 */
export const getCategoryColor = (categoryId, theme = 'light', customCategories = []) => {
  const normalized = normalizeCategoryName(categoryId).toLowerCase();

  // Check standard categories
  const match = CATEGORIES.find(c => c.id.toLowerCase() === normalized || c.label.toLowerCase() === normalized);
  if (match) {
    return theme === 'dark' ? match.dark : match.light;
  }

  // Check custom categories
  if (Array.isArray(customCategories)) {
    const customMatch = customCategories.find(c => (c.id && c.id.toLowerCase() === normalized) || (c.label && c.label.toLowerCase() === normalized));
    if (customMatch) {
      return theme === 'dark' ? (customMatch.dark || '#5FA37F') : (customMatch.light || '#1F4D3A');
    }
  }

  // Fallback to Other
  return theme === 'dark' ? CATEGORIES[13].dark : CATEGORIES[13].light;
};

/**
 * Resolves icon component for any category
 */
export const getCategoryIcon = (categoryId, customCategories = []) => {
  const normalized = normalizeCategoryName(categoryId).toLowerCase();

  const match = CATEGORIES.find(c => c.id.toLowerCase() === normalized || c.label.toLowerCase() === normalized);
  if (match) {
    return match.icon;
  }

  if (Array.isArray(customCategories)) {
    const customMatch = customCategories.find(c => (c.id && c.id.toLowerCase() === normalized) || (c.label && c.label.toLowerCase() === normalized));
    if (customMatch && customMatch.iconName) {
      const found = CUSTOM_CATEGORY_ICONS.find(i => i.id === customMatch.iconName);
      if (found) return found.icon;
    }
  }

  return MoreHorizontal;
};
