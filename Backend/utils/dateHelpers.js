// Helper function to get current date in IST timezone
const getISTDate = (date = new Date()) => {
  return new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
};

// Helper function to calculate revision dates in IST
export const calculateRevisionDates = (solvedDate, reminderDays) => {
  const revisionDates = [];
  const istSolvedDate = getISTDate(solvedDate);
  
  // Reset time to midnight IST for consistent date comparison
  istSolvedDate.setHours(0, 0, 0, 0);
  
  reminderDays.forEach(dayOffset => {
    const revisionDate = new Date(istSolvedDate);
    revisionDate.setDate(revisionDate.getDate() + dayOffset);
    revisionDates.push({
      date: revisionDate,
      dayOffset
    });
  });
  
  return revisionDates;
};

// Helper function to normalize date to midnight IST
export const normalizeDate = (date) => {
  // If it's a date string in YYYY-MM-DD format, parse it as IST midnight
  if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
    const [year, month, day] = date.split('-').map(Number);
    // Create date in IST
    const istDate = new Date(year, month - 1, day, 0, 0, 0, 0);
    return istDate;
  }
  const istDate = getISTDate(date);
  istDate.setHours(0, 0, 0, 0);
  return istDate;
};

// Helper function to get start and end of day in IST
export const getDayBounds = (date) => {
  const istDate = getISTDate(date);
  
  const start = new Date(istDate);
  start.setHours(0, 0, 0, 0);
  
  const end = new Date(istDate);
  end.setHours(23, 59, 59, 999);
  
  return { start, end };
};
