export const colors= [
    'bg-purple-500',
    'bg-indigo-500',
    'bg-pink-500',
    'bg-blue-500',
    'bg-teal-500',
    'bg-amber-500',
    'bg-rose-500',
]
export function getRandomColor(){
    const index= Math.floor(Math.random() * colors.length)
    return colors[index]
}

export function formatTimeAgo(dateString){
  const date= new Date(dateString)
  const now = new Date()
  const diffMs= now - date

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) return "Just now";
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
  if (weeks < 5) return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
  if (months < 12) return `${months} month${months > 1 ? "s" : ""} ago`;
  return `${years} year${years > 1 ? "s" : ""} ago`;
}