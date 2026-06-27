from fastapi import APIRouter, Depends
from core.config import get_db_connection
from repositories.reservations import ReservationRepository
from psycopg import Connection

router = APIRouter(prefix="/reservations", tags=["Reservations"])

@router.get("")
def get_reservations(conn: Connection = Depends(get_db_connection)):
    repo = ReservationRepository(conn)
    return repo.get_all()

@router.get("/pending")
def get_pending_reservations(conn: Connection = Depends(get_db_connection)):
    repo = ReservationRepository(conn)
    return repo.get_pending()

@router.get("/member/{dni}")
def get_member_reservations(dni: int, conn: Connection = Depends(get_db_connection)):
    repo = ReservationRepository(conn)
    return repo.get_by_member(dni)
