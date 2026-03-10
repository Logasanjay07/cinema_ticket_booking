from django.conf import settings
from django.conf.urls.static import static
from django.urls import path
from .views import (
    signup,
    login,
    get_movies,
    get_movie,
    get_shows,
    get_booked_seats,
    book_ticket,
    rate_movie,
)



urlpatterns = [
    path('signup/', signup),
    path('login/', login),
    path('movies/', get_movies),
    path('movies/<int:movie_id>/', get_movie),
    path('shows/<int:movie_id>/', get_shows),
    path('booked-seats/<int:show_id>/', get_booked_seats),
    path('book-ticket/', book_ticket),
    path('rate-movie/', rate_movie),
]
