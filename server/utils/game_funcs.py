def determine_winner(player1, player2):
  '''
  Player1 returns: True

  Player2 returns: False
  '''
  if player1 == "Rock":
    if player2 == "Scissor":
      return True
    elif player2 == "Paper":
      return False

  elif player1 == "Paper":
    if player2 == "Scissor":
      return False
    elif player2 == "Rock":
      return True

  elif player1 == "Scissor":
    if player2 == "Paper":
      return True
    elif player2 == "Rock":
      return False