import moment from 'moment-timezone';

const TIMEZONE = 'Asia/Kolkata';

export const getCurrentDateTimeInTimeZone = () => {
    return moment().tz(TIMEZONE);
};

export const formatDateToTimeZone = (date) => {
    return moment(date).tz(TIMEZONE);
};

export const getCurrentDateInTimeZone = () => {
    return moment().tz(TIMEZONE).format('YYYY-MM-DD');
};

export const getCurrentTimeInTimeZone = () => {
    return moment().tz(TIMEZONE).format('HH:mm');
};

export default TIMEZONE;
