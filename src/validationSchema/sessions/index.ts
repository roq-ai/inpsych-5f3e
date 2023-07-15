import * as yup from 'yup';

export const sessionValidationSchema = yup.object().shape({
  duration: yup.number().integer().required(),
  break_time: yup.number().integer().required(),
  user_id: yup.string().nullable(),
});
