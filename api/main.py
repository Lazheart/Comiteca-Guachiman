from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.exceptions import NotFoundError, InvalidRequestError, not_found_handler, invalid_request_handler, general_exception_handler
from endpoints import materials, copies, events, institutions, donations, loans, reservations, statistics

app = FastAPI(title="Comicteca Guachimán API")

# Configuración de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
