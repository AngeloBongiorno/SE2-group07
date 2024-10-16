import dayjs from 'dayjs';

/**
 * Creates a dayjs object with the given time.
 * Tcurrent date is used for the date part.
 * 
 * @param timeString - The time string in the format 'HH:mm:ss'.
 * @returns A dayjs object with the current date and the given time.
 */
function dayjsFromTime(timeString: string) {
    // Get the current date in 'YYYY-MM-DD' format
    const currentDate = dayjs().format('YYYY-MM-DD');
    
    // Combine the current date with the given time
    const dateTimeString = `${currentDate} ${timeString}`;
    
    // Create and return the dayjs object
    return dayjs(dateTimeString);
}

/**
 * Converts a dayjs object to a time string in the format 'HH:mm:ss'.
 * 
 * @param dayjsObject - The dayjs object to convert.
 * @returns The time string in the format 'HH:mm:ss'.
 */
function dayjsToTime(dayjsObject: dayjs.Dayjs) {
    return dayjsObject.format('HH:mm:ss');
}

export { dayjsFromTime, dayjsToTime };