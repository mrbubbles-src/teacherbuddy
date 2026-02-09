import userEvent from '@testing-library/user-event';
import { screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { renderWithProvider } from '@/__tests__/test-utils';
import QuizEditorForm from '@/components/quizzes/quiz-editor-form';

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('QuizEditorForm', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  /**
   * Renders the quiz editor form with a fresh quiz draft.
   *
   * @returns Testing-library utilities and mounted form content.
   */
  const renderForm = () =>
    renderWithProvider(<QuizEditorForm quiz={null} quizId={null} />);

  it('renders a unified builder card with question and import controls', () => {
    const { container } = renderForm();

    expect(screen.getByText('Quiz Builder')).toBeInTheDocument();
    expect(screen.getByLabelText(/quiz title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/quiz description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/add question/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/import quiz from json/i)).toBeInTheDocument();
    expect(container.querySelector('.overflow-y-auto')).not.toBeInTheDocument();
  });

  it('imports a valid json file into the current draft', async () => {
    const user = userEvent.setup();
    const { container } = renderForm();

    const fileInput = screen.getByLabelText(/import quiz from json/i);
    const file = new File(
      [
        JSON.stringify({
          title: 'Math Quiz',
          description: 'optional',
          questions: [
            { prompt: 'What is 2 + 2?', answer: '4' },
            { prompt: 'What is 3 + 3?', answer: '6' },
          ],
        }),
      ],
      'quiz.json',
      { type: 'application/json' },
    );

    await user.upload(fileInput, file);

    await waitFor(() => {
      expect(screen.getByDisplayValue('Math Quiz')).toBeInTheDocument();
      expect(screen.getByDisplayValue('optional')).toBeInTheDocument();
      expect(screen.getByText('Loaded 2 questions into the draft.')).toBeInTheDocument();
      expect(screen.getAllByText('What is 2 + 2?').length).toBeGreaterThan(0);
      expect(container.querySelector('.overflow-y-auto')).toBeInTheDocument();
    });
  });

  it('shows an error for invalid json files', async () => {
    const user = userEvent.setup();
    renderForm();

    const fileInput = screen.getByLabelText(/import quiz from json/i);
    const file = new File(['{invalid json'], 'broken.json', {
      type: 'application/json',
    });

    await user.upload(fileInput, file);

    await waitFor(() => {
      expect(
        screen.getByText('Invalid JSON file. Please check the format and try again.'),
      ).toBeInTheDocument();
    });
  });

  it('shows a schema error for missing required json fields', async () => {
    const user = userEvent.setup();
    renderForm();

    const fileInput = screen.getByLabelText(/import quiz from json/i);
    const file = new File([JSON.stringify({ title: 'Missing questions' })], 'invalid-schema.json', {
      type: 'application/json',
    });

    await user.upload(fileInput, file);

    await waitFor(() => {
      expect(
        screen.getByText('Import must match: title + questions[{prompt,answer}].'),
      ).toBeInTheDocument();
    });
  });
});
