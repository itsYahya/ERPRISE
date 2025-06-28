from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.utils.timezone import now
import json
from .mongo import attendance_collection

def serialize_attendance(doc):
    return {
        'id': str(doc.get('_id')),
        'user_id': str(doc.get('user_id')),
        'name': doc.get('name', 'Unknown'),
        'login_time': doc.get('login_time').strftime('%Y-%m-%d %H:%M:%S') if doc.get('login_time') else '',
        'logout_time': doc.get('logout_time').strftime('%Y-%m-%d %H:%M:%S') if doc.get('logout_time') else '',
        'status': doc.get('status', 'unknown')
    }

@csrf_exempt
def record_login(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            user_id = data.get('user_id')
            name = data.get('name', 'Unknown')

            if not user_id:
                return JsonResponse({'error': 'user_id is required'}, status=400)

            attendance_collection.insert_one({
                'user_id': user_id,
                'name': name,
                'login_time': now(),
                'logout_time': None,
                'status': 'present'
            })
            return JsonResponse({'message': 'Login recorded'}, status=201)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'Method not allowed'}, status=405)

@csrf_exempt
def record_logout(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            user_id = data.get('user_id')

            if not user_id:
                return JsonResponse({'error': 'user_id is required'}, status=400)

            result = attendance_collection.find_one_and_update(
                {'user_id': user_id, 'logout_time': None},
                {'$set': {'logout_time': now(), 'status': 'left'}},
                sort=[('login_time', -1)]
            )

            if not result:
                return JsonResponse({'error': 'No active session found for user'}, status=404)

            return JsonResponse({'message': 'Logout recorded'}, status=200)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'Method not allowed'}, status=405)

def get_attendance(request):
    if request.method == "GET":
        try:
            records = list(attendance_collection.find().sort("login_time", -1))
            serialized = [serialize_attendance(doc) for doc in records]
            return JsonResponse(serialized, safe=False)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'Method not allowed'}, status=405)