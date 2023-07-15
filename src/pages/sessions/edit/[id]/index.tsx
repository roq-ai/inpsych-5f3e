import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getSessionById, updateSessionById } from 'apiSdk/sessions';
import { Error } from 'components/error';
import { sessionValidationSchema } from 'validationSchema/sessions';
import { SessionInterface } from 'interfaces/session';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { UserInterface } from 'interfaces/user';
import { getUsers } from 'apiSdk/users';

function SessionEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<SessionInterface>(
    () => (id ? `/sessions/${id}` : null),
    () => getSessionById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: SessionInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateSessionById(id, values);
      mutate(updated);
      resetForm();
      router.push('/sessions');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<SessionInterface>({
    initialValues: data,
    validationSchema: sessionValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Edit Session
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <FormControl id="duration" mb="4" isInvalid={!!formik.errors?.duration}>
              <FormLabel>Duration</FormLabel>
              <NumberInput
                name="duration"
                value={formik.values?.duration}
                onChange={(valueString, valueNumber) =>
                  formik.setFieldValue('duration', Number.isNaN(valueNumber) ? 0 : valueNumber)
                }
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              {formik.errors.duration && <FormErrorMessage>{formik.errors?.duration}</FormErrorMessage>}
            </FormControl>
            <FormControl id="break_time" mb="4" isInvalid={!!formik.errors?.break_time}>
              <FormLabel>Break Time</FormLabel>
              <NumberInput
                name="break_time"
                value={formik.values?.break_time}
                onChange={(valueString, valueNumber) =>
                  formik.setFieldValue('break_time', Number.isNaN(valueNumber) ? 0 : valueNumber)
                }
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              {formik.errors.break_time && <FormErrorMessage>{formik.errors?.break_time}</FormErrorMessage>}
            </FormControl>
            <AsyncSelect<UserInterface>
              formik={formik}
              name={'user_id'}
              label={'Select User'}
              placeholder={'Select User'}
              fetcher={getUsers}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.email}
                </option>
              )}
            />
            <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
              Submit
            </Button>
          </form>
        )}
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'session',
    operation: AccessOperationEnum.UPDATE,
  }),
)(SessionEditPage);
