export const CATEGORIES = [
  { id: 'Food',          label: 'Food',          light: '#1F4D3A', dark: '#5FA37F' },
  { id: 'Travel',        label: 'Travel',        light: '#3B5B7A', dark: '#6F93B5' },
  { id: 'Books',         label: 'Books',         light: '#A07A2C', dark: '#C9A04A' },
  { id: 'Hostel',        label: 'Hostel',        light: '#8A5A44', dark: '#C08A6E' },
  { id: 'Mess',          label: 'Mess',          light: '#5E7F4C', dark: '#8FB07A' },
  { id: 'Shopping',      label: 'Shopping',      light: '#7A4E6D', dark: '#B07FA0' },
  { id: 'Recharge',      label: 'Recharge',      light: '#3F7482', dark: '#6FA9B7' },
  { id: 'Entertainment', label: 'Entertainment', light: '#6E5A8A', dark: '#9C87BD' },
  { id: 'Others',        label: 'Others',        light: '#8E8A7F', dark: '#A39E92' },
];

export const getCategoryColor = (categoryId, theme = 'light') => {
  const normalized = (categoryId || '').toLowerCase();
  const match = CATEGORIES.find(c => c.id.toLowerCase() === normalized) ||
                (normalized === 'transport' ? CATEGORIES[1] : null) ||
                (normalized === 'bills' ? CATEGORIES[6] : null) ||
                CATEGORIES[8];
  return theme === 'dark' ? match.dark : match.light;
};

