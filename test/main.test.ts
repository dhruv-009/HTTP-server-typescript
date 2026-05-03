import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { main } from '../src/main';

describe('main', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await mkdtemp(path.join(tmpdir(), 'http-server-ts-'));
  });

  afterEach(async () => {
    vi.restoreAllMocks();
    await rm(tempDir, { recursive: true, force: true });
  });

  it('logs each full line from the file', async () => {
    const filePath = path.join(tempDir, 'messages.txt');
    await writeFile(filePath, 'first line\nsecond line\nthird line\n');

    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined);

    main(filePath);

    await vi.waitFor(() => {
      expect(logSpy).toHaveBeenCalledTimes(3);
    });

    expect(logSpy).toHaveBeenNthCalledWith(1, 'read: first line');
    expect(logSpy).toHaveBeenNthCalledWith(2, 'read: second line');
    expect(logSpy).toHaveBeenNthCalledWith(3, 'read: third line');
  });

  it('does not log partial 8-byte chunks as lines', async () => {
    const filePath = path.join(tempDir, 'messages.txt');
    await writeFile(filePath, 'abcdefghij\nklmnopqrstuv\n');

    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined);

    main(filePath);

    await vi.waitFor(() => {
      expect(logSpy).toHaveBeenCalledTimes(2);
    });

    expect(logSpy).toHaveBeenNthCalledWith(1, 'read: abcdefghij');
    expect(logSpy).toHaveBeenNthCalledWith(2, 'read: klmnopqrstuv');
  });
});
