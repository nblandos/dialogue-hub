from flask import Blueprint, jsonify, request
from src import ai_service

ai_bp = Blueprint('ai', __name__)


@ai_bp.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        user_message = data.get('message')

        if not user_message:
            return jsonify({'error': 'No message provided'}), 400

        ai_response = ai_service.get_ai_response(user_message)

        return jsonify({
            'response': ai_response,
            'success': True
        })

    except Exception as e:
        return jsonify({
            'error': str(e),
            'success': False
        }), 500
