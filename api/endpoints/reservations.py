from fastapi import APIRouter, Depends
from core.config import get_db_connection
from repositories.reservations import ReservationRepository
from psycopg import Connection
from core.pagination import get_pagination_params

router = APIRouter(prefix="/reservations", tags=["Reservations"])

@router.get("")
def get_reservations(pagination: dict = Depends(get_pagination_params), conn: Connection = Depends(get_db_connection)):
    repo = ReservationRepository(conn)
    return repo.get_all(**pagination)

@router.get("/pending")
def get_pending_reservations(pagination: dict = Depends(get_pagination_params), conn: Connection = Depends(get_db_connection)):
    repo = ReservationRepository(conn)
    return repo.get_pending(**pagination)

@router.get("/member/{dni}")
def get_member_reservations(dni: int, pagination: dict = Depends(get_pagination_params), conn: Connection = Depends(get_db_connection)):
    repo = ReservationRepository(conn)
    return repo.get_by_member(dni, **pagination)
