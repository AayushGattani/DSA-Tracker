import { useMemo } from 'react';

const ContributionCalendar = ({ data = [] }) => {
  const { weeks, monthLabels, totalCount } = useMemo(() => {
    // Create a map of existing data
    const dataMap = new Map();
    data.forEach(day => {
      dataMap.set(day.date, day.count || 0);
    });

    // Helper to format date as YYYY-MM-DD in local timezone
    const formatLocalDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    // Calculate the date range: 52 weeks ending on today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Find the start date (52 weeks ago, starting from Sunday)
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 364); // Go back ~52 weeks
    // Adjust to start from Sunday of that week
    const dayOfWeek = startDate.getDay();
    startDate.setDate(startDate.getDate() - dayOfWeek);

    // Generate weeks array
    const weeks = [];
    const monthLabels = [];
    let currentDate = new Date(startDate);
    let totalCount = 0;
    let lastMonth = -1;

    while (weeks.length < 53) {
      const week = [];
      const weekStartMonth = currentDate.getMonth();
      
      // Check if this week starts a new month (use first day of week for label)
      if (weekStartMonth !== lastMonth) {
        monthLabels.push({ 
          month: weekStartMonth, 
          weekIndex: weeks.length,
          year: currentDate.getFullYear()
        });
        lastMonth = weekStartMonth;
      }
      
      for (let day = 0; day < 7; day++) {
        const currentDateOnly = new Date(currentDate);
        currentDateOnly.setHours(0, 0, 0, 0);
        
        if (currentDateOnly > today) {
          week.push(null);
        } else {
          const dateString = formatLocalDate(currentDate);
          const count = dataMap.get(dateString) || 0;
          totalCount += count;
          
          week.push({
            date: dateString,
            count,
            dayOfMonth: currentDate.getDate(),
            month: currentDate.getMonth(),
            year: currentDate.getFullYear()
          });
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      weeks.push(week);
    }

    return { weeks, monthLabels, totalCount };
  }, [data]);

  const getColor = (count) => {
    if (count === 0) return 'bg-[#161b22]';
    if (count === 1) return 'bg-[#0e4429]';
    if (count === 2) return 'bg-[#006d32]';
    if (count <= 4) return 'bg-[#26a641]';
    return 'bg-[#39d353]';
  };

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split('-');
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Calendar Container */}
      <div className="inline-flex flex-col">
        {/* Calendar Grid with Month Labels */}
        <div className="flex">
          {/* Day Labels Column */}
          <div className="flex flex-col mr-3 pt-[22px]">
            {dayLabels.map((day, index) => (
              <div 
                key={index} 
                className="h-[12px] mb-[4px] flex items-center justify-end"
                style={{ visibility: index % 2 === 1 ? 'visible' : 'hidden' }}
              >
                <span className="text-[11px] font-medium text-white/50 leading-none">
                  {day}
                </span>
              </div>
            ))}
          </div>

          {/* Weeks Grid with Month Labels */}
          <div className="flex flex-col">
            {/* Month Labels Row */}
            <div className="flex h-[18px] mb-1">
              {weeks.map((_, weekIndex) => {
                const monthLabel = monthLabels.find(m => m.weekIndex === weekIndex);
                return (
                  <div key={weekIndex} className="w-[12px] mr-[4px] flex-shrink-0">
                    {monthLabel && (
                      <span className="text-[11px] font-medium text-white/60 whitespace-nowrap">
                        {monthNames[monthLabel.month]}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Contribution Blocks */}
            <div className="flex">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col mr-[4px]">
                  {week.map((day, dayIndex) => (
                    <div
                      key={dayIndex}
                      className={`w-[12px] h-[12px] mb-[4px] rounded-[3px] transition-all duration-200 hover:ring-2 hover:ring-white/30 hover:ring-offset-1 hover:ring-offset-[#0a0a0a] ${
                        day ? `${getColor(day.count)} cursor-pointer` : 'bg-transparent'
                      }`}
                      title={day ? `${day.count} contribution${day.count !== 1 ? 's' : ''} on ${formatDate(day.date)}` : ''}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 w-full px-1">
          <span className="text-[12px] font-medium text-white/50">
            {totalCount} contribution{totalCount !== 1 ? 's' : ''} in the last year
          </span>
          <div className="flex items-center gap-[6px]">
            <span className="text-[11px] font-medium text-white/40">Less</span>
            <div className="flex gap-[3px]">
              <div className="w-[12px] h-[12px] rounded-[3px] bg-[#161b22]"></div>
              <div className="w-[12px] h-[12px] rounded-[3px] bg-[#0e4429]"></div>
              <div className="w-[12px] h-[12px] rounded-[3px] bg-[#006d32]"></div>
              <div className="w-[12px] h-[12px] rounded-[3px] bg-[#26a641]"></div>
              <div className="w-[12px] h-[12px] rounded-[3px] bg-[#39d353]"></div>
            </div>
            <span className="text-[11px] font-medium text-white/40">More</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContributionCalendar;
