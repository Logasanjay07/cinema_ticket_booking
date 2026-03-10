from django.contrib import admin

from.models import (
   LoginDetails,
   Movie,
   Theatre,
   Show,
   Booking,
   BookedSeat,
   Rating,
   ActivityLog

)
admin.site.register(LoginDetails)
admin.site.register(Movie)
admin.site.register(Theatre)
admin.site.register(Show)
admin.site.register(Booking)
admin.site.register(BookedSeat)
admin.site.register(Rating)
admin.site.register(ActivityLog)


