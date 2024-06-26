import { ReactElement, useEffect, useState } from 'react';
import ModalContainer from '../ModalContainer';
import LessonForm from '../LessonForm';
import { Language, Lesson, RequestBody } from '@dialoq/types';
import { useAuthUser } from '../../services/user.service';
import { useAddLesson } from '../../services/lesson.service';
import { Box, Progress, Show, Text, VStack } from '@chakra-ui/react';
import DrawerContainer from '../DrawerContainer';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

const LessonOverlay = ({ isOpen, onClose, language }: Props): ReactElement => {
  const { data: user } = useAuthUser();
  const [lessonData, setLessonData] = useState<Partial<Lesson>>({
    name: '',
    theme: '',
    language,
  });
  const { mutate: addLesson, isLoading } = useAddLesson();

  useEffect(() => {
    setLessonData((prevState) => ({ ...prevState, language }));
  }, [language]);

  useEffect(() => {
    if (user?.id) {
      setLessonData((prevState) => ({ ...prevState, userId: user.id }));
    }
  }, [user]);

  const isLessonValid = (): boolean => {
    return (
      !!lessonData.language &&
      !!lessonData.userId &&
      !!lessonData.subtopic &&
      !!lessonData.theme
    );
  };

  const handleChange = (key: keyof Lesson, value: unknown): void => {
    setLessonData((prevState) => ({ ...prevState, [key]: value }));
  };

  const handleSubmit = (): void => {
    if (isLessonValid()) {
      addLesson(lessonData as RequestBody<Lesson>, {
        onSuccess: () => {
          onClose();
        },
      });
    }
  };

  return (
    <>
      <Show above="md">
        <ModalContainer
          isOpen={isOpen}
          onClose={onClose}
          onSubmit={handleSubmit}
          title="Add new Lesson"
          confirmText="Add"
          isLoading={isLoading}
        >
          {isLoading ? (
            <VStack>
              <Text>Generating new lesson. This may take a while...</Text>
              <Box width="full">
                <Progress size="md" isIndeterminate />
              </Box>
            </VStack>
          ) : (
            <LessonForm lessonData={lessonData} onChange={handleChange} />
          )}
        </ModalContainer>
      </Show>

      <Show below="md">
        <DrawerContainer
          isOpen={isOpen}
          onClose={onClose}
          onSubmit={handleSubmit}
          title="Add new Lesson"
          confirmText="Add"
          isLoading={isLoading}
        >
          {isLoading ? (
            <VStack>
              <Text>Generating new lesson. This may take a while...</Text>
              <Box width="full">
                <Progress size="sm" isIndeterminate />
              </Box>
            </VStack>
          ) : (
            <LessonForm lessonData={lessonData} onChange={handleChange} />
          )}
        </DrawerContainer>
      </Show>
    </>
  );
};

export default LessonOverlay;
