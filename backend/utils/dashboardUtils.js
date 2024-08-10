import { addDays, differenceInCalendarDays } from 'date-fns';

const fillMissingDates = (data, startDate, endDate) => {
  const filledData = [];
  const dateMap = new Map();

  data.forEach(entry => {
    const formattedDate = `${entry._id.year}-${entry._id.month}-${entry._id.day}`;
    dateMap.set(formattedDate, entry.total);
  });

  const daysBetween = differenceInCalendarDays(endDate, startDate);
  for (let i = 0; i <= daysBetween; i++) {
    const currentDate = addDays(startDate, i);
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1; 
    const day = currentDate.getDate();
    const formattedDate = `${year}-${month}-${day}`;

    filledData.push({
      _id: { year, month, day },
      total: dateMap.get(formattedDate) || 0,
    });
  }

  return filledData;
};

export const getDailyData = async (Model, startDate, endDate) => {
  const result = await Model.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lt: endDate },
      },
    },
    {
      $group: {
        _id: {
          day: { $dayOfMonth: "$createdAt" },
          month: { $month: "$createdAt" },
          year: { $year: "$createdAt" },
        },
        total: { $sum: 1 },
      },
    },
    {
      $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 },
    },
  ]);

  return fillMissingDates(result, startDate, endDate);
};

export const getDailyProfit = async (Model, startDate, endDate) => {
  const result = await Model.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lt: endDate },
      },
    },
    {
      $group: {
        _id: {
          day: { $dayOfMonth: "$createdAt" },
          month: { $month: "$createdAt" },
          year: { $year: "$createdAt" },
        },
        total: { $sum: "$orderedAmount.total" },
      },
    },
    {
      $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 },
    },
  ]);

  return fillMissingDates(result, startDate, endDate);
};

export const getDailySales = async (Model, startDate, endDate) => {
  const result = await Model.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lt: endDate },
      },
    },
    {
      $unwind: "$orderedItems" 
    },
    {
      $group: {
        _id: {
          day: { $dayOfMonth: "$createdAt" },
          month: { $month: "$createdAt" },
          year: { $year: "$createdAt" },
        },
        total: { $sum: "$orderedItems.quantity" }, 
      },
    },
    {
      $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 },
    },
  ]);

  return fillMissingDates(result, startDate, endDate);
};

export const getDailyCustomers = async (Model, startDate, endDate) => {
    const result = await Model.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lt: endDate },
          $or: [
            { isAdmin: { $exists: false } },
            { isAdmin: false },
          ],
          $or: [
            { isStaff: { $exists: false } },
            { isStaff: false },
          ],
        },
      },
      {
        $group: {
          _id: {
            day: { $dayOfMonth: "$createdAt" },
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          total: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 },
      },
    ]);

    return fillMissingDates(result, startDate, endDate);
  };

export const calculateTotal = (data) => {
  return data.reduce((sum, day) => sum + day.total, 0);
};

export const calculateOverallPercentageChange = (currentTotal, previousTotal) => {
  if (previousTotal === 0) {
    return currentTotal > 0 ? 100 : 0;
  }
  return ((currentTotal - previousTotal) / previousTotal) * 100;
};

export const calculatePercentageChange = (data) => {
  if (data.length < 2) return data;

  const percentageChangeData = [];

  for (let i = 0; i < data.length; i++) {
    const currentDay = data[i];
    const previousDay = data[i - 1] || { total: 0 };

    const percentageChange = previousDay.total
      ? ((currentDay.total - previousDay.total) / previousDay.total) * 100
      : 0;

    percentageChangeData.push({
      ...currentDay,
      percentageChange: percentageChange.toFixed(2), 
    });
  }

  return percentageChangeData;
};
