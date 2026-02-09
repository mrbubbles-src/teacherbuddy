'use client'

import { parseClassImportJson, parseClassImportText, parseClassNamesFromText } from '@/lib/classes'
import { normalizeStudentName, studentNameKey } from '@/lib/students'

import { useMemo, useState } from 'react'

import { toast } from 'sonner'

import ClassSelector from '@/components/classes/class-selector'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldSeparator,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useAppStore } from '@/context/app-store'

/** Event type for form submit; avoids deprecated React.FormEvent. */
type FormSubmitEvent = Parameters<
  NonNullable<React.ComponentProps<'form'>['onSubmit']>
>[0]
/** Event type for input change; avoids deprecated React.ChangeEvent. */
type InputChangeEvent = Parameters<
  NonNullable<React.ComponentProps<'input'>['onChange']>
>[0]

/**
 * Add/import classes and students form. Shows server-rendered skeleton until hydrated.
 * Class imports support text and JSON, while student imports target the selected class.
 */
export default function StudentForm({
  skeleton,
}: {
  skeleton: React.ReactNode
}) {
  const { state, actions } = useAppStore()

  const [classNameInput, setClassNameInput] = useState('')
  const [classError, setClassError] = useState<string | null>(null)
  const [classImportError, setClassImportError] = useState<string | null>(null)
  const [classImportNotice, setClassImportNotice] = useState<string | null>(null)

  const [studentNameInput, setStudentNameInput] = useState('')
  const [studentError, setStudentError] = useState<string | null>(null)
  const [studentImportError, setStudentImportError] = useState<string | null>(null)
  const [studentImportNotice, setStudentImportNotice] = useState<string | null>(null)

  const activeClassId = state.persisted.activeClassId
  const activeClass = state.persisted.classes.find((entry) => entry.id === activeClassId) ?? null

  const studentsInActiveClass = useMemo(
    () => state.persisted.students.filter((student) => student.classId === activeClassId),
    [activeClassId, state.persisted.students]
  )

  /**
   * Adds normalized class names while preventing duplicate class titles.
   * Accepts comma/newline-delimited text and returns the number of classes created.
   */
  const addClassNames = (raw: string) => {
    const existing = new Set(
      state.persisted.classes.map((entry) => entry.name.trim().toLocaleLowerCase())
    )

    const names = parseClassNamesFromText(raw)
    const uniqueNames: string[] = []

    for (const name of names) {
      const key = name.toLocaleLowerCase()
      if (existing.has(key)) continue
      existing.add(key)
      uniqueNames.push(name)
    }

    for (const name of uniqueNames) {
      actions.addClass(name)
    }

    return uniqueNames.length
  }

  /**
   * Adds normalized student names into the currently selected class.
   * Returns how many new students were created.
   */
  const addStudentsToActiveClass = (raw: string) => {
    if (!activeClassId) {
      setStudentError('Create and select a class first.')
      return 0
    }

    const existingKeys = new Set(
      studentsInActiveClass.map((student) => studentNameKey(student.name))
    )
    const names = raw
      .split(',')
      .map((entry) => normalizeStudentName(entry))
      .filter(Boolean)

    const uniqueNames: string[] = []
    for (const entry of names) {
      const key = studentNameKey(entry)
      if (existingKeys.has(key)) continue
      existingKeys.add(key)
      uniqueNames.push(entry)
    }

    for (const entry of uniqueNames) {
      actions.addStudent(entry)
    }

    return uniqueNames.length
  }

  /**
   * Handles manual class creation from input text.
   */
  const handleClassSubmit = (event: FormSubmitEvent) => {
    event.preventDefault()
    const added = addClassNames(classNameInput)
    if (!added) {
      setClassError('Enter at least one new class name.')
      toast.error('Enter at least one new class name.')
      return
    }

    setClassNameInput('')
    setClassError(null)
    setClassImportError(null)
    setClassImportNotice(`Added ${added} class${added === 1 ? '' : 'es'}.`)
    toast.success(`Added ${added} class${added === 1 ? '' : 'es'}.`)
  }

  /**
   * Deletes a class and all students assigned to it.
   */
  const handleDeleteClass = (classId: string, className: string) => {
    actions.deleteClass(classId)
    toast.success(`Deleted class ${className}.`)
  }

  /**
   * Deletes every class and all class-scoped student/group/project data.
   */
  const handleDeleteAllClasses = () => {
    actions.clearClasses()
    toast.success('Deleted all classes.')
  }

  /**
   * Builds a concise import summary including skipped records when present.
   */
  const buildClassImportSummary = (
    classCount: number,
    studentCount: number,
    skippedClasses: number,
    skippedStudents: number
  ) => {
    const summary = `Imported ${classCount} class${classCount === 1 ? '' : 'es'} and ${studentCount} student${studentCount === 1 ? '' : 's'}.`
    const skippedBits = [
      skippedClasses ? `${skippedClasses} invalid class line${skippedClasses === 1 ? '' : 's'} skipped` : null,
      skippedStudents
        ? `${skippedStudents} invalid or duplicate student${skippedStudents === 1 ? '' : 's'} skipped`
        : null,
    ].filter((entry): entry is string => entry !== null)

    if (!skippedBits.length) {
      return summary
    }
    return `${summary} ${skippedBits.join('; ')}.`
  }

  /**
   * Imports class data from .txt or .json files.
   */
  const handleClassFileImport = async (event: InputChangeEvent) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const text = await file.text()
      const isJsonFile =
        file.name.toLocaleLowerCase().endsWith('.json') ||
        file.type.toLocaleLowerCase().includes('json')

      const parsed = isJsonFile ? parseClassImportJson(text) : parseClassImportText(text)
      if (!parsed.ok) {
        setClassImportError(parsed.error)
        setClassImportNotice(null)
        toast.error(parsed.error)
        return
      }

      actions.importClassRecords(parsed.classes)
      const studentCount = parsed.classes.reduce(
        (count, classRecord) => count + classRecord.students.length,
        0
      )
      const summary = buildClassImportSummary(
        parsed.classes.length,
        studentCount,
        parsed.skippedClasses,
        parsed.skippedStudents
      )
      setClassImportError(null)
      setClassImportNotice(
        `${summary} Matching class names overwrite that class roster with imported students.`
      )
      toast.success(summary)
    } catch (error) {
      console.error('Failed to import classes', error)
      const message = 'Could not read the class file. Please try again.'
      setClassImportError(message)
      setClassImportNotice(null)
      toast.error(message)
    } finally {
      event.target.value = ''
    }
  }

  /**
   * Handles manual student entry submission for the selected class.
   */
  const handleStudentSubmit = (event: FormSubmitEvent) => {
    event.preventDefault()
    const addedCount = addStudentsToActiveClass(studentNameInput)
    if (!addedCount) {
      toast.error('Enter at least one new student name.')
      setStudentError('Enter at least one new student name.')
      return
    }

    setStudentNameInput('')
    setStudentError(null)
    setStudentImportNotice(null)
    toast.success(`Added ${addedCount} student${addedCount === 1 ? '' : 's'}.`)
  }

  /**
   * Imports students from text into the selected class.
   */
  const handleStudentFileImport = async (event: InputChangeEvent) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const text = await file.text()
      const addedCount = addStudentsToActiveClass(text)
      if (!addedCount) {
        const message = 'No new students were found in that file.'
        setStudentImportError(message)
        setStudentImportNotice(null)
        toast.error(message)
      } else {
        setStudentImportError(null)
        setStudentImportNotice(
          `Imported ${addedCount} student${addedCount === 1 ? '' : 's'} into ${activeClass?.name ?? 'the selected class'}.`
        )
        toast.success(`Imported ${addedCount} student${addedCount === 1 ? '' : 's'}.`)
      }
    } catch (error) {
      console.error('Failed to import students', error)
      const message = 'Could not read the student file. Please try again.'
      setStudentImportError(message)
      setStudentImportNotice(null)
      toast.error(message)
    } finally {
      event.target.value = ''
    }
  }

  if (!state.ui.isHydrated) {
    return <>{skeleton}</>
  }

  return (
    <Card
      data-students-form-card
      className='relative overflow-hidden rounded-xl border-border/50 shadow-md py-6 xl:py-8 lg:gap-6 xl:gap-8'>
      <div
        className='absolute left-0 top-0 h-full w-1 rounded-l-xl'
        style={{ backgroundColor: 'var(--chart-1)', opacity: 0.6 }}
      />
      <CardHeader className='px-6 xl:px-8'>
        <CardTitle className='text-xl font-bold tracking-tight'>Classes and Students</CardTitle>
        <CardDescription className='text-base/relaxed'>
          Create classes first, then add or import students into the selected class.
        </CardDescription>
      </CardHeader>
      <CardContent className='px-6 xl:px-8 gap-5 xl:gap-6 text-base/relaxed flex flex-col'>
        <Field>
          <FieldLabel className='text-lg/relaxed'>Active class</FieldLabel>
          <FieldContent className='gap-3'>
            <div className='flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between'>
              <ClassSelector compact />
              <div className='flex flex-wrap gap-2 lg:justify-end'>
                <AlertDialog>
                  <AlertDialogTrigger
                    render={
                      <Button
                        type='button'
                        variant='destructive'
                        size='sm'
                        disabled={!activeClass}>
                        Delete Class
                      </Button>
                    }>
                    Delete Class
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete {activeClass?.name ?? 'this class'}?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This removes the class and all students, breakout groups, and project lists tied to it.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => {
                          if (!activeClass) return
                          handleDeleteClass(activeClass.id, activeClass.name)
                        }}>
                        Delete Class
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <AlertDialog>
                  <AlertDialogTrigger
                    render={
                      <Button
                        type='button'
                        variant='destructive'
                        size='sm'
                        disabled={!state.persisted.classes.length}>
                        Delete All Classes
                      </Button>
                    }>
                    Delete All Classes
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete every class?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This clears all classes and their students, breakout groups, and project lists.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteAllClasses}>
                        Delete All Classes
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
            {activeClass ? (
              <p className='text-base/relaxed text-muted-foreground'>
                {activeClass.name} · {studentsInActiveClass.length} student
                {studentsInActiveClass.length === 1 ? '' : 's'}
              </p>
            ) : (
              <p className='text-base/relaxed text-muted-foreground'>
                No class selected yet. Add a class below.
              </p>
            )}
          </FieldContent>
        </Field>

        <form onSubmit={handleClassSubmit}>
          <Field>
            <FieldLabel htmlFor='class-name' className='text-lg/relaxed'>
              Add class
            </FieldLabel>
            <FieldContent className='gap-2'>
              <div className='flex flex-col md:flex-row gap-4'>
                <Input
                  id='class-name'
                  value={classNameInput}
                  onChange={(event) => {
                    setClassNameInput(event.target.value)
                    if (classError) setClassError(null)
                  }}
                  placeholder='e.g. Math 101, Science 2B'
                  className='text-base/relaxed h-9 placeholder:text-muted-foreground/70 placeholder:text-base/relaxed'
                />
                <Button type='submit' className='h-9 font-semibold text-base'>
                  Add Class
                </Button>
              </div>
              <FieldDescription className='text-base/relaxed text-muted-foreground/70'>
                Separate multiple class names with commas.
              </FieldDescription>
              {classError ? <FieldError>{classError}</FieldError> : null}
            </FieldContent>
          </Field>
        </form>

        <FieldSeparator>Import classes</FieldSeparator>
        <Field>
          <FieldLabel htmlFor='class-import' className='text-lg/relaxed'>
            Import full classes (.txt or .json)
          </FieldLabel>
          <FieldContent className='gap-2'>
            <Input
              id='class-import'
              type='file'
              accept='.txt,.json,text/plain,application/json'
              onChange={handleClassFileImport}
              className='text-base/relaxed h-10 max-w-full file:text-base/relaxed file:text-muted-foreground/70 file:mr-5 file:px-5 file:bg-accent/10 file:border-accent/50 file:rounded-md file:cursor-pointer file:my-1'
            />
            <FieldDescription className='text-base/relaxed text-muted-foreground/70'>
              This import includes everything for each class: class name + student roster.
            </FieldDescription>
            <FieldDescription className='text-base/relaxed text-muted-foreground/70'>
              If a class name already exists, its roster is replaced by the imported students.
            </FieldDescription>
            <FieldDescription className='text-base/relaxed text-muted-foreground/70'>
              `.txt` format: one class per line, using `Class Name: Student One, Student Two`.
            </FieldDescription>
            <pre className='rounded-md border border-border/60 bg-muted/20 p-3 text-xs text-muted-foreground whitespace-pre-wrap'>
{`Math 101: Alex Johnson, Sam Lee, Priya Patel
Science 2B: Omar Khan, Lina Cho
History: Noah Rivera, Ava Johnson`}
            </pre>
            <FieldDescription className='text-base/relaxed text-muted-foreground/70'>
              `.json` format supports one class object or an array of class objects.
            </FieldDescription>
            <pre className='rounded-md border border-border/60 bg-muted/20 p-3 text-xs text-muted-foreground whitespace-pre-wrap'>
{`{
  "classId": "optional-class-id",
  "className": "Math 101",
  "students": [
    "Alex Johnson",
    { "name": "Sam Lee", "id": "optional-student-id" }
  ]
}`}
            </pre>
            <FieldDescription className='text-base/relaxed text-muted-foreground/70'>
              For multiple classes, wrap class objects in an array.
            </FieldDescription>
            {classImportError ? <FieldError>{classImportError}</FieldError> : null}
            {classImportNotice ? (
              <p className='text-base/relaxed text-muted-foreground'>{classImportNotice}</p>
            ) : null}
          </FieldContent>
        </Field>

        <FieldSeparator>Students</FieldSeparator>

        <form onSubmit={handleStudentSubmit}>
          <Field className='flex-1'>
            <FieldLabel htmlFor='student-name' className='text-lg/relaxed'>
              Student name
            </FieldLabel>
            <FieldContent className='gap-2'>
              <div className='flex flex-col md:flex-row gap-4'>
                <Input
                  id='student-name'
                  value={studentNameInput}
                  onChange={(event) => {
                    setStudentNameInput(event.target.value)
                    if (studentError) setStudentError(null)
                  }}
                  placeholder='e.g. Alex Johnson, Sam Lee, Priya Patel'
                  aria-label='Student name'
                  disabled={!activeClassId}
                  className='text-base/relaxed h-9 placeholder:text-muted-foreground/70 placeholder:text-base/relaxed'
                />
                <Button
                  type='submit'
                  disabled={!activeClassId}
                  className='h-9 font-semibold text-base'>
                  Add Student
                </Button>
              </div>
              <FieldDescription className='text-base/relaxed text-muted-foreground/70'>
                Students are added to the selected class.
              </FieldDescription>
              {studentError ? <FieldError>{studentError}</FieldError> : null}
            </FieldContent>
          </Field>
        </form>

        <Field>
          <FieldLabel htmlFor='student-import' className='text-lg/relaxed'>
            Import students from .txt
          </FieldLabel>
          <FieldContent className='gap-2'>
            <Input
              id='student-import'
              type='file'
              accept='.txt,text/plain'
              onChange={handleStudentFileImport}
              disabled={!activeClassId}
              className='text-base/relaxed h-10 max-w-full file:text-base/relaxed file:text-muted-foreground/70 file:mr-5 file:px-5 file:bg-accent/10 file:border-accent/50 file:rounded-md file:cursor-pointer file:my-1'
            />
            <FieldDescription className='text-base/relaxed text-muted-foreground/70'>
              This import adds students only to the currently selected class.
            </FieldDescription>
            <FieldDescription className='text-base/relaxed text-muted-foreground/70'>
              `.txt` format: comma-separated student names for the selected class.
            </FieldDescription>
            <pre className='rounded-md border border-border/60 bg-muted/20 p-3 text-xs text-muted-foreground whitespace-pre-wrap'>
{`Alex Johnson, Sam Lee, Priya Patel`}
            </pre>
            {studentImportError ? <FieldError>{studentImportError}</FieldError> : null}
            {studentImportNotice ? (
              <p className='text-base/relaxed text-muted-foreground'>{studentImportNotice}</p>
            ) : null}
          </FieldContent>
        </Field>
      </CardContent>
    </Card>
  )
}
