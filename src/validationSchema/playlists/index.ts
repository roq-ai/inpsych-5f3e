import * as yup from 'yup';

export const playlistValidationSchema = yup.object().shape({
  genre: yup.string().required(),
  user_id: yup.string().nullable(),
});
