def _normalize_choice(choice):
    if not choice:
        return None

    normalized = str(choice).strip().lower()
    mapping = {
        "rock": "Rock",
        "paper": "Paper",
        "scissor": "Scissor",
        "scissors": "Scissor",
    }
    return mapping.get(normalized, normalized.capitalize())


def determine_winner(player1, player2):
    '''
    Player1 returns: True

    Player2 returns: False
    '''
    player1 = _normalize_choice(player1)
    player2 = _normalize_choice(player2)

    if player1 == "Rock":
        if player2 == "Scissor":
            return True
        if player2 == "Paper":
            return False

    elif player1 == "Paper":
        if player2 == "Scissor":
            return False
        if player2 == "Rock":
            return True

    elif player1 == "Scissor":
        if player2 == "Paper":
            return True
        if player2 == "Rock":
            return False

    return False


def evaluate_round(player1, player2):
    player1 = _normalize_choice(player1)
    player2 = _normalize_choice(player2)

    if not player1 or not player2:
        return {"is_tie": False, "winner": None, "message": "Waiting for both players"}

    if player1 == player2:
        return {"is_tie": True, "winner": None, "message": "It's a tie"}

    if determine_winner(player1, player2):
        return {"is_tie": False, "winner": "player1", "message": "Player 1 wins"}

    return {"is_tie": False, "winner": "player2", "message": "Player 2 wins"}


def get_game_result(scores, player_names=None):
    player1_score = scores.get("player1", 0)
    player2_score = scores.get("player2", 0)

    if player1_score > player2_score:
        if player_names and len(player_names) >= 1:
            return {"winner": "player1", "message": f"{player_names[0]} is the winner"}
        return {"winner": "player1", "message": "Player 1 wins"}

    if player2_score > player1_score:
        if player_names and len(player_names) >= 2:
            return {"winner": "player2", "message": f"{player_names[1]} is the winner"}
        return {"winner": "player2", "message": "Player 2 wins"}

    return {"winner": "tie", "message": "It's a tie"}