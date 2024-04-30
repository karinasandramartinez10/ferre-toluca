import numeral from 'numeral';

export const formatPhoneNumber = (phoneNumber) => {
  return numeral(phoneNumber).format("000-000-0000");
};
