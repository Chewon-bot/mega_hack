export const validateProgress = (game, progress) => {
  if (progress.length === 0 || progress[0] !== 'start') {
    return null
  }
  let coins = game['start'].coins ?? 0
  let choices = game['start'].choices
  for (const current of progress.slice(1)) {
    if (!choices.some(choice => choice.next === current)) {
      return null
    }
    coins += game[current].coins ?? 0
    choices = game[current].choices
  }
  return coins
}
