export type CategorySlug =
  | 'it-tech'
  | 'engineering'
  | 'construction'
  | 'oil-gas'
  | 'logistics'
  | 'sales'
  | 'marketing'
  | 'finance'
  | 'accounting'
  | 'hr'
  | 'admin'
  | 'customer-support'
  | 'education'
  | 'healthcare'
  | 'design'
  | 'legal'
  | 'production'
  | 'other'

export interface Category {
  slug: CategorySlug
  labelAz: string
  labelEn: string
  labelRu: string
  emoji: string
  color: string
}

export const CATEGORIES: Category[] = [
  { slug: 'it-tech', labelAz: 'IT / Texnologiya', labelEn: 'IT / Technology', labelRu: 'IT / Технологии', emoji: '💻', color: '#2563eb' },
  { slug: 'engineering', labelAz: 'Mühəndislik', labelEn: 'Engineering', labelRu: 'Инженерия', emoji: '⚙️', color: '#7c3aed' },
  { slug: 'construction', labelAz: 'Tikinti', labelEn: 'Construction', labelRu: 'Строительство', emoji: '🏗️', color: '#d97706' },
  { slug: 'oil-gas', labelAz: 'Neft və Qaz', labelEn: 'Oil and Gas', labelRu: 'Нефть и Газ', emoji: '🛢️', color: '#059669' },
  { slug: 'logistics', labelAz: 'Logistika', labelEn: 'Logistics', labelRu: 'Логистика', emoji: '🚛', color: '#dc2626' },
  { slug: 'sales', labelAz: 'Satış', labelEn: 'Sales', labelRu: 'Продажи', emoji: '📈', color: '#2563eb' },
  { slug: 'marketing', labelAz: 'Marketing', labelEn: 'Marketing', labelRu: 'Маркетинг', emoji: '📣', color: '#db2777' },
  { slug: 'finance', labelAz: 'Maliyyə', labelEn: 'Finance', labelRu: 'Финансы', emoji: '💰', color: '#0891b2' },
  { slug: 'accounting', labelAz: 'Mühasibat', labelEn: 'Accounting', labelRu: 'Бухгалтерия', emoji: '🧾', color: '#65a30d' },
  { slug: 'hr', labelAz: 'HR / Kadrlar', labelEn: 'HR', labelRu: 'HR', emoji: '👥', color: '#9333ea' },
  { slug: 'admin', labelAz: 'İnzibati', labelEn: 'Administration', labelRu: 'Администрация', emoji: '🗂️', color: '#475569' },
  { slug: 'customer-support', labelAz: 'Müştəri Xidməti', labelEn: 'Customer Support', labelRu: 'Поддержка', emoji: '🎧', color: '#0284c7' },
  { slug: 'education', labelAz: 'Təhsil', labelEn: 'Education', labelRu: 'Образование', emoji: '🎓', color: '#7c3aed' },
  { slug: 'healthcare', labelAz: 'Tibb', labelEn: 'Healthcare', labelRu: 'Здравоохранение', emoji: '🏥', color: '#dc2626' },
  { slug: 'design', labelAz: 'Dizayn', labelEn: 'Design', labelRu: 'Дизайн', emoji: '🎨', color: '#db2777' },
  { slug: 'legal', labelAz: 'Hüquq', labelEn: 'Legal', labelRu: 'Юридический', emoji: '⚖️', color: '#78716c' },
  { slug: 'production', labelAz: 'İstehsal', labelEn: 'Production', labelRu: 'Производство', emoji: '🏭', color: '#b45309' },
  { slug: 'other', labelAz: 'Digər', labelEn: 'Other', labelRu: 'Другое', emoji: '📋', color: '#6b7280' },
]

