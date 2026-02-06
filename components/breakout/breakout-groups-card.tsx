'use client';

import type { Student } from '@/lib/models';

import { formatStudentName } from '@/lib/students';

import { useEffect, useMemo, useRef, useState } from 'react';

import { CheckIcon, CopyIcon } from 'lucide-react';
import { toast } from 'sonner';

import GeneratorCardSkeleton from '@/components/loading/generator-card-skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAppStore } from '@/context/app-store';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { useTheme } from '@/hooks/use-theme';

const DEFAULT_GROUP_SIZE = 3;

/**
 * Renders breakout room generation controls and the resulting student groups.
 * Uses active students from app state and supports copying full or per-group output.
 */
export default function BreakoutGroupsCard() {
  const { theme } = useTheme();
  const { state, actions } = useAppStore();
  const [groupSizeOverride, setGroupSizeOverride] = useState<number | null>(
    null,
  );
  const {
    copy: copyAll,
    isCopied: isAllCopied,
    reset: resetAllCopy,
  } = useCopyToClipboard();
  const { copy: copyGroup, reset: resetGroupCopy } = useCopyToClipboard();
  const [copiedGroupIndex, setCopiedGroupIndex] = useState<number | null>(null);
  const copyGroupTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (copyGroupTimeoutRef.current !== null) {
        clearTimeout(copyGroupTimeoutRef.current);
      }
    };
  }, []);

  const activeStudents = useMemo(
    () =>
      state.persisted.students.filter((student) => student.status === 'active'),
    [state.persisted.students],
  );

  const persistedGroups = state.persisted.breakoutGroups;
  const groupSizeToUse =
    groupSizeOverride ?? persistedGroups?.groupSize ?? DEFAULT_GROUP_SIZE;
  const canGenerateGroups = activeStudents.length > 0 && groupSizeToUse > 0;

  const studentById = useMemo(() => {
    return new Map(
      state.persisted.students.map((student) => [student.id, student]),
    );
  }, [state.persisted.students]);

  const groups = useMemo((): Student[][] => {
    if (!persistedGroups) return [];
    return persistedGroups.groupIds
      .map(
        (group: string[]) =>
          group
            .map((id: string) => studentById.get(id))
            .filter(Boolean) as Student[],
      )
      .filter((group: Student[]) => group.length > 0);
  }, [persistedGroups, studentById]);

  const groupSummary = useMemo(() => {
    return groups
      .map((group: Student[], index: number) => {
        const names = group
          .map((student: Student) => formatStudentName(student.name))
          .join(', ');
        return `Group ${index + 1}: ${names}`;
      })
      .join('\n');
  }, [groups]);

  const buildGroups = (students: Student[], size: number) => {
    const shuffled = [...students];
    for (let index = shuffled.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [shuffled[index], shuffled[swapIndex]] = [
        shuffled[swapIndex],
        shuffled[index],
      ];
    }
    const nextGroups: Student[][] = [];
    for (let index = 0; index < shuffled.length; index += size) {
      nextGroups.push(shuffled.slice(index, index + size));
    }
    return nextGroups;
  };

  if (!state.ui.isHydrated) {
    return <GeneratorCardSkeleton />;
  }

  return (
    <Card className="shadow-md py-6 xl:py-8 lg:gap-6 xl:gap-8">
      <CardHeader className="flex flex-row items-start justify-between gap-2 px-6 xl:px-8">
        <div className="flex flex-col gap-1">
          <CardTitle className="text-xl">Breakout Rooms</CardTitle>
          <CardDescription className="text-base/relaxed">
            Shuffle active students into randomized breakout groups.
          </CardDescription>
        </div>
        <Badge
          variant="outline"
          className="p-2.5 text-sm border-accent/50 shadow-sm shrink-0">
          {activeStudents.length} students
        </Badge>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 px-6 xl:px-8 lg:gap-5 xl:gap-6 text-base/relaxed text-muted-foreground">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <label className="flex flex-1 flex-col gap-1 text-sm font-medium text-foreground lg:text-base">
            Group size
            <Input
              type="number"
              min={1}
              inputMode="numeric"
              value={groupSizeToUse}
              onChange={(event) => {
                const nextValue = Number(event.target.value);
                if (!Number.isNaN(nextValue)) {
                  setGroupSizeOverride(nextValue);
                }
              }}
              className="text-base/relaxed h-9 placeholder:text-muted-foreground/70 placeholder:text-base/relaxed"
            />
          </label>
          <Button
            className="h-9 font-semibold text-base sm:min-w-32"
            disabled={!canGenerateGroups}
            onClick={() => {
              const size = Math.max(groupSizeToUse, 1);
              const nextGroups = buildGroups(activeStudents, size);
              actions.setBreakoutGroups({
                groupSize: size,
                groupIds: nextGroups.map((group) =>
                  group.map((student) => student.id),
                ),
                createdAt: Date.now(),
              });
              setGroupSizeOverride(null);
              resetAllCopy();
              resetGroupCopy();
              if (copyGroupTimeoutRef.current !== null) {
                clearTimeout(copyGroupTimeoutRef.current);
                copyGroupTimeoutRef.current = null;
              }
              setCopiedGroupIndex(null);
            }}>
            Generate Groups
          </Button>
          <Button
            variant="secondary"
            className="h-9 font-semibold text-base sm:min-w-32"
            disabled={!groups.length}
            onClick={async () => {
              const ok = await copyAll(groupSummary);
              if (!ok) toast.error('Failed to copy to clipboard.');
            }}>
            {isAllCopied ? 'Copied!' : 'Copy Groups'}
          </Button>
        </div>
        {groups.length ? (
          <div className="flex flex-wrap gap-4 items-center">
            {groups.map((group: Student[], index: number) => (
              <div
                key={`group-${index}`}
                className="flex flex-col rounded-md border border-border/60 px-3 py-2 w-fit flex-wrap
                ">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm/relaxed font-medium uppercase tracking-[0.2em] text-muted-foreground">
                    Group {index + 1}
                  </p>
                  <Button
                    disabled={copiedGroupIndex === index}
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label={
                      copiedGroupIndex === index
                        ? `Copied group ${index + 1}`
                        : `Copy group ${index + 1}`
                    }
                    onClick={async () => {
                      const names = group
                        .map((student: Student) =>
                          formatStudentName(student.name),
                        )
                        .join(', ');
                      const ok = await copyGroup(names);
                      if (!ok) {
                        toast.error('Failed to copy to clipboard.');
                        return;
                      }
                      setCopiedGroupIndex(index);
                      if (copyGroupTimeoutRef.current !== null) {
                        clearTimeout(copyGroupTimeoutRef.current);
                      }
                      copyGroupTimeoutRef.current = setTimeout(() => {
                        setCopiedGroupIndex(null);
                        copyGroupTimeoutRef.current = null;
                      }, 2000);
                    }}>
                    {copiedGroupIndex === index ? (
                      <CheckIcon
                        className={`${theme === 'dark' ? 'text-ctp-mocha-green' : 'text-ctp-latte-green'}`}
                      />
                    ) : (
                      <CopyIcon
                        className={`${theme === 'dark' ? 'text-ctp-mocha-peach/75' : 'text-ctp-latte-peach/50'}`}
                      />
                    )}
                  </Button>
                </div>
                <p className="text-lg/relaxed text-foreground">
                  {group
                    .map((student: Student) => formatStudentName(student.name))
                    .join(', ')}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-border/60 bg-background/60 px-4 py-6 text-center min-h-[100px] flex flex-col justify-center">
            <p className="text-sm text-muted-foreground lg:text-base">
              Generate groups to see the breakout room list.
            </p>
            {!activeStudents.length ? (
              <p className="mt-2 text-xs text-muted-foreground lg:text-sm">
                Add or re-enable students to begin.
              </p>
            ) : null}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
