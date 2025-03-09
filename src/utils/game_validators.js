export const validateProgress = (game, progress) => {
  if (progress.length === 0 || progress[0] !== 'start') {
    return false
  }
  let choices = game['start'].choices
  for (const current of progress.slice(1)) {
    if (!choices.some(choice => choice.next === current)) {
      return false
    }
    choices = game[current].choices
  }
  return true
}
