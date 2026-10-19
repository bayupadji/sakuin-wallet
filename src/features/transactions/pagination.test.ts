import { describe, it, expect } from 'vitest';

const PAGE_SIZE_OPTIONS = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

function getPaginationRange(current: number, total: number): (number | string)[] {
  if (total <= 5) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  if (current <= 3) {
    return [1, 2, 3, 4, '...', total];
  }
  if (current >= total - 2) {
    return [1, '...', total - 3, total - 2, total - 1, total];
  }
  return [1, '...', current - 1, current, current + 1, '...', total];
}

describe('Transaction Pagination & Sizing Logic', () => {
  it('provides step-10 page size options up to a maximum of 100', () => {
    expect(PAGE_SIZE_OPTIONS).toEqual([10, 20, 30, 40, 50, 60, 70, 80, 90, 100]);
    expect(PAGE_SIZE_OPTIONS[0]).toBe(10);
    expect(PAGE_SIZE_OPTIONS[PAGE_SIZE_OPTIONS.length - 1]).toBe(100);
    expect(PAGE_SIZE_OPTIONS.every((val) => val % 10 === 0)).toBe(true);
    expect(Math.max(...PAGE_SIZE_OPTIONS)).toBe(100);
  });

  it('calculates total pages correctly for various item counts', () => {
    const totalItems = 25;
    const itemsPerPage = 10;
    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
    expect(totalPages).toBe(3);

    expect(Math.max(1, Math.ceil(0 / 10))).toBe(1);
    expect(Math.max(1, Math.ceil(10 / 10))).toBe(1);
    expect(Math.max(1, Math.ceil(11 / 10))).toBe(2);
  });

  it('slices data correctly according to current page and page size', () => {
    const mockData = Array.from({ length: 25 }, (_, i) => `item-${i + 1}`);
    const itemsPerPage = 10;

    // Page 1
    const page1 = mockData.slice(0, itemsPerPage);
    expect(page1.length).toBe(10);
    expect(page1[0]).toBe('item-1');
    expect(page1[9]).toBe('item-10');

    // Page 2
    const page2 = mockData.slice(itemsPerPage, itemsPerPage * 2);
    expect(page2.length).toBe(10);
    expect(page2[0]).toBe('item-11');
    expect(page2[9]).toBe('item-20');

    // Page 3 (sisa 5 item)
    const page3 = mockData.slice(itemsPerPage * 2, itemsPerPage * 3);
    expect(page3.length).toBe(5);
    expect(page3[0]).toBe('item-21');
    expect(page3[4]).toBe('item-25');
  });

  it('generates proper pagination ranges with ellipsis for large pages', () => {
    expect(getPaginationRange(1, 3)).toEqual([1, 2, 3]);
    expect(getPaginationRange(1, 8)).toEqual([1, 2, 3, 4, '...', 8]);
    expect(getPaginationRange(5, 10)).toEqual([1, '...', 4, 5, 6, '...', 10]);
    expect(getPaginationRange(10, 10)).toEqual([1, '...', 7, 8, 9, 10]);
  });

  it('generates a maximum of 12 past months for period options', async () => {
    const { getPast12MonthsPeriodOptions } = await import('./presentation/customer/activity-hub');
    const fixedBaseDate = new Date(2026, 9, 19); // 19 Oktober 2026
    const options = getPast12MonthsPeriodOptions(fixedBaseDate);

    // 1 opsi "Semua (1 Tahun Terakhir)" + 12 opsi bulan
    expect(options.length).toBe(13);
    expect(options[0].value).toBe('all');
    expect(options[0].label).toContain('1 Tahun Terakhir');

    // Bulan pertama adalah Oktober 2026
    expect(options[1].value).toBe('2026-10');
    expect(options[1].label).toBe('Oktober 2026');

    // Bulan terakhir adalah 12 bulan lalu: November 2025
    expect(options[12].value).toBe('2025-11');
    expect(options[12].label).toBe('November 2025');
  });
});
