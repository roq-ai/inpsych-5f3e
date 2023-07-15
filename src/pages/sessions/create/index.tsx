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
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createSession } from 'apiSdk/sessions';
import { Error } from 'components/error';
import { sessionValidationSchema } from 'validationSchema/sessions';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { UserInterface } from 'interfaces/user';
import { getUsers } from 'apiSdk/users';
import { SessionInterface } from 'interfaces/session';

function SessionCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: SessionInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createSession(values);
      resetForm();
      router.push('/sessions');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<SessionInterface>({
    initialValues: {
      duration: 0,
      break_time: 0,
      user_id: (router.query.user_id as string) ?? null,
    },
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
            Create Session
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
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
    operation: AccessOperationEnum.CREATE,
  }),
)(SessionCreatePage);
