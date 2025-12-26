export const checkBadges = (user) => {
  if (user.points >= 80 && !user.badges.includes("Diamond")) {
    user.badges.push("Diamond");
  } 
  else if (user.points >= 70 && !user.badges.includes("Gold")) {
    user.badges.push("Gold");
  }
  else if (user.points >= 50 && !user.badges.includes("Bronze")) {
    user.badges.push("Bronze");
  }
};
