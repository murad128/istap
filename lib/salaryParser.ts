/**
 * Parse salary string into normalized min/max integer values (AZN monthly)
 * Returns null values if unparseable
 */
export function parseSalary(salary: string | null | undefined): {
  salaryMin: number | null;
  salaryMax: number | null;
  salaryNegotiable: boolean;
} {
  if (!salary || salary.trim() === '') {
    return { salaryMin: null, salaryMax: null, salaryNegotiable: false };
  }

  const s = salary.toLowerCase().trim();

  // Negotiable / hidden patterns
  const negotiablePatterns = [
    'razılaşma', 'razilasma', 'müzakirə', 'müzakire',
    'negotiable', 'upon agreement', 'competitive',
    'по договорённости', 'по договоренности', 'договорная',
    'gizli', 'hidden', 'confidential',
  ];
  if (negotiablePatterns.some(p => s.includes(p))) {
    return { salaryMin: null, salaryMax: null, salaryNegotiable: true };
  }

  // Extract all numbers from string
  const numbers = s.match(/\d[\d\s,.]*/g)?.map(n => {
    const cleaned = n.replace(/[\s,]/g, '').replace('.', '');
    return parseInt(cleaned, 10);
  }).filter(n => !isNaN(n) && n > 0) || [];

  if (numbers.length === 0) {
    return { salaryMin: null, salaryMax: null, salaryNegotiable: false };
  }

  // Yearly → monthly conversion
  const isYearly = /year|annual|illik|yıllıq|год/i.test(s);
  const convert = (n: number) => isYearly ? Math.round(n / 12) : n;

  if (numbers.length === 1) {
    const v = convert(numbers[0]);
    // Sanity check: between 50 and 50000 AZN/month
    if (v < 50 || v > 50000) return { salaryMin: null, salaryMax: null, salaryNegotiable: false };
    return { salaryMin: v, salaryMax: v, salaryNegotiable: false };
  }

  const min = convert(Math.min(...numbers));
  const max = convert(Math.max(...numbers));
  if (min < 50 || max > 50000) return { salaryMin: null, salaryMax: null, salaryNegotiable: false };
  return { salaryMin: min, salaryMax: max, salaryNegotiable: false };
}
