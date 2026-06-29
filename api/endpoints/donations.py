from fastapi import APIRouter, Depends
from core.config import get_db_connection
from repositories.donations import DonationRepository
from psycopg import Connection
from core.pagination import get_pagination_params

router = APIRouter(prefix="/donations", tags=["Donations"])

@router.get("")
def get_donations(pagination: dict = Depends(get_pagination_params), conn: Connection = Depends(get_db_connection)):
    repo = DonationRepository(conn)
    return repo.get_all(**pagination)

@router.get("/statistics")
def get_donation_statistics(conn: Connection = Depends(get_db_connection)):
    repo = DonationRepository(conn)
    return repo.get_statistics()
