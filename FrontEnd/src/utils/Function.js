const calculateAverageDuration = (episodes) => {
    if (episodes.length === 0) return 0;
    const totalDuration = episodes.reduce((total, episode) => total + episode.duration, 0);
    return Math.round(totalDuration / episodes.length);
};

// Capitalize the first letter of a string
const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

export {calculateAverageDuration, capitalizeFirstLetter }
