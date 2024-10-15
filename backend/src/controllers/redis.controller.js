import Redis from "ioredis";  // Make sure you import correctly

const redis = new Redis({
  host: '127.0.0.1',
  port: 6379,
});

// Update bed count upon admission
const admitPatient = async (hospitalId) => {
  try {
    const currentCount = await redis.get(hospitalId); // Get current count
    const newCount = currentCount ? parseInt(currentCount) - 1 : 0; // Decrease bed count
    await redis.set(hospitalId, newCount); // Update bed count in Redis
    console.log(`Admitted patient, new bed count for ${hospitalId}: ${newCount}`);
  } catch (error) {
    console.error('Error updating bed count on admission:', error);
  }
};

// Update bed count upon discharge
const dischargePatient = async (hospitalId) => {
  try {
    const currentCount = await redis.get(hospitalId); // Get current count
    const newCount = currentCount ? parseInt(currentCount) + 1 : 1; // Increase bed count
    await redis.set(hospitalId, newCount); // Update bed count in Redis
    console.log(`Discharged patient, new bed count for ${hospitalId}: ${newCount}`);
  } catch (error) {
    console.error('Error updating bed count on discharge:', error);
  }
};

// Get live bed count
const getLiveBedCount = async (hospitalId) => {
  const liveCount = await redis.get(hospitalId);
  return liveCount ? parseInt(liveCount) : 0;
};

export {
  admitPatient,
  dischargePatient,
  getLiveBedCount
};
