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
import { createPlaylist } from 'apiSdk/playlists';
import { Error } from 'components/error';
import { playlistValidationSchema } from 'validationSchema/playlists';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { UserInterface } from 'interfaces/user';
import { getUsers } from 'apiSdk/users';
import { PlaylistInterface } from 'interfaces/playlist';

function PlaylistCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: PlaylistInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createPlaylist(values);
      resetForm();
      router.push('/playlists');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<PlaylistInterface>({
    initialValues: {
      genre: '',
      user_id: (router.query.user_id as string) ?? null,
    },
    validationSchema: playlistValidationSchema,
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
            Create Playlist
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="genre" mb="4" isInvalid={!!formik.errors?.genre}>
            <FormLabel>Genre</FormLabel>
            <Input type="text" name="genre" value={formik.values?.genre} onChange={formik.handleChange} />
            {formik.errors.genre && <FormErrorMessage>{formik.errors?.genre}</FormErrorMessage>}
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
    entity: 'playlist',
    operation: AccessOperationEnum.CREATE,
  }),
)(PlaylistCreatePage);
