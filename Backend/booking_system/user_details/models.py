from email.policy import default

from django.db import models


class LoginDetails(models.Model):
    name = models.CharField(max_length=100, null=True, blank=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=180)

    def __str__(self):
        return self.email
    
class Movie(models.Model):
    title=models.CharField(max_length=200)
    poster = models.ImageField(upload_to="posters/")
    language = models.CharField(max_length=50)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.title

class Theatre(models.Model):
    name=models.CharField(max_length=200)
    location=models.CharField(max_length=200)

    def __str__(self):
        return self.name

class Show(models.Model):
    movie=models.ForeignKey(Movie, on_delete=models.CASCADE)
    theatre=models.ForeignKey(Theatre, on_delete=models.CASCADE)
    show_date=models.DateField()
    show_time=models.TimeField()
    def __str__(self):
        return f"{self.movie.title} -{self.theatre.name}"

class Booking(models.Model):
    user=models.ForeignKey(LoginDetails, on_delete=models.CASCADE)
    show=models.ForeignKey(Show,on_delete=models.CASCADE)
    customer_name = models.CharField(max_length=150)
    phone_number = models.CharField(max_length=15)

    total_tickets = models.IntegerField()
    total_price = models.DecimalField(max_digits=8, decimal_places=2)

    payment_method = models.CharField(max_length=50)
    booking_status = models.CharField(max_length=50, default="CONFIRMED")

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.customer_name} - {self.show}"

class BookedSeat(models.Model):
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE, related_name="seats")
    seat_number = models.CharField(max_length=10)
    seat_type = models.CharField(max_length=20)

    def __str__(self):
        return f"{self.seat_number} - {self.seat_type}"

class Rating(models.Model):
    user = models.ForeignKey(LoginDetails, on_delete=models.CASCADE)
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)

    rating = models.IntegerField()
    rated_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.email} rated {self.movie.title}"



class ActivityLog(models.Model):
    user = models.ForeignKey(LoginDetails, on_delete=models.CASCADE)
    movie = models.ForeignKey(Movie, on_delete=models.SET_NULL, null=True, blank=True)
    show = models.ForeignKey(Show, on_delete=models.SET_NULL, null=True, blank=True)

    action = models.CharField(max_length=255)


    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.email} - {self.action}"