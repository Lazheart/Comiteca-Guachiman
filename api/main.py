from fastapi import FastAPI
from core.exceptions import NotFoundError, InvalidRequestError, not_found_handler, invalid_request_handler, general_exception_handler
from endpoints import materials, copies, events, institutions, donations, loans, reservations, statistics

app = FastAPI(title="Comicteca Guachimán API")

app.add_exception_handler(NotFoundError, not_found_handler)
app.add_exception_handler(InvalidRequestError, invalid_request_handler)
app.add_exception_handler(Exception, general_exception_handler)

app.include_router(materials.router)
app.include_router(copies.router)
app.include_router(events.router)
app.include_router(institutions.router)
app.include_router(donations.router)
app.include_router(loans.router)
app.include_router(reservations.router)
app.include_router(statistics.router)
