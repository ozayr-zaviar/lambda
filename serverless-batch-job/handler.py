import chess
import json
from datetime import datetime, timedelta
import boto3

def compute_moves(event, context):
    start_time = datetime.now()
    end_time = start_time + timedelta(seconds=2)
    board = chess.Board()
    legal_moves = list(board.legal_moves)
    turn = 0
    moves = {}

    while datetime.now() < end_time and legal_moves:
        turn += 1
        move = legal_moves.pop()
        board.push(move)

        # Generate all legal moves for the new position
        legal_moves = list(board.legal_moves) + legal_moves

        # Undo the move to get back to the original position
        board.pop()

        # Save the moves in the object
        moves[str(turn)] = str(move)

    # Save all moves in a single object in the S3 bucket
    s3 = boto3.client('s3')
    s3.put_object(
        Bucket='thesislambdabucket',
        Key=f'moves/{start_time}.json',
        Body=json.dumps(moves)
    )
