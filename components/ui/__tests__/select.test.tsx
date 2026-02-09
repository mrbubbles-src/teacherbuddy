import { render, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

/**
 * Renders an open select so popup-level behavior can be asserted in tests.
 *
 * @param alignItemWithTrigger Optional popup alignment override.
 * @returns Promise resolving to the rendered popup element.
 */
async function renderOpenSelect(
  alignItemWithTrigger?: boolean,
): Promise<HTMLElement> {
  render(
    <Select defaultOpen defaultValue="class-a">
      <SelectTrigger aria-label="Class select">
        <SelectValue placeholder="Select class" />
      </SelectTrigger>
      <SelectContent
        {...(alignItemWithTrigger === undefined
          ? {}
          : { alignItemWithTrigger })}>
        <SelectItem value="class-a">Class A</SelectItem>
        <SelectItem value="class-b">Class B</SelectItem>
      </SelectContent>
    </Select>,
  );

  let popup: HTMLElement | null = null;
  await waitFor(() => {
    popup = document.querySelector<HTMLElement>('[data-slot="select-content"]');
    expect(popup).not.toBeNull();
  });

  if (!popup) {
    throw new Error('Select popup did not render');
  }

  return popup;
}

describe('SelectContent', () => {
  it('defaults to popper-style popup behavior', async () => {
    const popup = await renderOpenSelect();
    expect(popup).toHaveAttribute('data-align-trigger', 'false');
  });

  it('supports explicit trigger-aligned popup behavior', async () => {
    const popup = await renderOpenSelect(true);
    expect(popup).toHaveAttribute('data-align-trigger', 'true');
  });
});
