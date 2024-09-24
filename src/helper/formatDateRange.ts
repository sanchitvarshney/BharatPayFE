export function formatDateRange(dateRange: [Date, Date]): string {
    const format = (date: Date): string => {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    };
  
    const [startDate, endDate] = dateRange;
    const formattedStartDate = format(startDate);
    const formattedEndDate = format(endDate);
  
    return `${formattedStartDate}-${formattedEndDate}`;
  }
  
 
  