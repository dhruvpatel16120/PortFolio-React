// IP Address and Location Detection Service
// This service uses free APIs to detect user's IP address and location

export const getIPAddress = async () => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error('Error fetching IP address:', error);
    return 'Unknown';
  }
};

export const getLocationFromIP = async (ipAddress) => {
  try {
    const response = await fetch(`https://ipapi.co/${ipAddress}/json/`);
    const data = await response.json();
    
    return {
      country: data.country_name || 'Unknown',
      city: data.city || 'Unknown',
      region: data.region || 'Unknown',
      timezone: data.timezone || 'Unknown',
      latitude: data.latitude,
      longitude: data.longitude
    };
  } catch (error) {
    console.error('Error fetching location:', error);
    return {
      country: 'Unknown',
      city: 'Unknown',
      region: 'Unknown',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      latitude: null,
      longitude: null
    };
  }
};

export const getEnhancedLocationData = async () => {
  try {
    const ipAddress = await getIPAddress();
    const location = await getLocationFromIP(ipAddress);
    
    return {
      ipAddress,
      location
    };
  } catch (error) {
    console.error('Error getting enhanced location data:', error);
    return {
      ipAddress: 'Unknown',
      location: {
        country: 'Unknown',
        city: 'Unknown',
        region: 'Unknown',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        latitude: null,
        longitude: null
      }
    };
  }
}; 