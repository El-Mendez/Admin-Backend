from rest_framework import serializers, status
from rest_framework.response import Response
from django.http import JsonResponse
from rest_framework.decorators import api_view
from .models import SocialMediaPlatform


@api_view(['GET'])
def get_all_social_platforms(request):
    platforms = SocialMediaPlatform.nodes.all()
    response = []
    for platform in platforms:
        response.append({
            "name": platform.name,
            "url": platform.url,
        })
    # serializer = SocialMediaPlatformSerializer(platforms)
    return JsonResponse(response, safe=False)

