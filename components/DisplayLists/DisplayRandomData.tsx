'use client';

import { useTeacherBuddy } from '@/context/TeacherBuddyContext';
import { TRandomGenerator } from '@/lib/types';
import { capitalizeFirstLetter } from '@/utils/capitalizeFirstLetter';

const DisplayRandomData = ({ category }: { category: TRandomGenerator }) => {
  const { randomGenerator, resetRandomData, displaySelectedData } =
    useTeacherBuddy();

  return (
    <div>
      <button onClick={() => randomGenerator(category)} className="m-4">
        Select Random {`${category === 'students' ? 'Student' : 'Question'}`}
      </button>
      <button onClick={resetRandomData} className="m-4">
        Reset {capitalizeFirstLetter(category)}-List
      </button>
      {displaySelectedData && <p>{displaySelectedData}</p>}
    </div>
  );
};

export default DisplayRandomData;
