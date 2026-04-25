from django.shortcuts import render
#
#-----------------------------
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import LoginDetails
from django.contrib.auth.models import User
from django.http import JsonResponse

def reset_password(request):
    user = User.objects.filter(username="admin").first()

    if not user:
        user = User.objects.create_superuser(
            username="logasanjay",
            email="logasanjay06@gmail.com",
            password="Sanjay@2003"
        )
        return JsonResponse({"message": "User created"})

    user.set_password("Sanjay@2003")
    user.save()

    return JsonResponse({"message": "Password updated"})

@api_view(['POST'])
def signup(request):
    name = request.data.get('username')  or "Guest"
    email = request.data.get('email')
    password = request.data.get('password')

    # Check duplicate email
    if LoginDetails.objects.filter(email=email).exists():
        return Response({
            "status": False,
            "message": "User already exists"
        })

    # Save directly in your table
    LoginDetails.objects.create(
        name=name,
        email=email,
        password=password
    )

    return Response({
        "status": True,
        "message": "User registered successfully"
    })
#---------------
@api_view(['POST'])
def login(request):
    email = request.data.get('email')
    password = request.data.get('password')

    try:
        user = LoginDetails.objects.get(email=email)
    except LoginDetails.DoesNotExist:
        return Response({
            "status": False,
            "message": "User not found"
        })

    # Simple password check
    if user.password == password:
        return Response({
            "status": True,
            "message": "Login successful"
        })
    else:
        return Response({
            "status": False,
            "message": "Invalid password"
        })

from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import (
    Movie, Theatre, Show,
    Booking, BookedSeat,
    Rating, ActivityLog,
    LoginDetails
)

# ----------------------------------
@api_view(['GET'])
def get_movies(request):

    movies = Movie.objects.all()

    data = []

    for movie in movies:
        data.append({
            "id": movie.id,
            "title": movie.title,
            "poster": movie.poster.url if movie.poster else "",
            "language": movie.language,
            "description": movie.description
        })

    return Response({
        "status": True,
        "data": data
    })

# ----------------------------------
@api_view(['GET'])
def get_movie(request, movie_id):

    try:
        movie = Movie.objects.get(id=movie_id)

        return Response({
            "status": True,
            "data": {
                "id": movie.id,
                "title": movie.title,
                "poster": movie.poster.url if movie.poster else "",
                "language": movie.language,
                "description": movie.description
            }
        })

    except Movie.DoesNotExist:
        return Response({
            "status": False,
            "message": "Movie not found"
        })
# ----------------------------------
@api_view(['GET'])
def get_shows(request, movie_id):

    shows = Show.objects.filter(movie_id=movie_id)

    data = []

    for show in shows:
        data.append({
            "id": show.id,
            "show_date": show.show_date,
            "show_time": show.show_time,
            "theatre_name": show.theatre.name,
            "theatre_location": show.theatre.location
        })

    return Response({
        "status": True,
        "data": data
    })

# ----------------------------------
@api_view(['GET'])
def get_booked_seats(request, show_id):
    seats = BookedSeat.objects.filter(
        booking__show_id=show_id
    ).values("seat_number", "seat_type")

    return Response({"status": True, "data": list(seats)})

# ----------------------------------
@api_view(['POST'])
def book_ticket(request):
    user_email = request.data.get("email")

    try:
        user = LoginDetails.objects.get(email=user_email)
    except LoginDetails.DoesNotExist:
        return Response({"status": False, "message": "User not found"})

    show_id = request.data.get("show_id")
    name = request.data.get("name")
    phone = request.data.get("phone")
    payment_method = request.data.get("payment_method")
    seats = request.data.get("seats")
    total = request.data.get("total")

    booking = Booking.objects.create(
        user=user,
        show_id=show_id,
        customer_name=name,
        phone_number=phone,
        total_tickets=len(seats),
        total_price=total,
        payment_method=payment_method
    )

    for seat in seats:
        BookedSeat.objects.create(
            booking=booking,
            seat_number=seat["seat_number"],
            seat_type=seat["seat_type"]
        )

    ActivityLog.objects.create(
        user=user,
        movie=booking.show.movie,
        show=booking.show,
        action="BOOKED_TICKET"
    )

    return Response({"status": True, "message": "Booking successful"})

# ----------------------------------
@api_view(['POST'])
def rate_movie(request):
    email = request.data.get("email")
    movie_id = request.data.get("movie_id")
    rating_value = request.data.get("rating")

    try:
        user = LoginDetails.objects.get(email=email)
    except LoginDetails.DoesNotExist:
        return Response({"status": False, "message": "User not found"})

    Rating.objects.update_or_create(
        user=user,
        movie_id=movie_id,
        defaults={"rating": rating_value}
    )

    ActivityLog.objects.create(
        user=user,
        movie_id=movie_id,
        action="RATED_MOVIE"
    )

    return Response({"status": True, "message": "Rating saved"})