// Keyword maps for categorization
const CATEGORY_KEYWORDS: Record<CategorySlug, string[]> = {
  'it-tech': [
    'developer', 'programmer', 'software', 'it ', 'backend', 'frontend', 'fullstack', 'full-stack',
    'devops', 'sysadmin', 'database', 'dba', 'python', 'java', 'javascript', 'typescript',
    'react', 'angular', 'vue', 'node', 'php', 'ruby', 'golang', 'kotlin', 'swift',
    'android', 'ios', 'mobile', 'data science', 'machine learning', 'ai ', 'cybersecurity',
    'network', 'cloud', 'aws', 'azure', 'proqramçı', 'proqram', 'texnologiya', 'texniki',
    'web ', 'sayt', 'sistem', 'analyst', 'analitik', 'bi ', 'power bi', 'tableau',
  ],
  engineering: [
    'engineer', 'mühəndis', 'mühendis', 'инженер', 'mechanical', 'electrical', 'civil',
    'chemical', 'industrial', 'structural', 'process', 'texnoloq', 'технолог',
    'autocad', 'solidworks', 'catia', 'ansys', 'plc', 'scada',
  ],
  construction: [
    'tikinti', 'construction', 'строительство', 'architect', 'memar', 'arxitektor',
    'quraşdırma', 'inşaat', 'bina', 'layihə', 'project manager', 'foreman',
    'surveyor', 'geodezist', 'estimator',
  ],
  'oil-gas': [
    'neft', 'qaz', 'oil', 'gas', 'нефть', 'газ', 'petroleum', 'reservoir',
    'drilling', 'socar', 'bp ', 'lukoil', 'schlumberger', 'halliburton',
    'refinery', 'pipeline', 'upstream', 'downstream', 'petrel', 'eclipse',
  ],
  logistics: [
    'logistika', 'logistics', 'логистика', 'supply chain', 'warehouse', 'anbar',
    'transport', 'driver', 'sürücü', 'customs', 'gömrük', 'freight', 'import',
    'export', 'ixrac', 'idxal', 'dispatcher', 'courier', 'kuryer',
  ],
  sales: [
    'satış', 'sales', 'продажи', 'account manager', 'business development',
    'ticarət', 'kommersiya', 'müştəri', 'client', 'b2b', 'b2c', 'agent',
    'broker', 'distribütor', 'dealer',
  ],
  marketing: [
    'marketing', 'маркетинг', 'smm', 'seo', 'sem', 'digital', 'brand',
    'reklam', 'advertising', 'pr ', 'public relations', 'content',
    'copywriter', 'email marketing', 'google ads', 'facebook ads',
  ],
  finance: [
    'maliyyə', 'finance', 'финансы', 'financial analyst', 'investment',
    'investisiya', 'risk', 'treasury', 'xəzinə', 'cfo', 'controller',
    'budget', 'büdcə', 'forecasting', 'cfa',
  ],
  accounting: [
    'mühasib', 'accountant', 'бухгалтер', 'accounting', 'mühasibat',
    'vergi', 'tax', 'налог', '1c', 'audit', 'auditor', 'cpa',
    'payroll', 'əmək haqqı',
  ],
  hr: [
    'hr', 'human resources', 'kadrlar', 'recruitment', 'işçi', 'işe alım',
    'talent', 'training', 'təlim', 'l&d', 'performance', 'compensation',
    'benefits', 'hh.ru',
  ],
  admin: [
    'inzibati', 'admin', 'администрация', 'office manager', 'assistant',
    'köməkçi', 'secretary', 'katib', 'receptionist', 'coordinator',
    'executive', 'personal assistant',
  ],
  'customer-support': [
    'müştəri xidməti', 'customer support', 'customer service', 'поддержка',
    'call center', 'zəng mərkəzi', 'helpdesk', 'operator', 'operatoru',
    'technical support', 'texniki dəstək',
  ],
  education: [
    'müəllim', 'teacher', 'учитель', 'professor', 'lecturer', 'mühazirəçi',
    'tutor', 'trainer', 'coach', 'instructor', 'məktəb', 'school',
    'university', 'universitet', 'təhsil',
  ],
  healthcare: [
    'tibb', 'doctor', 'həkim', 'nurse', 'tibb bacısı', 'hospital',
    'xəstəxana', 'pharmacy', 'aptek', 'medical', 'clinic', 'klinika',
    'dentist', 'diş həkimi', 'surgeon', 'cərrah',
  ],
  design: [
    'dizayn', 'design', 'дизайн', 'designer', 'dizayner', 'graphic',
    'ux', 'ui ', 'figma', 'photoshop', 'illustrator', 'indesign',
    'motion', 'video', 'animator', '3d',
  ],
  legal: [
    'hüquq', 'legal', 'юрист', 'lawyer', 'vəkil', 'attorney', 'counsel',
    'hüquqşünas', 'compliance', 'contract', 'müqavilə', 'litigation',
    'notary', 'notarius',
  ],
  production: [
    'istehsal', 'production', 'производство', 'manufacturing', 'operator',
    'texnik', 'technician', 'quality', 'keyfiyyət', 'iso', 'lean',
    'factory', 'zavod', 'fabrika',
  ],
  other: [],
}

export function categorize(title: string, description?: string): CategorySlug {
  const text = `${title} ${description || ''}`.toLowerCase()

  for (const [slug, keywords] of Object.entries(CATEGORY_KEYWORDS) as [CategorySlug, string[]][]) {
    if (slug === 'other') continue
    for (const keyword of keywords) {
      if (text.includes(keyword.toLowerCase())) {
        return slug
      }
    }
  }

  return 'other'
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug)
}
